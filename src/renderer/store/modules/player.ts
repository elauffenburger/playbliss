import { Module, Store, SubscribeActionStore, MutationPayload } from "vuex";
import { AppState } from "..";
import { Track, MusicSource, Playlist } from "../../models";

export const MUTATIONS = {
  SET_TRACK: "setTrack",
  SET_IS_PLAYING: "setIsPlaying",
  SET_ACTIVE_SOURCE: "setActiveSource",
  SET_PLAYLIST: "setPlaylist",
  SET_QUEUE_POSITION: "setQueuePosition"
};

export const ACTIONS = {
  PLAY_PLAYLIST: "playPlaylist",
  STARTED: "started",
  STOP_PLAYING: "stopPlaying",
  TOGGLE_PLAY_PAUSE_FOR_TRACK: "togglePlayPauseForTrack",
  SET_TRACK: "setTrack",
  PLAY_TRACK: "playTrack",
  RESUME_TRACK: "resumeTrack",
  PAUSE_TRACK: "pauseTrack",
  TRACK_CHANGED_REMOTELY: "trackChangedRemotely",
  TRACK_ENDED: "trackEnded"
};

export const GETTERS = {
  IS_PLAYING_TRACK: "isPlayingTrack"
};

export interface PlayerState {
  isPlaying: boolean;
  activeSource: MusicSource | null;
  track: Track | null;
  playlist: Playlist | null;
  queuePosition: number | null;
}

export interface PlayTrackArgs {
  track: Track;
  position?: number;
  playlist?: Playlist;
}

export function makePlayerModule(): Module<PlayerState, AppState> {
  return {
    namespaced: true,
    state: {
      isPlaying: false,
      activeSource: null,
      track: null,
      playlist: null,
      queuePosition: null
    },
    getters: {
      [GETTERS.IS_PLAYING_TRACK](
        state
      ): (track: Track, playlist: Playlist, queuePosition: number) => boolean {
        return (track: Track, playlist: Playlist, queuePosition: number): boolean => {
          if (!state.isPlaying) {
            return false;
          }

          if (state.playlist && playlist) {
            const isPlayingPlaylist = state.playlist == playlist;
            const isPlayingTrackInQueuePosition = queuePosition == state.queuePosition;

            return isPlayingPlaylist && isPlayingTrackInQueuePosition;
          }

          const isPlayingTrack =
            (track && state.isPlaying && state.track && state.track.id == track.id) || false;

          return isPlayingTrack;
        };
      }
    },
    mutations: {
      [MUTATIONS.SET_TRACK](state, track: Track) {
        state.track = track;
      },
      [MUTATIONS.SET_IS_PLAYING](state, isPlaying: boolean) {
        state.isPlaying = isPlaying;
      },
      [MUTATIONS.SET_ACTIVE_SOURCE](state, source: MusicSource) {
        state.activeSource = source;
      },
      [MUTATIONS.SET_PLAYLIST](state, playlist: Playlist | null) {
        state.playlist = playlist;
      },
      [MUTATIONS.SET_QUEUE_POSITION](state, queuePosition: number | null) {
        state.queuePosition = queuePosition;
      }
    },
    actions: {
      // Marker actions that other modules subscribe to
      [ACTIONS.PLAY_PLAYLIST]() {},
      [ACTIONS.STARTED]() {},
      [ACTIONS.STOP_PLAYING]() {},
      [ACTIONS.TRACK_CHANGED_REMOTELY]() {},
      [ACTIONS.TRACK_ENDED]() {},

      [ACTIONS.SET_TRACK](store, track: Track) {
        store.commit(MUTATIONS.SET_TRACK, track);
        store.commit(MUTATIONS.SET_ACTIVE_SOURCE, track.source);
      },
      [ACTIONS.PLAY_TRACK](store, args: PlayTrackArgs) {
        store.dispatch(ACTIONS.SET_TRACK, args.track);
        store.commit(MUTATIONS.SET_PLAYLIST, args.playlist);
        store.commit(MUTATIONS.SET_QUEUE_POSITION, args.position);

        store.commit(MUTATIONS.SET_IS_PLAYING, true);
      },
      [ACTIONS.RESUME_TRACK](store) {
        const track = store.state.track;

        store.commit(MUTATIONS.SET_IS_PLAYING, true);
        store.commit(MUTATIONS.SET_ACTIVE_SOURCE, track && track.source);
      },
      [ACTIONS.PAUSE_TRACK](store) {
        store.commit(MUTATIONS.SET_IS_PLAYING, false);
      },
      async [ACTIONS.TOGGLE_PLAY_PAUSE_FOR_TRACK](store, args: PlayTrackArgs) {
        const state = store.state;

        const track = args.track;

        // If the currently selected track is the passed in track:
        if (store.getters[GETTERS.IS_PLAYING_TRACK](args.track, args.playlist, args.position)) {
          const action = state.isPlaying ? ACTIONS.PAUSE_TRACK : ACTIONS.RESUME_TRACK;

          await store.dispatch(action, args);
          return;
        }

        // ...otherwise, start playing the passed track!
        await store.dispatch(ACTIONS.PLAY_TRACK, args);
      }
    }
  };
}

export abstract class AbstractPlayerModulePlugin {
  constructor(protected store: Store<AppState>) {
    this.init();
  }

  protected init() {
    this.listen();
  }

  listen() {
    const store = this.store as SubscribeActionStore<AppState>;

    store.subscribeAction((action, state) => {
      switch (action.type) {
        case "player/started":
          this.handlePlayerStartedAction(action);
          break;
        case "player/stopPlaying":
          this.handleStopPlayingAction(action);
          break;
        case "player/playTrack":
          this.handlePlayTrackAction(action);
          break;
        case "player/resumeTrack":
          this.handleResumeTrackAction(action);
          break;
        case "player/pauseTrack":
          this.handlePauseTrackAction(action);
          break;
      }
    });
  }

  abstract handlePlayerStartedAction(action: MutationPayload): void;
  abstract handleStopPlayingAction(action: MutationPayload): void;
  abstract handlePlayTrackAction(action: MutationPayload): void;
  abstract handleResumeTrackAction(action: MutationPayload): void;
  abstract handlePauseTrackAction(action: MutationPayload): void;
}
