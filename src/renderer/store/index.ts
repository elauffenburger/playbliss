import Vue from "vue";
import Vuex, { Store } from "vuex";

Vue.use(Vuex);

import { createPersistedState } from "vuex-electron";

import makeUserModule, { UserState, UserModuleOptions, hydrateSpotifyModule } from "./modules/user";
import { makePlaylistsModule } from './modules/playlists';

export interface AppState {
  user: UserState;
}

export interface StoreOptions {
  user: UserModuleOptions
}

export default function makeStore(options: StoreOptions): Store<AppState> {
  return new Vuex.Store<AppState>({
    modules: {
      user: makeUserModule(options.user),
      playlists: makePlaylistsModule()
    },
    plugins: [createPersistedState(), hydrateSpotifyModule()],
    strict: true
  });
}
