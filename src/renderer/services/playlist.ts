import { Playlist, Track } from "../models";
import { Store } from "vuex";
import { AppState } from "../store";

export interface PlaylistService {
  getPlaylists(): Playlist[];
  createPlaylist(playlist: Playlist): Promise<void>;
  removePlaylist(id: string): Promise<any>;
  addTrackToPlaylist(playlistId: string, track: Track): Promise<any>;
  getPlaylistById(id: string): Playlist | undefined;
}

export class DefaultPlaylistService implements PlaylistService {
  constructor(private store: Store<AppState>) {}

  getPlaylists() {
    return this.store.state.playlists.playlists;
  }

  async createPlaylist(playlist: Playlist) {
    this.store.dispatch("playlists/createPlaylist", playlist);
  }

  async removePlaylist(id: string) {
    this.store.dispatch("playlists/removePlaylist", id);
  }

  async addTrackToPlaylist(playlistId: string, track: Track) {
    this.store.dispatch("playlists/addTrackToPlaylist", {
      playlistId,
      track
    });
  }

  getPlaylistById(id: string) {
    return this.store.state.playlists.playlists.find(p => p.id == id);
  }
}
