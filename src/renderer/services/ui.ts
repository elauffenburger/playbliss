import { Store } from "vuex";
import { AppState } from "../store";

export interface UiService {
  setSearch(search: string): void;
}

export class DefaultUiService implements UiService {
  constructor(private store: Store<AppState>) {}

  setSearch(search: string) {
    this.store.dispatch("ui/setSearch", search);
  }
}
