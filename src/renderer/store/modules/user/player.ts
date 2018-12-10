import { Module } from "vuex";
import { AppState } from "../..";
import { Track } from "@/renderer/models";

export const MUTATIONS = {
  SET_TRACK: "setTrack",
  SET_IS_PLAYING: "setIsPlaying"
};

export const ACTIONS = {
  STOP_PLAYING: "stopPlaying",
  PLAY_TRACK: "playTrack",
  PAUSE_TRACK: "pauseTrack",
  TOGGLE_PLAY_PAUSE_FOR_TRACK: "togglePlayPauseForTrack"
};

export interface PlayerState {
  isPlaying: boolean;
  track: Track | null;
}

export function makePlayerModule(): Module<PlayerState, AppState> {
  return {
    namespaced: true,
    state: {
      isPlaying: false,
      track: null,
    },
    mutations: {
      [MUTATIONS.SET_TRACK](state, track: Track) {
        state.track = track;
      },
      [MUTATIONS.SET_IS_PLAYING](state, isPlaying: boolean) {
        state.isPlaying = isPlaying;
      }
    },
    actions: {
      // Marker action that other modules subscribe to
      [ACTIONS.STOP_PLAYING](store) {},
      [ACTIONS.PLAY_TRACK](store, track: Track) {
        store.commit(MUTATIONS.SET_TRACK, track);
      },
      async [ACTIONS.TOGGLE_PLAY_PAUSE_FOR_TRACK](store, track: Track) {
        const state = store.state;

        // If the currently selected track is the passed in track:
        if (state.track && state.track.id == track.id) {
          const action = state.isPlaying ? ACTIONS.PAUSE_TRACK : ACTIONS.PLAY_TRACK;

          await store.dispatch(action);
          return;
        }

        // ...otherwise, start playing the passed track!
        await store.dispatch(ACTIONS.PLAY_TRACK, track);
      },
      async [ACTIONS.PAUSE_TRACK](store) {
        store.commit(MUTATIONS.SET_IS_PLAYING, false);
      }
    }
  };
}
