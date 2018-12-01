import Vue from "vue";
import Vuex from "vuex";

import { createPersistedState, createSharedMutations } from "vuex-electron";

import counter, { CounterState } from "./modules/counter";

Vue.use(Vuex);

export interface AppState {
  counter: CounterState;
}

export default new Vuex.Store<AppState>({
  modules: {
    counter: counter
  },
  plugins: [createPersistedState(), createSharedMutations()],
  strict: process.env.NODE_ENV !== "production"
});
