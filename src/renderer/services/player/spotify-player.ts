import SpotifyWebApi, {
  CurrentPlayback,
  PlayOptions
} from "spotify-web-api-node";
import { PlayerService } from ".";
import { Track, MusicSource, PlaylistTrack } from "../../models";

export interface SpotifyPlayerService extends PlayerService {
  getCurrentTrack(): Promise<CurrentPlayback>;
  playSpotifyTrack(options: PlayOptions): Promise<any>;
}

export class DefaultSpotifyPlayerService implements SpotifyPlayerService {
  constructor(private client: SpotifyWebApi) {}

  source = MusicSource.Spotify;

  playTrack(track: PlaylistTrack): Promise<any> {
    this.log("playing track");

    if (track.track.source != MusicSource.Spotify) {
      throw new Error("track was not a SpotifyTrack");
    }

    return this.playSpotifyTrack({ uris: [track.track.sourceMedia.uri] });
  }

  resumeTrack(): Promise<any> {
    this.log("resuming track");

    return this.client.play();
  }

  pauseTrack(): Promise<any> {
    this.log("pausing track");

    return this.client.pause();
  }

  seek(positionMs: number): Promise<any> {
    this.log("seeking track");

    return this.client.seek(positionMs);
  }

  playSpotifyTrack(options: PlayOptions) {
    this.log("playing spotify track");

    return this.client.play(options);
  }

  async getCurrentTrack(): Promise<CurrentPlayback> {
    this.log("getting current track");

    const response = await this.client.getMyCurrentPlayingTrack();
    const trackContext = response.body;

    return trackContext;
  }

  log(...args: any[]) {
    console.log(args);
  }
}
