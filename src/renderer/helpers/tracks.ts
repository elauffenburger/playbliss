import { YouTubeTrack, MusicSource, SpotifyTrack } from "../models";
import { youtube_v3 } from "googleapis";
import { parse as iso8601Parse, toSeconds as iso8601ToSeconds } from 'iso8601-duration';

export function mapSpotifyTrack(track: SpotifyApi.TrackObjectFull): SpotifyTrack {
  return {
    id: track.id,
    name: track.name,
    artist: track.artists[0].name,
    album: track.album.name,
    source: MusicSource.Spotify,
    sourceMedia: track,
    durationMs: track.duration_ms
  };
}

export function mapYouTubeVideo(video: youtube_v3.Schema$Video): YouTubeTrack | null {
  const snippet = video.snippet;
  if (!snippet) {
    return null;
  }

  const iso8601Duration = video.contentDetails && video.contentDetails.duration;
  const durationMs = iso8601ToSeconds(iso8601Parse(iso8601Duration || '')) * 1000;

  return {
    id: video.id as string,
    name: snippet.title as string,
    source: MusicSource.YouTube,
    sourceMedia: video,
    durationMs: durationMs
  };
}
