import { UserInfo } from "../models";
import { AppState } from "../store";
import { Store } from "vuex";

export interface UserService {
  getUserInfo(): UserInfo;
}

export class DefaultUserService implements UserService {
  constructor(private store: Store<AppState>) {}

  getUserInfo(): UserInfo {
    const user = this.store.state.user;
    const spotify = user.spotify;

    return {
      spotify: {
        loggedIn: spotify.loggedIn,
        token: spotify.token,
        user: spotify.user
      }
    };
  }
}
