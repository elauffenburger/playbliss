import { Playlist, Track, CreatePlaylistArgs, PlaylistTrack } from "../models";
import { Store } from "vuex";
import { AppState } from "../store";

import { v4 as uuid } from "uuid";

export interface PlaylistService {
  getPlaylists(includeAll?: boolean): Playlist[];
  createPlaylist(args: CreatePlaylistArgs): Promise<Playlist>;
  removePlaylist(id: string): Promise<any>;
  removeTrack(track: PlaylistTrack): Promise<void>;
  addTrackToPlaylist(playlistId: string, track: Track): Promise<any>;
  getPlaylistById(id: string): Playlist | null;
}

export class DefaultPlaylistService implements PlaylistService {
  constructor(private store: Store<AppState>) {}

  getPlaylists(includeAll?: boolean) {
    const playlists = this.store.state.playlists.playlists;

    if (includeAll) {
      return playlists;
    }

    return playlists.filter(p => !p.isVirtual);
  }

  async createPlaylist(args: CreatePlaylistArgs) {
    const id = uuid();

    const playlist: Playlist = {
      id,
      name: args.isVirtual ? "virtual" : args.name,
      isVirtual: args.isVirtual || false,
      tracks: args.tracks.map<PlaylistTrack>((t, i) => {
        return {
          track: t,
          position: i,
          playlistId: id
        };
      })
    };

    this.store.dispatch("playlists/createPlaylist", playlist);

    return playlist;
  }

  async removePlaylist(id: string) {
    return this.store.dispatch("playlists/removePlaylist", id);
  }

  async removeTrack(track: PlaylistTrack) {
    if (!track.playlistId) {
      return;
    }

    const playlist = await this.getPlaylistById(track.playlistId);
    if (!playlist) {
      return;
    }

    // Create a copy of the playlist tracks to modify
    const tracks = [...playlist.tracks];
    const trackIndex = tracks.findIndex(
      t => !!t.position && !!track.position && t.position == track.position
    );

    const newTracks = tracks.splice(trackIndex, 1);

    return this.store.dispatch("playlists/setTracks", {
      playlistId: playlist.id,
      tracks: newTracks
    });
  }

  async addTrackToPlaylist(playlistId: string, track: Track) {
    return this.store.dispatch("playlists/addTrackToPlaylist", {
      playlistId,
      track
    });
  }

  getPlaylistById(id: string) {
    return this.store.state.playlists.playlists.find(p => p.id == id) || null;
  }
}
