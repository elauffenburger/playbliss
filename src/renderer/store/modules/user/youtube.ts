import { Module } from "vuex";
import { AppState } from "../..";
import { YouTubeTrack } from "../../../models";

export interface UserYouTubeState {
  isPlaying: boolean;
  track: YouTubeTrack | null;
}

export interface YouTubeModuleOptions {}

const GETTERS = {
  PLAYER: {
    IS_PLAYING_TRACK: "player/isPlayingTrack"
  }
};

export function makeYouTubeModule(): Module<UserYouTubeState, AppState> {
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
    }
  };
}
