import { Module, Store } from "vuex";

import { AppState } from "../..";
import { Track, Playlist } from "../../../models";

export interface SpotifyModuleOptions {}

export const MUTATIONS = {
  SET_TOKEN: "setToken",
  SET_LOGGED_IN: "setLoggedIn",
  SET_PLAYLISTS: "setPlaylists",
  SET_USER: "setUser"
};

export const ACTIONS = {
  SET_USER: "setUser",
  SET_TOKEN: "setToken",
  SET_PLAYLISTS: "setPlaylists"
};

export interface UserSpotifyState {
  loggedIn: boolean;
  token: string;
  playlists: SpotifyApi.PlaylistObjectSimplified[];
  user: SpotifyApi.CurrentUsersProfileResponse | null;
}

export const spotifyModulePlugin = () => {
  let plugin: SpotifyModulePlugin | undefined;

  return (store: Store<AppState>) => {
    plugin = new SpotifyModulePlugin(store);
    plugin.bootstrap();
  };
};

export function makeSpotifyModule(): Module<UserSpotifyState, AppState> {
  return {
    namespaced: true,
    state: {
      loggedIn: false,
      token: "",
      playlists: [],
      user: null
    },
    mutations: {
      [MUTATIONS.SET_TOKEN](state, token: string) {
        state.token = token;
      },
      [MUTATIONS.SET_LOGGED_IN](state, loggedIn: boolean) {
        state.loggedIn = loggedIn;
      },
      [MUTATIONS.SET_PLAYLISTS](state, playlists: SpotifyApi.PlaylistObjectSimplified[]) {
        state.playlists = playlists;
      },
      [MUTATIONS.SET_USER](state, user: SpotifyApi.CurrentUsersProfileResponse) {
        state.user = user;
      }
    },
    actions: {
      [ACTIONS.SET_TOKEN](store, token: string) {
        store.commit(MUTATIONS.SET_TOKEN, token);
      },
      [ACTIONS.SET_USER](store, user: SpotifyApi.CurrentUsersProfileResponse) {
        store.commit(MUTATIONS.SET_USER, user);
        store.commit(MUTATIONS.SET_LOGGED_IN, true);
      },
      [ACTIONS.SET_PLAYLISTS](store, playlists: Playlist[]) {
        store.commit(MUTATIONS.SET_PLAYLISTS, playlists);
      }
    }
  };
}

class SpotifyModulePlugin {
  constructor(private store: Store<AppState>) {}

  bootstrap() {
    // Check for an existing access_token and dispatch the login action to simulate a re-login
    const existingToken = this.store.state.user.spotify.token;
    if (existingToken) {
      this.store.dispatch("user/spotify/setToken", existingToken);
    }
  }
}
