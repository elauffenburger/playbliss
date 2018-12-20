import { youtube_v3 } from "googleapis";

export * from './user';

export enum MusicSource {
  Spotify = "spotify",
  YouTube = "youtube"
}

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