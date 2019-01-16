const SDK_URL = "https://sdk.scdn.co/spotify-player.js";

function importSdk() {
  const script = document.createElement("script");
  script.setAttribute("src", SDK_URL);

  document.head.appendChild(script);
}

function initSdk(getTokenFn: (cb: (token: string) => void) => void) {
  window.onSpotifyWebPlaybackSDKReady = () => {
    const token = "BQDHHq-1C_r68i3n5RaprL-EVPOkoyBSblXQFMBTKJjJRFdUX8IafawKM5Tg9_g_VfJe_o39FfPpbxTiwMumEQVP-cxh-atCxorcCoKIsflir_olbu1LbviwNZP6T60MoAAN1B-rPjD28yd80PIEGVMha6eP8OVgAHZ9658p8T6ZU1i1qJpeXs8"
    const player = new Spotify.Player({
      name: "Web Playback SDK Quick Start Player",
      getOAuthToken: cb => {
        cb(token);
      }
    });

    // Error handling
    player.addListener("initialization_error", ({ message }) => {
      console.error(message);
    });
    player.addListener("authentication_error", ({ message }) => {
      console.error(message);
    });
    player.addListener("account_error", ({ message }) => {
      console.error(message);
    });
    player.addListener("playback_error", ({ message }) => {
      console.error(message);
    });

    // Playback status updates
    player.addListener("player_state_changed", state => {
      console.log(state);
    });

    // Ready
    player.addListener("ready", ({ device_id }) => {
      console.log("Ready with Device ID", device_id);
    });

    // Not Ready
    player.addListener("not_ready", ({ device_id }) => {
      console.log("Device ID has gone offline", device_id);
    });

    // Connect to the player!
    player.connect();
  };
  // window.onSpotifyWebPlaybackSDKReady = () => {
  //   const player = new Spotify.Player({
  //     name: "PlayBliss",
  //     getOAuthToken: getTokenFn
  //   });

  //   const errorEvents: Spotify.PlayerListenerEvent[] = [
  //     "initialization_error",
  //     "authentication_error",
  //     "account_error",
  //     "playback_error"
  //   ];

  //   for (let event of errorEvents) {
  //     player.addListener(event, (args: { message: string }) => {
  //       console.error(
  //         `Something went wrong initializing spotify web sdk:`,
  //         args
  //       );
  //     });
  //   }

  //   // Playback status updates
  //   player.addListener<any>("player_state_changed", state => {
  //     console.log(state);
  //   });

  //   // Ready
  //   player.addListener<any>("ready", ({ device_id }) => {
  //     console.log("Ready with Device ID", device_id);
  //   });

  //   // Not Ready
  //   player.addListener<any>("not_ready", ({ device_id }) => {
  //     console.log("Device ID has gone offline", device_id);
  //   });

  //   player.connect();
  // };
}

export function initSpotifyPlaybackSdk(
  getTokenFn: Spotify.GetOAuthTokenCallback
) {
  importSdk();
  initSdk(getTokenFn);
}
