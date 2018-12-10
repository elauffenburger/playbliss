import { youtube_v3 } from "googleapis";

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
}

export type Track = SpotifyTrack | YouTubeTrack;

export interface Playlist {
  name: string;
  tracks: Track[];
}

export interface StopPlayingActionPayload {
  ifNot: string;
}
