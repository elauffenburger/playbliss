const SDK_URL = "https://sdk.scdn.co/spotify-player.js";

function importSdk() {
  const script = document.createElement("script");
  script.setAttribute("src", SDK_URL);

  document.head.appendChild(script);
}

function initSdk(getTokenFn: (cb: (token: string) => void) => void) {
  window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
      getOAuthToken: getTokenFn
    });

    const errorEvents: Spotify.PlayerListenerEvent[] = [
      "initialization_error",
      "authentication_error",
      "account_error",
      "playback_error"
    ];

    for (let event of errorEvents) {
      player.addListener(event, (args: { message: string }) => {
        console.error(
          `Something went wrong initializing spotify web sdk: %O`,
          args.message
        );
      });
    }
  };
}

export function initSpotifyPlaybackSdk(
  getTokenFn: Spotify.GetOAuthTokenCallback
) {
  importSdk();
  initSdk(getTokenFn);
}
