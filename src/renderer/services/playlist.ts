import { Playlist, Track, CreatePlaylistArgs, PlaylistTrack } from "../models";
import { Store } from "vuex";
import { AppState } from "../store";

import { v4 as uuid } from "uuid";

export interface PlaylistService {
  getPlaylists(includeAll?: boolean): Playlist[];
  getPlaylistById(id: string): Playlist | null;
  createPlaylist(args: CreatePlaylistArgs): Promise<Playlist>;
  setPlaylistTracks(playlistId: string, tracks: Track[]): Promise<void>;
  removePlaylist(id: string): Promise<any>;
  removeTrack(track: PlaylistTrack): Promise<void>;
  addTrackToPlaylist(playlistId: string, track: Track): Promise<any>;
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
    // If the caller wants a virtual playlist and is fine reusing
    // an existing one, find the first available and use that.
    // Otherwise, hook into the regular flow
    if (args.isVirtual && !args.createNew) {
      const playlist = this.getPlaylists().find(p => p.isVirtual);
      if (!playlist) {
        return await this.createNewPlaylist(args);
      }

      await this.setPlaylistTracks(playlist.id, args.tracks);

      return playlist;
    }

    return await this.createNewPlaylist(args);
  }

  async createNewPlaylist(args: CreatePlaylistArgs): Promise<Playlist> {
    const id = uuid();

    const playlist: Playlist = {
      id,
      name: args.isVirtual ? "virtual" : args.name,
      isVirtual: args.isVirtual || false,
      tracks: this.toPlaylistTracks(id, args.tracks)
    };

    await this.store.dispatch("playlists/createPlaylist", playlist);

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

    tracks.splice(trackIndex, 1);

    this.setPlaylistTracks(playlist.id, tracks.map(t => t.track));
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

  setPlaylistTracks(playlistId: string, tracks: Track[]) {
    return this.store.dispatch("playlists/setTracks", {
      playlistId: playlistId,
      tracks: tracks
    });
  }

  private toPlaylistTracks(
    playlistId: string,
    tracks: Track[]
  ): PlaylistTrack[] {
    return tracks.map<PlaylistTrack>((t, i) => {
      return {
        track: t,
        position: i,
        playlistId: playlistId
      };
    });
  }
}
