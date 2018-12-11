import { Module, Store, MutationPayload } from "vuex";
import SpotifyWebApi from "spotify-web-api-node";

import { AppState } from "../..";
import { OAuthService } from "../../../services/oauth";
import { StopPlayingActionPayload, Track, MusicSource, SpotifyTrack } from "../../../models";
import { AbstractPlayerModulePlugin } from "../player";
import { mapSpotifyTrack } from "../../../helpers/tracks";

const PLAYER_NAME = "spotify";
const STATE_POLL_INTERVAL_MS = 2000;

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
  SET_USER: "setUser"
};

export const ACTIONS = {
  LOGIN: "login",
  GET_PLAYLISTS: "getPlaylists",
  GET_PLAYLIST_TRACKS: "getPlaylistTracks",
  GET_CURRENT_TRACK: "getCurrentTrack",
  SEARCH_TRACK: "searchTrack",
  PLAYER: {
    PLAY: "player/play",
    RESUME: "player/resume",
    PAUSE: "player/pause"
  }
};

export interface UserSpotifyState {
  loggedIn: boolean;
  token: string;
  playlists: SpotifyApi.PlaylistObjectSimplified[];
  user: SpotifyApi.CurrentUsersProfileResponse | null;
}

class SpotifyModulePlugin extends AbstractPlayerModulePlugin {
  constructor(store: Store<AppState>) {
    super(store);
  }

  init() {
    this.bootstrap();
    this.startPolling();

    super.init();
  }

  bootstrap() {
    // Check for an existing access_token and dispatch the login action to simulate a re-login
    const existingToken = this.store.state.user.spotify.token;
    if (existingToken) {
      this.store.dispatch("user/spotify/login", existingToken);
    }
  }

  startPolling() {
    setInterval(() => this.checkPlaybackState(), STATE_POLL_INTERVAL_MS);
  }

  async checkPlaybackState() {
    if (this.store.state.player.activeSource != MusicSource.Spotify) {
      return;
    }

    const trackContext = await this.store.dispatch("user/spotify/getCurrentTrack");

    this.store.commit("player/setIsPlaying", trackContext.is_playing);
    this.store.commit(
      "player/setTrack",
      mapSpotifyTrack(trackContext.item as SpotifyApi.TrackObjectFull)
    );
  }

  handleStopPlayingAction(action: MutationPayload) {
    const payload = action.payload as StopPlayingActionPayload;

    // If the message originated from us, ignore it
    if (payload.ifNot == PLAYER_NAME) {
      return;
    }

    this.store.dispatch("user/spotify/player/pause");
  }

  handlePlayTrackAction(action: MutationPayload) {
    const track = action.payload as Track;
    if (track.source != MusicSource.Spotify) {
      return;
    }

    this.store.dispatch("user/spotify/player/play", track);
  }

  handleResumeTrackAction(action: MutationPayload) {
    this.store.dispatch("user/spotify/player/resume");
  }

  handlePauseTrackAction(action: MutationPayload) {
    this.store.dispatch("user/spotify/player/pause");
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
      user: null
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
      async [ACTIONS.GET_CURRENT_TRACK](store) {
        const response = await client.getMyCurrentPlayingTrack();
        const trackContext = response.body;

        return trackContext;
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
      async [ACTIONS.PLAYER.PLAY](store, track: SpotifyTrack) {
        const options = { uris: [track.sourceMedia.uri] };

        await client.play(options);
      },
      async [ACTIONS.PLAYER.RESUME](store) {
        await client.play();
      },
      async [ACTIONS.PLAYER.PAUSE](store) {
        await client.pause();
      }
    }
  };
}
