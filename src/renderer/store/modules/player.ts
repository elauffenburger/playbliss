import { Module } from "vuex";
import { AppState } from "..";
import { PlaylistTrack, MusicSource } from "../../models";

export const MUTATIONS = {
  SET_TRACK: "setTrack",
  SET_IS_PLAYING: "setIsPlaying",
  SET_PLAYLIST: "setPlaylist",
  SET_QUEUE_POSITION: "setQueuePosition",
  SET_PROGRESS: "setProgress",
  SET_PRIMARY_MUSIC_SOURCE: "setPrimaryMusicSource"
};

export const ACTIONS = {
  TOGGLE_PLAY_PAUSE_FOR_TRACK: "togglePlayPauseForTrack",
  SET_TRACK: "setTrack",
  SET_IS_PLAYING: "setIsPlaying",
  PLAY_TRACK: "playTrack",
  RESUME_TRACK: "resumeTrack",
  PAUSE_TRACK: "pauseTrack",
  SET_PROGRESS: "setProgress",
  SET_PRIMARY_MUSIC_SOURCE: "setPrimaryMusicSource"
};

ACTIONS.foo

export const GETTERS = {
  IS_PLAYING_TRACK: "isPlayingTrack"
};

export interface PlayerState {
  isPlaying: boolean;
  primaryMusicSource: MusicSource | null;
  progress: {
    progressMs: number | null;
  };
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
      primaryMusicSource: null,
      track: null,
      progress: {
        progressMs: null
      }
    },
    mutations: {
      [MUTATIONS.SET_TRACK](state, track: PlaylistTrack) {
        state.track = track;
      },
      [MUTATIONS.SET_IS_PLAYING](state, isPlaying: boolean) {
        state.isPlaying = isPlaying;
      },
      [MUTATIONS.SET_PROGRESS](state, progressMs: number) {
        state.progress.progressMs = progressMs;
      },
      [MUTATIONS.SET_PRIMARY_MUSIC_SOURCE](state, source: MusicSource) {
        state.primaryMusicSource = source;
      }
    },
    actions: {
      [ACTIONS.SET_TRACK](store, track: PlaylistTrack) {
        store.commit(MUTATIONS.SET_TRACK, track);
      },
      [ACTIONS.SET_IS_PLAYING](store, isPlaying: boolean) {
        store.commit(MUTATIONS.SET_IS_PLAYING, isPlaying);
      },
      [ACTIONS.PLAY_TRACK](store, args: PlayTrackArgs) {
        store.dispatch(ACTIONS.SET_TRACK, args.track);

        store.commit(MUTATIONS.SET_IS_PLAYING, true);
      },
      [ACTIONS.RESUME_TRACK](store) {
        store.commit(MUTATIONS.SET_IS_PLAYING, true);
      },
      [ACTIONS.PAUSE_TRACK](store) {
        store.commit(MUTATIONS.SET_IS_PLAYING, false);
      },
      [ACTIONS.SET_PROGRESS](store, progressMs: number) {
        store.commit(MUTATIONS.SET_PROGRESS, progressMs);
      },
      [ACTIONS.SET_PRIMARY_MUSIC_SOURCE](store, source: MusicSource) {
        store.commit(MUTATIONS.SET_PRIMARY_MUSIC_SOURCE, source);
      }
    }
  };
}
