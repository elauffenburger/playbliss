import { Module, Store } from "vuex";
import { AppState } from "..";
import { Playlist, Track, PlaylistTrack } from "../../models";

export const GETTERS = {
  PLAYLISTS: "playlists"
};

export const MUTATIONS = {
  CREATE_PLAYLIST: "createPlaylist",
  REMOVE_PLAYLIST: "removePlaylist",
  SET_TRACKS: "setTracks",
  ADD_TRACK_TO_PLAYLIST: "addTrackToPlaylist"
};

export const ACTIONS = {
  CREATE_PLAYLIST: "createPlaylist",
  REMOVE_PLAYLIST: "removePlaylist",
  SET_TRACKS: "setTracks",
  GET_PLAYLIST_BY_ID: "getPlaylistById",
  ADD_TRACK_TO_PLAYLIST: "addTrackToPlaylist"
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
      [MUTATIONS.ADD_TRACK_TO_PLAYLIST](
        state,
        args: { playlistId: string; track: Track }
      ) {
        const playlist = state.playlists.find(p => p.id == args.playlistId);
        if (!playlist) {
          // TODO: what do?
          return;
        }

        playlist.tracks.push({
          playlistId: playlist.id,
          position: playlist.tracks.length,
          track: args.track
        });
      },
      [MUTATIONS.REMOVE_PLAYLIST](state, id: string) {
        const playlistIndex = state.playlists.findIndex(p => p.id == id);

        state.playlists.splice(playlistIndex, 1);
      },
      [MUTATIONS.SET_TRACKS](
        state,
        args: { playlistId: string; tracks: Track[] }
      ) {
        const playlist = state.playlists.find(p => p.id == args.playlistId);
        if (!playlist) {
          // TODO: what do?
          return;
        }

        const tracks = args.tracks.map<PlaylistTrack>((track, i) => {
          return {
            track,
            playlistId: playlist.id,
            position: i
          };
        });

        playlist.tracks.splice(0, playlist.tracks.length, ...tracks);
      }
    },
    actions: {
      [ACTIONS.CREATE_PLAYLIST](store, playlist: Playlist) {
        store.commit(MUTATIONS.CREATE_PLAYLIST, playlist);
      },
      [ACTIONS.REMOVE_PLAYLIST](store, id: string) {
        store.commit(MUTATIONS.REMOVE_PLAYLIST, id);
      },
      [ACTIONS.ADD_TRACK_TO_PLAYLIST](
        store,
        args: { playlistId: string; track: Track }
      ) {
        store.commit(MUTATIONS.ADD_TRACK_TO_PLAYLIST, {
          playlistId: args.playlistId,
          track: args.track
        });
      },
      async [ACTIONS.GET_PLAYLIST_BY_ID](
        store,
        id: string
      ): Promise<Playlist | undefined> {
        return store.state.playlists.find(p => p.id == id);
      }
    }
  };
}
