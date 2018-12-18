import Vue from "vue";
import Vuex, { Store } from "vuex";

Vue.use(Vuex);

import { createPersistedState } from "vuex-electron";

import makeUserModule, { UserState, UserModuleOptions, spotifyModulePlugin } from "./modules/user";
import { makePlaylistsModule, PlaylistsModuleState } from './modules/playlists';
import { PlayerState, makePlayerModule } from './modules/player';

export interface AppState {
  user: UserState;
  player: PlayerState;
  playlists: PlaylistsModuleState;
}

export interface StoreOptions {
  user: UserModuleOptions
}

export default function makeStore(options: StoreOptions): Store<AppState> {
  return new Vuex.Store<AppState>({
    modules: {
      user: makeUserModule(options.user),
      player: makePlayerModule(),
      playlists: makePlaylistsModule()
    },
    plugins: [createPersistedState(), spotifyModulePlugin()],
    strict: true
  });
}
