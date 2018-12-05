import { Module, ActionContext, Store } from "vuex";
import { AppState } from "..";
import SpotifyWebApi from "spotify-web-api-node";
import { OAuthService } from "@/renderer/services/oauth";

export interface UserModuleOptions {
  spotify: SpotifyModuleOptions;
}

export interface SpotifyModuleOptions {
  client: SpotifyWebApi;
  oauth: {
    service: OAuthService;
    baseUri: string;
    clientId: string;
    redirectUri: string;
    scopes: string[];
  };
}

export const GETTERS = {
  SPOTIFY: {
    PLAYLISTS: "playlists",
    OAUTH: {
      AUTHORIZE_URI: "oauth/authorizeUri",
      REDIRECT_URI: "oauth/redirectUri"
    },
    PLAYER: {
      IS_PLAYING: "player/isPlaying",
      IS_PLAYING_TRACK: "player/isPlayingTrack"
    }
  }
};

export const MUTATIONS = {
  SPOTIFY: {
    SET_TOKEN: "setToken",
    SET_LOGGED_IN: "setLoggedIn",
    SET_PLAYLISTS: "setPlaylists",
    SET_USER: "setUser",
    PLAYER: {
      SET_IS_PLAYING: "player/setIsPlaying",
      SET_TRACK: "player/setTrack"
    }
  }
};

export const ACTIONS = {
  SPOTIFY: {
    LOGIN: "login",
    GET_PLAYLISTS: "getPlaylists",
    GET_PLAYLIST_TRACKS: "getPlaylistTracks",
    TOGGLE_PLAY_PAUSE_FOR_TRACK: "player/togglePlayPauseForTrack"
  }
};

export interface UserState {
  spotify: UserSpotifyState;
}

export interface UserSpotifyState {
  loggedIn: boolean;
  token: string;
  playlists: SpotifyApi.PlaylistObjectSimplified[];
  user: SpotifyApi.CurrentUsersProfileResponse | null;
  player: {
    isPlaying: boolean;
    track: SpotifyApi.TrackObjectSimplified | null;
  };
}

export const hydrateSpotifyModule = () => {
  return (store: Store<AppState>) => {
    // Check for an existing access_token and dispatch the login action to simulate a re-login
    const existingToken = store.state.user.spotify.token;
    if (existingToken) {
      store.dispatch("user/spotify/login", existingToken);
    }
  };
};

export function makeSpotifyModule(
  options: SpotifyModuleOptions
): Module<UserSpotifyState, AppState> {
  const client = options.client;

  return {
    namespaced: true,
    state: {
      loggedIn: false,
      token: "",
      playlists: [],
      user: null,
      player: {
        isPlaying: false,
        track: null
      }
    },
    getters: {
      [GETTERS.SPOTIFY.PLAYLISTS](state) {
        return state.playlists;
      },
      [GETTERS.SPOTIFY.OAUTH.AUTHORIZE_URI](state) {
        const oauth = options.oauth;

        return oauth.service.getAuthorizationUri(
          oauth.baseUri,
          oauth.clientId,
          oauth.scopes,
          oauth.redirectUri
        );
      },
      [GETTERS.SPOTIFY.OAUTH.REDIRECT_URI](state) {
        return options.oauth.redirectUri;
      },
      [GETTERS.SPOTIFY.PLAYER.IS_PLAYING](state) {
        return state.player.isPlaying;
      },
      [GETTERS.SPOTIFY.PLAYER.IS_PLAYING_TRACK](state) {
        return (track: SpotifyApi.TrackObjectSimplified) => {
          const player = state.player;

          return player.isPlaying && player.track && track && player.track.id == track.id;
        };
      }
    },
    mutations: {
      [MUTATIONS.SPOTIFY.SET_TOKEN](state, token: string) {
        state.token = token;

        client.setAccessToken(token);
      },
      [MUTATIONS.SPOTIFY.SET_LOGGED_IN](state, loggedIn: boolean) {
        state.loggedIn = loggedIn;
      },
      [MUTATIONS.SPOTIFY.SET_PLAYLISTS](state, playlists: SpotifyApi.PlaylistObjectSimplified[]) {
        state.playlists = playlists;
      },
      [MUTATIONS.SPOTIFY.SET_USER](state, user: SpotifyApi.CurrentUsersProfileResponse) {
        state.user = user;
      },
      [MUTATIONS.SPOTIFY.PLAYER.SET_IS_PLAYING](state, isPlaying: boolean) {
        state.player.isPlaying = isPlaying;
      },
      [MUTATIONS.SPOTIFY.PLAYER.SET_TRACK](state, track: SpotifyApi.TrackObjectSimplified) {
        state.player.track = track;
      }
    },
    actions: {
      async [ACTIONS.SPOTIFY.LOGIN](store, token: string) {
        store.commit(MUTATIONS.SPOTIFY.SET_TOKEN, token);
        store.commit(MUTATIONS.SPOTIFY.SET_LOGGED_IN, true);

        const response = await client.getMe();
        const user = response.body;

        store.commit(MUTATIONS.SPOTIFY.SET_USER, user);
      },
      async [ACTIONS.SPOTIFY.GET_PLAYLISTS](store) {
        const user = store.state.user;
        if (!user) {
          // TODO: what do?
          console.error("Attempted to get playlists for user without being logged in");
          return;
        }

        const response = await client.getUserPlaylists(user.id);
        const playlists = response.body.items;

        store.commit(MUTATIONS.SPOTIFY.SET_PLAYLISTS, playlists);
      },
      async [ACTIONS.SPOTIFY.GET_PLAYLIST_TRACKS](
        store,
        playlist: SpotifyApi.PlaylistObjectSimplified
      ): Promise<SpotifyApi.PlaylistTrackObject[]> {
        const response = await client.getPlaylistTracks(playlist.id);
        const tracks = response.body;

        return tracks.items;
      },
      async [ACTIONS.SPOTIFY.TOGGLE_PLAY_PAUSE_FOR_TRACK](
        store,
        track: SpotifyApi.TrackObjectSimplified
      ) {
        const player = store.state.player;

        // If the currently selected track is the passed in track:
        if (player.track && player.track.id == track.id) {
          const response = player.isPlaying ? await client.pause() : await client.play();

          store.commit(MUTATIONS.SPOTIFY.PLAYER.SET_IS_PLAYING, !player.isPlaying);
          return;
        }

        // ...otherwise, start playing the passed track!
        const response = await client.play({ uris: [track.uri] });

        store.commit(MUTATIONS.SPOTIFY.PLAYER.SET_TRACK, track);
        store.commit(MUTATIONS.SPOTIFY.PLAYER.SET_IS_PLAYING, true);
      }
    }
  };
}

export default function makeUserModule(options: UserModuleOptions): Module<UserState, AppState> {
  return {
    namespaced: true,
    modules: {
      spotify: makeSpotifyModule(options.spotify)
    }
  };
}
