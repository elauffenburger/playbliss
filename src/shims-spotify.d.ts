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

  class Player {
    constructor(options: PlayerConstructorOptions);

    addListener<T>(event: PlayerListenerEvent, cb: (args: T | any) => void): void;
    connect(): void;
  }
}
