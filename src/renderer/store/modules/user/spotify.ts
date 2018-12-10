import { Module, ActionContext, Store, SubscribeActionStore } from "vuex";
import { AppState } from "../..";
import SpotifyWebApi, { PlayOptions } from "spotify-web-api-node";
import { OAuthService } from "@/renderer/services/oauth";
import { StopPlayingActionPayload, Track } from "@/renderer/models";

const PLAYER_NAME = "spotify";

export interface SpotifyModuleOptions {
  client: SpotifyWebApi;
  oauth: {
    service: OAuthService;
    baseUri: string;
    clientId: string;
    redirectUri: string;
    scopes: string[];
  };
}

export const GETTERS = {
  PLAYLISTS: "playlists",
  OAUTH: {
    AUTHORIZE_URI: "oauth/authorizeUri",
    REDIRECT_URI: "oauth/redirectUri"
  },
  PLAYER: {
    IS_PLAYING: "player/isPlaying",
    IS_PLAYING_TRACK: "player/isPlayingTrack"
  }
};

export const MUTATIONS = {
  SET_TOKEN: "setToken",
  SET_LOGGED_IN: "setLoggedIn",
  SET_PLAYLISTS: "setPlaylists",
  SET_USER: "setUser",
  PLAYER: {
    SET_IS_PLAYING: "player/setIsPlaying",
    SET_TRACK: "player/setTrack"
  }
};

export const ACTIONS = {
  LOGIN: "login",
  GET_PLAYLISTS: "getPlaylists",
  GET_PLAYLIST_TRACKS: "getPlaylistTracks",
  SEARCH_TRACK: "searchTrack",
  PLAYER: {
    TOGGLE_PLAY_PAUSE_FOR_TRACK: "player/togglePlayPauseForTrack",
    PLAY: "player/play",
    PAUSE: "player/pause"
  }
};

export interface UserSpotifyState {
  loggedIn: boolean;
  token: string;
  playlists: SpotifyApi.PlaylistObjectSimplified[];
  user: SpotifyApi.CurrentUsersProfileResponse | null;
  player: {
    isPlaying: boolean;
    track: SpotifyApi.TrackObjectSimplified | null;
  };
}

class SpotifyModulePlugin {
  constructor(private store: Store<AppState>) {
    this.init();
  }

  init() {
    this.bootstrap();
    this.listen();
  }

  bootstrap() {
    // Check for an existing access_token and dispatch the login action to simulate a re-login
    const existingToken = this.store.state.user.spotify.token;
    if (existingToken) {
      this.store.dispatch("user/spotify/login", existingToken);
    }
  }

  listen() {
    (this.store as SubscribeActionStore<AppState>).subscribeAction((action, state) => {
      if (action.type == `user/player/stopPlaying`) {
        const payload = action.payload as StopPlayingActionPayload;

        // If the message originated from us, ignore it
        if (payload.ifNot == PLAYER_NAME) {
          return;
        }

        this.store.dispatch(ACTIONS.PLAYER.PAUSE);
      }
    });
  }
}

export const spotifyModulePlugin = () => {
  let plugin: SpotifyModulePlugin | undefined;

  return (store: Store<AppState>) => {
    plugin = new SpotifyModulePlugin(store);
  };
};

