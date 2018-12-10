import { youtube_v3 } from "googleapis";

export enum MusicSource {
  Spotify = "spotify",
  YouTube = "youtube"
}

export interface SpotifyTrack extends BasicTrack<SpotifyApi.TrackObjectFull> {
  source: MusicSource.Spotify;
  artist: string;
  album: string;
}

export interface YouTubeTrack extends BasicTrack<youtube_v3.Schema$Video> {
  source: MusicSource.YouTube;
  id: string;
}

export interface BasicTrack<TSourceMedia> {
  name: string;
  sourceMedia: TSourceMedia;
}

export type Track = SpotifyTrack | YouTubeTrack;

export interface Playlist {
  name: string;
  tracks: Track[];
}

export interface StopPlayingActionPayload {
  ifNot: string;
}
