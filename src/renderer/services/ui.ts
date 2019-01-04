import { Store } from "vuex";
import { AppState } from "../store";

import VSnackbarConstructor from "vuetify/es5/components/VSnackbar";

import Vue from "vue";

export interface OpenSnackbarArgs {
  message: string;
  timeout: number;
  parent: HTMLElement;
}

export interface UiService {
  setSearch(search: string): void;
  openSnackbar(args: OpenSnackbarArgs): Vue;
}

export class DefaultUiService implements UiService {
  constructor(private store: Store<AppState>) {}

  setSearch(search: string) {
    this.store.dispatch("ui/setSearch", search);
  }

  openSnackbar(args: OpenSnackbarArgs) {
    const snackbar = new (Vue.extend(VSnackbarConstructor))({
      template: '',
      propsData: {
        value: false,
        bottom: true,
        right: true,
        timeout: args.timeout
      }
    });

    snackbar.$slots.default = [args.message as any];

    snackbar.$mount();
    args.parent.appendChild(snackbar.$el);

    snackbar.$props.value = true;

    return snackbar;
  }
}
