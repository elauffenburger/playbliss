import { Module, Store, SubscribeActionStore, MutationPayload } from "vuex";
import { AppState } from "../..";
import { youtube_v3 } from "googleapis";
import { YouTubeTrack, StopPlayingActionPayload, MusicSource, Track } from "../../../models";
import { AbstractPlayerModulePlugin } from "../player";

export interface UserYouTubeState {
  isPlaying: boolean;
  track: YouTubeTrack | null;
}

export interface YouTubeModuleOptions {
  client: youtube_v3.Youtube;
}

const PLAYER_NAME = "youtube";

const ACTIONS = {
  GET_VIDEO_BY_URL: "getVideoByUrl",
  PLAYER: {
    PLAY: "player/play",
    RESUME: "player/resume",
    PAUSE: "player/pause"
  }
};

const GETTERS = {
  PLAYER: {
    IS_PLAYING_TRACK: "player/isPlayingTrack"
  }
};

class YouTubeModulePlugin extends AbstractPlayerModulePlugin {
  constructor(store: Store<AppState>) {
    super(store);

    this.bootstrap();
  }

  init() {
    this.bootstrap();

    super.init();
  }

  bootstrap() {}

  handleStopPlayingAction(action: MutationPayload) {
    const payload = action.payload as StopPlayingActionPayload;

    // If the message originated from us, ignore it
    if (payload.ifNot == PLAYER_NAME) {
      return;
    }

    this.store.dispatch("user/youtube/player/pause");
  }

  handlePlayTrackAction(action: MutationPayload) {
    const track = action.payload as Track;
    if (track.source != MusicSource.YouTube) {
      return;
    }

    this.store.dispatch("user/youtube/player/play", track);
  }

  handleResumeTrackAction(action: MutationPayload) {
    this.store.dispatch("user/youtube/player/resume");
  }

  handlePauseTrackAction(action: MutationPayload) {
    this.store.dispatch("user/youtube/player/pause");
  }
}

export const youtubeModulePlugin = () => {
  let plugin: YouTubeModulePlugin | undefined;

  return (store: Store<AppState>) => {
    plugin = new YouTubeModulePlugin(store);
  };
};

export function makeYouTubeModule(
  options: YouTubeModuleOptions
): Module<UserYouTubeState, AppState> {
  const client = options.client;

  return {
    namespaced: true,
    state: {
      isPlaying: false,
      track: null
    },
    getters: {
      [GETTERS.PLAYER.IS_PLAYING_TRACK](state): (track: YouTubeTrack) => boolean {
        return (track: YouTubeTrack): boolean => {
          return (track && state.isPlaying && state.track && state.track.id == track.id) || false;
        };
      }
    },
    actions: {
      async [ACTIONS.GET_VIDEO_BY_URL](store, url: string): Promise<youtube_v3.Schema$Video> {
        const id = getIdFromUrl(url);
        if (!id) {
          // TODO: what do?
          throw `Failed to get id from url '${url}'`;
        }

        const response = await client.videos.list({
          id: id,
          part: "snippet"
        });

        const videos = response.data && response.data.items;
        if (!videos || !videos.length) {
          // TODO: what do?
          throw `No video found with id '${id}'`;
        }

        return videos[0];
      },
      async [ACTIONS.PLAYER.PLAY](store, track: YouTubeTrack) {},
      async [ACTIONS.PLAYER.RESUME](store) {},
      async [ACTIONS.PLAYER.PAUSE](store) {}
    }
  };
}

function getIdFromUrl(url: string): string | null {
  const uri = new URL(url);
  return uri && uri.searchParams.get("v");
}
