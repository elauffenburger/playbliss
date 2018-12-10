import { Track, YouTubeTrack, MusicSource, SpotifyTrack } from "../models";
import { youtube_v3 } from "googleapis";

export function mapSpotifyTrack(track: SpotifyApi.TrackObjectFull): SpotifyTrack {
  return {
    name: track.name,
    artist: track.artists[0].name,
    album: track.album.name,
    source: MusicSource.Spotify,
    sourceMedia: track
  };
}

export function mapYouTubeVideo(video: youtube_v3.Schema$Video): YouTubeTrack | null {
  const snippet = video.snippet;
  if (!snippet) {
    return null;
  }

  return {
    id: video.id as string,
    name: snippet.title as string,
    source: MusicSource.YouTube,
    sourceMedia: video
  };
}
