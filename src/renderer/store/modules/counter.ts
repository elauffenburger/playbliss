import { Module } from "vuex";
import { AppState } from "@/renderer/store";

export interface CounterState {
  main: number;
}

const counterModule: Module<CounterState, AppState> = {
  state: {
    main: 0
  },
  mutations: {
    DECREMENT_MAIN_COUNTER(state) {
      state.main -= 1;
    },
    INCREMENT_MAIN_COUNTER(state) {
      state.main += 1;
    }
  },
  actions: {
    someAsyncTask({ commit }) {
      // do something async
      commit("INCREMENT_MAIN_COUNTER");
    }
  }
};

export default counterModule;
