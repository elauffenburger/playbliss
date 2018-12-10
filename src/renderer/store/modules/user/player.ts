import { Module } from "vuex";
import { AppState } from "../..";

export const ACTIONS = {
  STOP_PLAYING: "stopPlaying"
};

export interface PlayerState {}

export function makePlayerModule(): Module<PlayerState, AppState> {
  return {
    namespaced: true,
    state: {},
    actions: {
      // Marker action that other modules subscribe to
      [ACTIONS.STOP_PLAYING](store) {}
    }
  };
}
