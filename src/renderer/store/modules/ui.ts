import { Module } from "vuex";
import { AppState } from "..";

export const MUTATIONS = {
  SET_SEARCH: "setSearch"
};

export const ACTIONS = {
  SET_SEARCH: "setSearch"
};

export interface UiState {
  search: string;
}

export function makeUiModule(): Module<UiState, AppState> {
  return {
    namespaced: true,
    state: {
      search: ""
    },
    mutations: {
      [MUTATIONS.SET_SEARCH](state, search: string) {
        state.search = search;
      }
    },
    actions: {
      [ACTIONS.SET_SEARCH](store, search: string) {
        store.commit(MUTATIONS.SET_SEARCH, search);
      }
    }
  };
}
