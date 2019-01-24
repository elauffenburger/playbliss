const SDK_URL = "https://sdk.scdn.co/spotify-player.js";

function importSdk() {
  const script = document.createElement("script");
  script.setAttribute("src", SDK_URL);

  document.head.appendChild(script);
}

function initSdk(getTokenFn: (cb: (token: string) => void) => void) {
  window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
      name: "PlayBliss",
      getOAuthToken: getTokenFn
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

    // Playback status updates
    player.addListener<any>("player_state_changed", state => {
      console.log(state);
    });

    // Ready
    player.addListener<any>("ready", ({ device_id }) => {
      console.log("Ready with Device ID", device_id);
    });

    // Not Ready
    player.addListener<any>("not_ready", ({ device_id }) => {
      console.log("Device ID has gone offline", device_id);
    });

    player.connect();
  };
}

export function initSpotifyPlaybackSdk(
  getTokenFn: Spotify.GetOAuthTokenCallback
) {
  importSdk();
  initSdk(getTokenFn);
}
