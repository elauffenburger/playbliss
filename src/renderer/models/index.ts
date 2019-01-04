import { youtube_v3 } from "googleapis";

export * from "./user";

export enum MusicSource {
  Spotify = "spotify",
  YouTube = "youtube"
}

foo.bar

export interface SpotifyTrack extends BasicTrack<SpotifyApi.TrackObjectFull> {
  artist: string;
  album: string;
  source: MusicSource.Spotify;
}

export interface YouTubeTrack extends BasicTrack<youtube_v3.Schema$Video> {
  source: MusicSource.YouTube;
}

export interface BasicTrack<TSourceMedia> {
  name: string;
  id: string;
  sourceMedia: TSourceMedia;
  durationMs: number;
}

export type Track = SpotifyTrack | YouTubeTrack;

export interface Playlist {
  id: string;
  name: string;
  isVirtual: boolean;
  tracks: PlaylistTrack[];
}

export interface PlaylistTrack {
  track: Track;
  position?: number;
  playlistId?: string;
}

export interface StopPlayingActionPayload {
  ifNot: string;
}

export type CreatePlaylistArgs =
  | CreateRealPlaylistArgs
  | CreateVirtualPlaylistArgs;

export interface CreateRealPlaylistArgs {
  name: string;
  tracks: Track[];
  isVirtual?: false;
}

export interface CreateVirtualPlaylistArgs {
  tracks: Track[];
  isVirtual: true;
  createNew?: boolean;
}
