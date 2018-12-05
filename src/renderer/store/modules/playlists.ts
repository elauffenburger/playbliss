import { Module } from "vuex";
import { AppState } from "..";
import { Playlist } from "@/renderer/models";

export const GETTERS = {
  PLAYLISTS: "playlists"
};

export const MUTATIONS = {
  CREATE_PLAYLIST: "createPlaylist",
  REMOVE_PLAYLIST: 'removePlaylist'
};

export const ACTIONS = {
  CREATE_PLAYLIST: "createPlaylist",
  REMOVE_PLAYLIST: 'removePlaylist'
};

export interface PlaylistsModuleState {
  playlists: Playlist[];
}

export function makePlaylistsModule(): Module<PlaylistsModuleState, AppState> {
  return {
    namespaced: true,
    state: {
      playlists: []
    },
    getters: {
      [GETTERS.PLAYLISTS](state) {
        return state.playlists;
      }
    },
    mutations: {
        [MUTATIONS.CREATE_PLAYLIST](state, playlist: Playlist) {
            state.playlists.push(playlist);
        },
        [MUTATIONS.REMOVE_PLAYLIST](state, playlist: Playlist) {
          const playlistIndex = state.playlists.findIndex(p => p.name == playlist.name);

          state.playlists.splice(playlistIndex, 1);
        }
    },
    actions: {
      [ACTIONS.CREATE_PLAYLIST](store, playlist: Playlist) {
        store.commit(MUTATIONS.CREATE_PLAYLIST, playlist);
      },
      [ACTIONS.REMOVE_PLAYLIST](store, playlist: Playlist) {
        store.commit(MUTATIONS.REMOVE_PLAYLIST, playlist);
      }
    }
  };
}
