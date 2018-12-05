export enum MusicSource {
  Spotify = "spotify",
  YouTube = "youtube"
}

export interface SpotifyTrack {
  name: string;
  source: MusicSource.Spotify;
  sourceTrack: SpotifyApi.TrackObjectFull;
}

export interface YoutubeTrack {
  name: string;
  source: MusicSource.YouTube;
}

export type Track = SpotifyTrack | YoutubeTrack;

export interface Playlist {
  name: string;
  tracks: Track[];
}
