import { PlayerService } from ".";
import { YouTubeTrack, MusicSource, PlaylistTrack } from "../../models";
import { Subject } from "rxjs";

export interface YouTubePlayerService extends PlayerService {
  play$: Subject<YouTubeTrack>;
  resume$: Subject<void>;
  pause$: Subject<void>;
}

export class DefaultYouTubePlayerService implements YouTubePlayerService {
  play$: Subject<YouTubeTrack> = new Subject();
  resume$: Subject<void> = new Subject();
  pause$: Subject<void> = new Subject();

  constructor() {}

  source = MusicSource.YouTube;

  async playTrack(track: PlaylistTrack): Promise<any> {
    if (track.track.source != MusicSource.YouTube) {
      throw new Error("track was not a YouTubeTrack");
    }

    this.play$.next(track.track);
  }

  async resumeTrack(): Promise<any> {
    this.resume$.next();
  }

  async pauseTrack(): Promise<any> {
    this.pause$.next();
  }
}
