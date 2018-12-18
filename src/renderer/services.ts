import { DefaultUserService, UserService } from "./services/user";
import { Store } from "vuex";
import { AppState } from "./store";
import {
  DefaultSpotifyService,
  DefaultSpotifyServiceOptions,
  SpotifyService
} from "./services/spotify";
import { DefaultYouTubeService, YouTubeService } from "./services/youtube";
import { youtube_v3 } from "googleapis";
import { DefaultMasterPlayerService, MasterPlayerService } from "./services/player";
import {
  DefaultSpotifyPlayerService,
  SpotifyPlayerService
} from "./services/player/spotify-player";
import {
  DefaultYouTubePlayerService,
  YouTubePlayerService
} from "./services/player/youtube-player";
import Vue from "vue";
import { PlaylistService, DefaultPlaylistService } from "./services/playlist";

Vue.use({
  install: vue => {
    vue.mixin({
      beforeCreate: function() {
        if (!this.$options) {
          return;
        }

        this.$services = (this.$options.services ||
          (this.$options.parent && this.$options.parent.$services)) as any;
      }
    });
  }
});

export interface InjectionOptions {
  store: Store<AppState>;
  spotify: DefaultSpotifyServiceOptions;
  youtube: {
    client: youtube_v3.Youtube;
  };
}

export interface Services {
  user: UserService;
  spotify: SpotifyService;
  youtube: YouTubeService;
  player: MasterPlayerService;
  spotifyPlayer: SpotifyPlayerService;
  youtubePlayer: YouTubePlayerService;
  playlists: PlaylistService;
}

export default function makeServices(options: InjectionOptions): Services {
  const store = options.store;

  const spotifyPlayer = new DefaultSpotifyPlayerService(options.spotify.client);
  const youtubePlayer = new DefaultYouTubePlayerService();

  return {
    user: new DefaultUserService(store),
    spotify: new DefaultSpotifyService(store, options.spotify),
    youtube: new DefaultYouTubeService(options.youtube.client),
    player: new DefaultMasterPlayerService(store, [spotifyPlayer, youtubePlayer]),
    spotifyPlayer,
    youtubePlayer,
    playlists: new DefaultPlaylistService(store)
  };
}
