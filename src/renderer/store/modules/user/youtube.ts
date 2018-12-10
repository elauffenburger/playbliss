import { Module } from "vuex";
import { AppState } from "../..";
import { youtube_v3 } from "googleapis";
import { YouTubeTrack } from "@/renderer/models";

export interface UserYouTubeState {
  isPlaying: boolean;
  track: YouTubeTrack | null;
}

export interface YouTubeModuleOptions {
  client: youtube_v3.Youtube;
}

const ACTIONS = {
  GET_VIDEO_BY_URL: "getVideoByUrl"
};

const GETTERS = {
  PLAYER: {
    IS_PLAYING_TRACK: "player/isPlayingTrack"
  }
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
      }
    }
  };
}

function getIdFromUrl(url: string): string | null {
  const uri = new URL(url);
  return uri && uri.searchParams.get("v");
}