export function makeSpotifyModule(
  options: SpotifyModuleOptions
): Module<UserSpotifyState, AppState> {
  const client = options.client;

  return {
    namespaced: true,
    state: {
      loggedIn: false,
      token: "",
      playlists: [],
      user: null,
      player: {
        isPlaying: false,
        track: null
      }
    },
    getters: {
      [GETTERS.PLAYLISTS](state) {
        return state.playlists;
      },
      [GETTERS.OAUTH.AUTHORIZE_URI](state) {
        const oauth = options.oauth;

        return oauth.service.getAuthorizationUri(
          oauth.baseUri,
          oauth.clientId,
          oauth.scopes,
          oauth.redirectUri
        );
      },
      [GETTERS.OAUTH.REDIRECT_URI](state) {
        return options.oauth.redirectUri;
      },
      [GETTERS.PLAYER.IS_PLAYING](state) {
        return state.player.isPlaying;
      },
      [GETTERS.PLAYER.IS_PLAYING_TRACK](state) {
        return (track: SpotifyApi.TrackObjectSimplified) => {
          const player = state.player;

          return player.isPlaying && player.track && track && player.track.id == track.id;
        };
      }
    },
    mutations: {
      [MUTATIONS.SET_TOKEN](state, token: string) {
        state.token = token;

        client.setAccessToken(token);
      },
      [MUTATIONS.SET_LOGGED_IN](state, loggedIn: boolean) {
        state.loggedIn = loggedIn;
      },
      [MUTATIONS.SET_PLAYLISTS](state, playlists: SpotifyApi.PlaylistObjectSimplified[]) {
        state.playlists = playlists;
      },
      [MUTATIONS.SET_USER](state, user: SpotifyApi.CurrentUsersProfileResponse) {
        state.user = user;
      },
      [MUTATIONS.PLAYER.SET_IS_PLAYING](state, isPlaying: boolean) {
        state.player.isPlaying = isPlaying;
      },
      [MUTATIONS.PLAYER.SET_TRACK](state, track: SpotifyApi.TrackObjectSimplified) {
        state.player.track = track;
      }
    },
    actions: {
      async [ACTIONS.LOGIN](store, token: string) {
        store.commit(MUTATIONS.SET_TOKEN, token);
        store.commit(MUTATIONS.SET_LOGGED_IN, true);

        const response = await client.getMe();
        const user = response.body;

        store.commit(MUTATIONS.SET_USER, user);
      },
      async [ACTIONS.GET_PLAYLISTS](store) {
        const user = store.state.user;
        if (!user) {
          // TODO: what do?
          console.error("Attempted to get playlists for user without being logged in");
          return;
        }

        const response = await client.getUserPlaylists(user.id);
        const playlists = response.body.items;

        store.commit(MUTATIONS.SET_PLAYLISTS, playlists);
      },
      async [ACTIONS.GET_PLAYLIST_TRACKS](
        store,
        playlist: SpotifyApi.PlaylistObjectSimplified
      ): Promise<SpotifyApi.PlaylistTrackObject[]> {
        const response = await client.getPlaylistTracks(playlist.id);
        const tracks = response.body;

        return tracks.items;
      },

      async [ACTIONS.SEARCH_TRACK](store, search: string): Promise<SpotifyApi.TrackObjectFull[]> {
        const response = await client.searchTracks(search);

        return response.body.tracks.items;
      },
      async [ACTIONS.PLAYER.TOGGLE_PLAY_PAUSE_FOR_TRACK](store, track: SpotifyApi.TrackObjectFull) {
        const player = store.state.player;

        // If the currently selected track is the passed in track:
        if (player.track && player.track.id == track.id) {
          const action = player.isPlaying ? ACTIONS.PLAYER.PAUSE : ACTIONS.PLAYER.PLAY;

          await store.dispatch(action);
          return;
        }

        // ...otherwise, start playing the passed track!
        await store.dispatch(ACTIONS.PLAYER.PLAY, track);
      },
      async [ACTIONS.PLAYER.PLAY](store, track?: SpotifyApi.TrackObjectFull) {
        const options = track ? { uris: [track.uri] } : undefined;

        await client.play(options);
        store.commit(MUTATIONS.PLAYER.SET_IS_PLAYING, true);

        if (track) {
          store.commit(MUTATIONS.PLAYER.SET_TRACK, track);
        }
      },
      async [ACTIONS.PLAYER.PAUSE](store) {
        await client.pause();
        store.commit(MUTATIONS.PLAYER.SET_IS_PLAYING, false);
      }
    }
  };
}
