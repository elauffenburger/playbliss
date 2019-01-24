import SpotifyWebApi, {
  CurrentPlayback,
  PlayOptions
} from "spotify-web-api-node";
import { PlayerService, TrackEndedEventArgs } from ".";
import { Track, MusicSource, PlaylistTrack } from "../../models";
import { Store } from "vuex";
import { AppState } from "src/renderer/store";
import { Subject } from 'rxjs';

export interface SpotifyPlayerService extends PlayerService {
  getCurrentTrack(): Promise<CurrentPlayback>;
  playSpotifyTrack(options: PlayOptions): Promise<any>;
  isPlayingLocally(): Promise<boolean>;
  getLocalPlaybackState(): Promise<Spotify.WebPlaybackState | null>;
  transferPlaybackToLocalPlayer(): Promise<{ success: boolean }>;
}

export class DefaultSpotifyPlayerService implements SpotifyPlayerService {
  private spotifyWebPlayer?: Spotify.Player;
  private spotifyWebPlayerDeviceId?: string;

  constructor(
    private client: SpotifyWebApi,
    private store: Store<AppState>,
    options: {
      initSdk: (readyHook: () => void) => void;
    }
  ) {
    this.init(options.initSdk);
  }

  source = MusicSource.Spotify;
  trackEnded$ = new Subject<TrackEndedEventArgs>();

  playTrack(track: PlaylistTrack): Promise<any> {
    this.log("playing track");

    if (track.track.source != MusicSource.Spotify) {
      throw new Error("track was not a SpotifyTrack");
    }

    return this.playSpotifyTrack({ uris: [track.track.sourceMedia.uri] });
  }

  resumeTrack(): Promise<any> {
    this.log("resuming track");

    return this.client.play();
  }

  async pauseTrack(): Promise<any> {
    this.log("pausing track");

    if ((await this.isPlayingLocally()) && this.spotifyWebPlayer) {
      return await this.spotifyWebPlayer.pause();
    }

    return await this.client.pause();
  }

  async seek(positionMs: number): Promise<any> {
    this.log("seeking track");

    if ((await this.isPlayingLocally()) && this.spotifyWebPlayer) {
      return await this.spotifyWebPlayer.seek(positionMs);
    }

    return this.client.seek(positionMs);
  }

  playSpotifyTrack(options: PlayOptions) {
    this.log("playing spotify track");

    return this.client.play(options);
  }

  async getCurrentTrack(): Promise<CurrentPlayback> {
    this.log("getting current track");

    const response = await this.client.getMyCurrentPlayingTrack();
    const trackContext = response.body;

    return trackContext;
  }

  async isPlayingLocally(): Promise<boolean> {
    const state =
      this.spotifyWebPlayer && (await this.spotifyWebPlayer.getCurrentState());

    return !!state;
  }

  async transferPlaybackToLocalPlayer(): Promise<{ success: boolean }> {
    try {
      if (!this.spotifyWebPlayer || !this.spotifyWebPlayerDeviceId) {
        return {
          success: false
        };
      }

      await this.client.transferMyPlayback({
        deviceIds: [this.spotifyWebPlayerDeviceId],
        play: true
      });

      return {
        success: true
      };
    } catch {
      return {
        success: false
      };
    }
  }

  async getLocalPlaybackState(): Promise<Spotify.WebPlaybackState | null> {
    return (
      (this.spotifyWebPlayer &&
        (await this.spotifyWebPlayer.getCurrentState())) ||
      null
    );
  }

  private init(initSdk: (onReady: () => void) => void) {
    initSdk(() => {
      const player = this.initWebPlayer();

      // Playback status updates
      player.addListener<Spotify.WebPlaybackState>("player_state_changed", state => {
        console.log(state);

        if(state.position === 0 && !state.paused) {
          this.trackEnded$.next();
        }
      });

      // Ready
      player.addListener<any>("ready", ({ device_id }) => {
        console.log("Spotify Web SDK Ready with Device ID", device_id);

        this.spotifyWebPlayer = player;
        this.spotifyWebPlayerDeviceId = device_id;
      });

      // Not Ready
      player.addListener<any>("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.connect();
    });
  }

  private initWebPlayer(): Spotify.Player {
    const player = new Spotify.Player({
      name: "PlayBliss",
      getOAuthToken: cb => cb(this.store.state.user.spotify.token)
    });

    const errorEvents: Spotify.PlayerListenerEvent[] = [
      "initialization_error",
      "authentication_error",
      "account_error",
      "playback_error"
    ];

    for (let event of errorEvents) {
      player.addListener(event, args => {
        console.error(
          `Something went wrong initializing spotify web sdk:`,
          args
        );
      });
    }

    return player;
  }

  private log(...args: any[]) {
    console.log(args);
  }
}
