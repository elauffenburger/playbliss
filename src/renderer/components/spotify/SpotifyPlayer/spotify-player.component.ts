import Vue from "vue";
import { SubscribeActionStore } from "vuex";

import { AppState } from "../../../store";
import { Component } from "vue-property-decorator";

import { Store } from "vuex";

import { MusicSource } from "../../../models";
import { mapSpotifyTrack } from "../../../helpers/tracks";
import { SpotifyPlayerService } from "../../../services/player/spotify-player";
import { MasterPlayerService } from "../../../services/player";

const STATE_POLL_INTERVAL_MS = 1000;
const SONG_ENDED_THRESHOLD = 100;

@Component({
  name: "SpotifyPlayer"
})
export default class SpotifyPlayer extends Vue {

  get store(): SubscribeActionStore<AppState> {
    return this.$store as any;
  }

  mounted() {
    if (this.$services) {
      const poller = new SpotifyPoller(
        this.$services.player,
        this.$services.spotifyPlayer,
        this.$store,
        {
          singlePoller: true
        }
      );

      poller.startPolling();
    }
  }
}

class SpotifyPoller {
  private static poller?: any;

  constructor(
    private player: MasterPlayerService,
    private spotifyPlayer: SpotifyPlayerService,
    private store: Store<AppState>,
    private options: {
      singlePoller: boolean;
    }
  ) {}

  startPolling() {
    if (this.options.singlePoller && SpotifyPoller.poller) {
      clearInterval(SpotifyPoller.poller);
    }

    SpotifyPoller.poller = setInterval(
      () => this.checkPlaybackState(),
      STATE_POLL_INTERVAL_MS
    );
  }

  async checkPlaybackState() {
    const playerState = this.store.state.player;

    // If the player is playing and it's playing a non-spotify track, abort the poll
    if (
      playerState.isPlaying &&
      playerState.track &&
      playerState.track.track.source != MusicSource.Spotify
    ) {
      return;
    }

    const trackContext = await this.spotifyPlayer.getCurrentTrack();
    const spotifyTrack = trackContext.item;
    const track = mapSpotifyTrack(spotifyTrack);
    const isPlaying = trackContext.is_playing;

    const playerWasPlaying = playerState.isPlaying;
    const originalTrack = playerState.track;

    if (playerState.isPlaying != isPlaying) {
      this.player.setIsPlaying(isPlaying);
    }

    if (playerState.track && playerState.track.track.id != track.id) {
      this.player.setTrack({ track });
    }

    const duration = spotifyTrack.duration_ms;
    const progress = trackContext.progress_ms;
    const progressDelta = duration - progress;
    
    this.player.setTrackProgress(progress);

    if (
      playerWasPlaying &&
      originalTrack &&
      originalTrack.track.id == track.id &&
      (progressDelta < SONG_ENDED_THRESHOLD ||
        trackContext.progress_ms < SONG_ENDED_THRESHOLD)
    ) {
      this.player.notifyTrackEnded({ track });
    }
  }
}