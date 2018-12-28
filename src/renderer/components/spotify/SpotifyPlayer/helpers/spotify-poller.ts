import { Store, SubscribeActionStore } from "vuex";

import {
  MusicSource,
  Track,
  SpotifyTrack,
  PlaylistTrack
} from "../../../../models";
import { mapSpotifyTrack } from "../../../../helpers/tracks";
import { SpotifyPlayerService } from "../../../../services/player/spotify-player";
import { MasterPlayerService } from "../../../../services/player";
import { AppState } from "src/renderer/store";
import { PlayerState } from "src/renderer/store/modules/player";
import { CurrentPlayback } from "spotify-web-api-node";
import { SpotifyService } from "src/renderer/services/spotify";

const LOGGING_ENABLED = false;

// How often we should attempt to poll Spotify
const STATE_POLL_INTERVAL_MS = 1000;

// The margin of error we'll allow before we call a song "ended"
// (meaning: if the song will end in x ms or if it started x ms ago)
const SONG_ENDED_THRESHOLD_MS = 0;

// The max size of the pendingStateQueueconst MAX_PENDING_STATE_QUEUE_LENGTH = 3;
const MAX_PENDING_STATE_QUEUE_LENGTH = 3;

// The min size that the pendingStateQueue has to be before
// we can consider states to agree
const MIN_PENDING_STATE_QUEUE_AGREE_LENGTH = 3;

interface PlaybackState {
  spotifyTrack: SpotifyApi.TrackObjectFull | null;
  trackContext: CurrentPlayback;
  isPlaying: boolean;
  track: SpotifyTrack | null;
}

export class SpotifyPoller {
  private static poller?: any;

  private pendingStateQueue: PlaybackState[] = [];

  constructor(
    private player: MasterPlayerService,
    private spotify: SpotifyService,
    private spotifyPlayer: SpotifyPlayerService,
    private store: SubscribeActionStore<AppState>,
    private options: {
      singlePoller: boolean;
    }
  ) {
    store.subscribeAction(action => {
      this.log(action);

      if (
        action.type.startsWith("player") &&
        action.type != "player/setProgress"
      ) {
        this.log("clearing state queue");
        this.pendingStateQueue = [];
      }
    });
  }

  startPolling() {
    if (this.options.singlePoller && SpotifyPoller.poller) {
      clearInterval(SpotifyPoller.poller);
    }

    SpotifyPoller.poller = setInterval(async () => {
      await this.checkLoggedInState();

      await this.checkPlaybackState();
    }, STATE_POLL_INTERVAL_MS);
  }

  async checkLoggedInState() {
    // If the user isn't logged in, there's nothing to check
    if (!this.store.state.user.spotify.loggedIn) {
      return;
    }

    try {
      await this.spotify.getUser();
    } catch (e) {
      if (e.statusCode == 401) {
        this.spotify.setLoggedIn(false);
      }
    }
  }

  async checkPlaybackState() {
    const playerState = this.store.state.player;

    if (!this.shouldPoll(playerState)) {
      this.log("Determined we shouldn't poll");

      return;
    }

    // Get the current playback state
    const state = await this.getPlaybackState();
    this.addPendingState(state);

    // If we're not playing anything, set track & progress to null and bail
    if (!state.spotifyTrack || !state.track) {
      this.player.setTrack(null);
      this.player.setTrackProgress(null);

      return;
    }

    // Always update the progress since that's unlikely to thrash
    const { trackProgressMs } = this.updateTrackProgress(
      state.spotifyTrack,
      state.trackContext
    );

    // If there's a pending state (as in, the one we just looked at)
    // and it doesn't match what we have right now, wait for one more tick
    // to make sure we aren't thrashing states
    if (!this.statesAgree()) {
      this.log("states disagree; aborting poll");

      return;
    }

    const playerWasPlaying = playerState.isPlaying;
    const originalTrack = playerState.track;

    this.log("originalTrack: ", originalTrack);
    this.log("state.track: ", state.track);

    if (playerState.isPlaying != state.isPlaying) {
      this.player.setIsPlaying(state.isPlaying);
    }

    if (
      !originalTrack ||
      (originalTrack && originalTrack.track.id != state.track.id)
    ) {
      this.player.setTrack({ track: state.track });
    }

    // If the player was originally playing and the track being played is the current track
    // and that that track is within the error threshold, mark the song as ended
    //
    // This works because Spotify will just start the track over at 0ms if the track ends
    if (
      this.trackHasEnded(
        playerWasPlaying,
        originalTrack,
        state.track,
        trackProgressMs
      )
    ) {
      this.player.notifyTrackEnded({ track: state.track });
    }
  }

