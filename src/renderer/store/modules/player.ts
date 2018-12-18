import { Module, Store, SubscribeActionStore, MutationPayload } from "vuex";
import { AppState } from "..";
import { Track, MusicSource, Playlist, PlaylistTrack } from "../../models";

export const MUTATIONS = {
  SET_TRACK: "setTrack",
  SET_IS_PLAYING: "setIsPlaying",
  SET_ACTIVE_SOURCE: "setActiveSource",
  SET_PLAYLIST: "setPlaylist",
  SET_QUEUE_POSITION: "setQueuePosition"
};

export const ACTIONS = {
  TOGGLE_PLAY_PAUSE_FOR_TRACK: "togglePlayPauseForTrack",
  SET_TRACK: "setTrack",
  SET_IS_PLAYING: "setIsPlaying",
  PLAY_TRACK: "playTrack",
  RESUME_TRACK: "resumeTrack",
  PAUSE_TRACK: "pauseTrack",
};

export const GETTERS = {
  IS_PLAYING_TRACK: "isPlayingTrack"
};

export interface PlayerState {
  isPlaying: boolean;
  activeSource: MusicSource | null;
  track: PlaylistTrack | null;
}

export interface PlayTrackArgs {
  track: PlaylistTrack;
}

export function makePlayerModule(): Module<PlayerState, AppState> {
  return {
    namespaced: true,
    state: {
      isPlaying: false,
      activeSource: null,
      track: null,
    },
    mutations: {
      [MUTATIONS.SET_TRACK](state, track: PlaylistTrack) {
        state.track = track;
      },
      [MUTATIONS.SET_IS_PLAYING](state, isPlaying: boolean) {
        state.isPlaying = isPlaying;
      },
      [MUTATIONS.SET_ACTIVE_SOURCE](state, source: MusicSource) {
        state.activeSource = source;
      }
    },
    actions: {
      [ACTIONS.SET_TRACK](store, track: PlaylistTrack) {
        store.commit(MUTATIONS.SET_TRACK, track);
        store.commit(MUTATIONS.SET_ACTIVE_SOURCE, track.track.source);
      },
      [ACTIONS.SET_IS_PLAYING](store, isPlaying: boolean) {
        store.commit(MUTATIONS.SET_IS_PLAYING, isPlaying);
      },
      [ACTIONS.PLAY_TRACK](store, args: PlayTrackArgs) {
        store.dispatch(ACTIONS.SET_TRACK, args.track);

        store.commit(MUTATIONS.SET_IS_PLAYING, true);
      },
      [ACTIONS.RESUME_TRACK](store) {
        const track = store.state.track;

        store.commit(MUTATIONS.SET_IS_PLAYING, true);
        store.commit(MUTATIONS.SET_ACTIVE_SOURCE, track && track.track.source);
      },
      [ACTIONS.PAUSE_TRACK](store) {
        store.commit(MUTATIONS.SET_IS_PLAYING, false);
      }
    }
  };
}
