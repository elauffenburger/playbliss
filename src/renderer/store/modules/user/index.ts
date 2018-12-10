import { Module } from "vuex";
import { AppState } from "../..";
import { UserSpotifyState, makeSpotifyModule, SpotifyModuleOptions } from './spotify';
import { makePlayerModule } from './player';
import { makeYouTubeModule, YouTubeModuleOptions } from './youtube';

export { spotifyModulePlugin } from './spotify';

export interface UserModuleOptions {
  spotify: SpotifyModuleOptions;
  youtube: YouTubeModuleOptions;
}

export interface UserState {
  spotify: UserSpotifyState;
}

export default function makeUserModule(options: UserModuleOptions): Module<UserState, AppState> {
  return {
    namespaced: true,
    modules: {
      spotify: makeSpotifyModule(options.spotify),
      youtube: makeYouTubeModule(options.youtube),
      player: makePlayerModule()
    }
  };
}
