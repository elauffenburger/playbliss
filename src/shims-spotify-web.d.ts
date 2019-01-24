declare interface Window {
  onSpotifyWebPlaybackSDKReady: () => void;
}

declare module Spotify {
  type GetOAuthTokenCallback = (cb: (token: string) => void) => void;

  interface PlayerConstructorOptions {
    name: string;
    getOAuthToken: GetOAuthTokenCallback;
  }

  type PlayerListenerEvent =
    | "initialization_error"
    | "authentication_error"
    | "account_error"
    | "playback_error"
    | "player_state_changed"
    | "ready"
    | "not_ready";

  interface WebPlaybackTrack {
    uri: string;
    id: string;
    type: string;
    media_type: string;
    name: string;
    is_playable: boolean;
    album: {
      uri: string;
      name: string;
      images: {
        url: string;
      }[];
    };
    artists: {
      uri: string;
      name: string;
    }[];
  }

  interface WebPlaybackState {
    context: {
      uri: string;
      metadata: any | null;
    };
    disallows: {
      pausing: boolean;
      peeking_next: boolean;
      peeking_prev: boolean;
      resuming: boolean;
      seeking: boolean;
      skipping_next: boolean;
      skipping_prev: boolean;
    };
    paused: boolean;
    position: number;
    repeat_mode: number;
    shuffle: boolean;
    track_window: {
      current_track: WebPlaybackTrack;
      previous_tracks: WebPlaybackTrack[];
      next_tracks: WebPlaybackTrack[];
    };
  }

  class Player {
    constructor(options: PlayerConstructorOptions);

    addListener<T>(
      event: PlayerListenerEvent,
      cb: (args: T) => void
    ): void;
    connect(): void;
    getCurrentState(): WebPlaybackState | null;
    pause(): Promise<void>;
    resume(): Promise<void>;
    togglePlay(): Promise<void>;
    previousTrack(): Promise<void>;
    nextTrack(): Promise<void>;
    seek(positionMs: number): Promise<void>;
  }
}