  private shouldPoll(playerState: PlayerState): boolean {
    // If the user isn't logged in, don't bother
    if (!this.store.state.user.spotify.loggedIn) {
      this.log("Shouldn't poll -- user not logged in");

      return false;
    }

    // Should poll when:
    //  * The player isn't playing and the primary music source is Spotify
    //  * The player is playing, there's a track, and that track's source is Spotify
    let shouldPoll =
      (playerState.primaryMusicSource == MusicSource.Spotify &&
        (!playerState.isPlaying || !playerState.track)) ||
      (!!playerState.track &&
        playerState.track.track.source == MusicSource.Spotify);

    return shouldPoll;
  }

  private trackHasEnded(
    playerWasPlaying: boolean,
    previousTrack: PlaylistTrack | null,
    currentTrack: Track,
    trackProgressMs: number
  ) {
    const progressDelta = currentTrack.durationMs - trackProgressMs;

    const trackHasEnded =
      playerWasPlaying &&
      previousTrack &&
      previousTrack.track.id == currentTrack.id &&
      (progressDelta <= SONG_ENDED_THRESHOLD_MS ||
        trackProgressMs <= SONG_ENDED_THRESHOLD_MS);

    return trackHasEnded;
  }

  private updateTrackProgress(
    spotifyTrack: SpotifyApi.TrackObjectFull,
    trackContext: CurrentPlayback
  ): { progressDelta: number; trackProgressMs: number } {
    const duration = spotifyTrack.duration_ms;
    const progress = trackContext.progress_ms;
    const progressDelta = duration - progress;

    this.player.setTrackProgress(progress);

    return { progressDelta, trackProgressMs: progress };
  }

  statesAgree(): boolean {
    // If we haven't hit the min agree length yet, abort
    if (this.pendingStateQueue.length < MIN_PENDING_STATE_QUEUE_AGREE_LENGTH) {
      this.log(
        `queue length (${
          this.pendingStateQueue.length
        }) < min queue length (${MIN_PENDING_STATE_QUEUE_AGREE_LENGTH})`
      );

      return false;
    }

    // If we HAVE hit the min agree length, but that length is (apparently) 0, say we agree
    if (!this.pendingStateQueue.length) {
      this.log("no queue");

      return true;
    }

    // Take the first state since they should all (hopefully) agree
    const state = this.pendingStateQueue[0];

    return this.pendingStateQueue.reduce((statesAgree, pendingState) => {
      if (!statesAgree) {
        this.log("states disagree");

        return false;
      }

      const playStatesAgree = state.isPlaying == pendingState.isPlaying;

      const noTrack = !state.track && !pendingState.track;
      const tracksAgree =
        noTrack ||
        (!!state.track &&
          !!pendingState.track &&
          state.track.id == pendingState.track.id);

      return playStatesAgree && tracksAgree;
    }, true);
  }

  addPendingState(state: PlaybackState) {
    if (this.pendingStateQueue.length >= MAX_PENDING_STATE_QUEUE_LENGTH) {
      this.pendingStateQueue.shift();
    }

    this.pendingStateQueue.push(state);
  }

  async getPlaybackState(): Promise<PlaybackState> {
    const trackContext = await this.spotifyPlayer.getCurrentTrack();

    const spotifyTrack = trackContext.item;
    if (!spotifyTrack) {
      return {
        spotifyTrack: null,
        trackContext,
        isPlaying: false,
        track: null
      };
    }

    const track = mapSpotifyTrack(spotifyTrack);
    const isPlaying = trackContext.is_playing;

    return {
      spotifyTrack,
      trackContext,
      isPlaying,
      track
    };
  }

  log(...args: any[]): void {
    if (!LOGGING_ENABLED) {
      return;
    }

    console.log(`[SpotifyPoller]:`, ...args);
  }
}
