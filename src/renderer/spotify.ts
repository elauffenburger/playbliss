const SDK_URL = "https://sdk.scdn.co/spotify-player.js";

function importSdk() {
  const script = document.createElement("script");
  script.setAttribute("src", SDK_URL);

  document.head.appendChild(script);
}

function initSdk(readyHook: () => void) {
  window.onSpotifyWebPlaybackSDKReady = readyHook;
}

export function initSpotifyPlaybackSdk(readyHook: () => void) {
  importSdk();
  initSdk(readyHook);
}
