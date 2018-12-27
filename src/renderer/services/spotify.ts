import SpotifyWebApi from "spotify-web-api-node";
import { Store } from "vuex";
import { AppState } from "../store";
import { OAuthService } from "./oauth";
import { toHashParams } from "../helpers/util";
import { remote } from "electron";

export interface SpotifyService {
  getCachedPlaylists(): SpotifyApi.PlaylistObjectSimplified[];
  clearCachedPlaylists(): void;

  getOAuthAuthorizationUri(): Promise<string>;
  getOAuthRedirectUri(): Promise<string>;

  login(): Promise<string>;
  setAccessToken(token: string): Promise<any>;
  setLoggedIn(loggedIn: boolean): Promise<void>;
  syncPlaylists(): Promise<SpotifyApi.PlaylistObjectSimplified[]>;
  getPlaylists(): Promise<SpotifyApi.PlaylistObjectSimplified[]>;
  getUser(): Promise<SpotifyApi.CurrentUsersProfileResponse>;

  getPlaylistTracks(playlist: SpotifyApi.PlaylistObjectSimplified): Promise<SpotifyApi.PlaylistTrackObject[]>;
  searchTrack(search: string): Promise<SpotifyApi.TrackObjectFull[]>;
}

export interface DefaultSpotifyServiceOptions {
  client: SpotifyWebApi;
  oauth: {
    service: OAuthService;
    baseUri: string;
    clientId: string;
    redirectUri: string;
    scopes: string[];
  };
}

export class DefaultSpotifyService implements SpotifyService {
  private client: SpotifyWebApi;

  constructor(private store: Store<AppState>, private options: DefaultSpotifyServiceOptions) {
    this.client = options.client;

    this.listenToStore();
    this.init();
  }

  private listenToStore() {
    this.store.subscribe(mutation => {
      switch (mutation.type) {
        case "user/spotify/setToken":
          const token = mutation.payload;

          this.client.setAccessToken(token);
          break;
      }
    });
  }

  init() {
    const token = this.store.state.user.spotify.token;
    if (token) {
      this.client.setAccessToken(token);
    }
  }

  getCachedPlaylists(): SpotifyApi.PlaylistObjectSimplified[] {
    return this.store.state.user.spotify.playlists;
  }

  clearCachedPlaylists() {
    this.setPlaylists([]);
  }

  async getPlaylists(): Promise<SpotifyApi.PlaylistObjectSimplified[]> {
    const state = this.store.state.user.spotify;

    const user = state.user;
    if (!user) {
      // TODO: what do?
      throw new Error("Attempted to get playlists for user without being logged in");
    }

    const response = await this.client.getUserPlaylists(user.id);
    const playlists = response.body.items;

    return playlists;
  }

  async getOAuthAuthorizationUri(): Promise<string> {
    const oauth = this.options.oauth;

    return oauth.service.getAuthorizationUri(oauth.baseUri, oauth.clientId, oauth.scopes, oauth.redirectUri);
  }

  async getOAuthRedirectUri(): Promise<string> {
    return this.options.oauth.redirectUri;
  }

  async login() {
    return new Promise<string>(async (res, rej) => {
      const authWindow = new remote.BrowserWindow({
        width: 600,
        height: 400
      });

      authWindow.loadURL(await this.getOAuthAuthorizationUri());

      authWindow.webContents.on("did-navigate", async () => {
        const uri = authWindow.webContents.getURL();

        if (!uri.startsWith(await this.getOAuthRedirectUri())) {
          console.log("login incomplete");
          return rej();
        }

        const url = new URL(uri);
        console.log("spotify oauth redirected uri:", url);

        const token = toHashParams(url.hash)["access_token"];
        if (!token) {
          // TODO: what do?
          console.log("failed to find token in url");
          return rej();
        }

        authWindow.close();

        await this.setAccessToken(token);

        res(token);
      });
    });
  }

  async setAccessToken(token: string): Promise<any> {
    this.store.dispatch("user/spotify/setToken", token);

    const response = await this.client.getMe();
    const user = response.body;

    this.store.dispatch("user/spotify/setUser", user);
  }

  async setLoggedIn(loggedIn: boolean) {
    this.store.dispatch("user/spotify/setLoggedIn", loggedIn);
  }

  async getUser() {
    const response = await this.client.getMe();

    return response.body;
  }

  async syncPlaylists(): Promise<SpotifyApi.PlaylistObjectSimplified[]> {
    const playlists = await this.getPlaylists();

    return await this.setPlaylists(playlists);
  }

  setPlaylists(playlists: SpotifyApi.PlaylistObjectSimplified[]): Promise<any> {
    return this.store.dispatch("user/spotify/setPlaylists", playlists);
  }

  async getPlaylistTracks(playlist: SpotifyApi.PlaylistObjectSimplified): Promise<SpotifyApi.PlaylistTrackObject[]> {
    const response = await this.client.getPlaylistTracks(playlist.id);
    const tracks = response.body;

    return tracks.items;
  }

  async searchTrack(search: string): Promise<SpotifyApi.TrackObjectFull[]> {
    const response = await this.client.searchTracks(search);

    return response.body.tracks.items;
  }
}
