export default {
  spotify: {
    apiUrl: process.env.ELECTRON_WEBPACK_APP_SPOTIFY_API_URL as string,
    oauth: {
      baseUri: "https://accounts.spotify.com/authorize",
      clientId: process.env.ELECTRON_WEBPACK_APP_SPOTIFY_CLIENT_ID as string,
      redirectUri: process.env.ELECTRON_WEBPACK_APP_SPOTIFY_REDIRECT_URI as string,
      scopes: [
        "playlist-read-private",
        "user-read-private",
        "user-modify-playback-state",
        "user-read-currently-playing",
        "user-read-playback-state"
      ]
    }
  },
  youtube: {
    apiKey: process.env.ELECTRON_WEBPACK_APP_YOUTUBE_API_KEY as string
  }
};
