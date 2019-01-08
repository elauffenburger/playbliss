import YouTube from "youtube-player";
import { MasterPlayerService } from "../../../../services/player";
import { MusicSource } from "../../../../models";

export class YouTubePlayerPoller {
  static poller: any;

  constructor(
    private youtube: YouTube,
    private player: MasterPlayerService,
    private options: {
      singleInstance: boolean;
      pollRateMs: number;
    }
  ) {}

  poll() {
    if (this.options.singleInstance && YouTubePlayerPoller.poller) {
      clearInterval(YouTubePlayerPoller.poller);
    }

    YouTubePlayerPoller.poller = setInterval(
      () => this.syncPlaybackStatus(),
      this.options.pollRateMs
    );
  }

  async syncPlaybackStatus() {
    const track = await this.player.getCurrentTrack();
    if (!track || track.track.source != MusicSource.YouTube) {
      this.player.pauseTrack();
      return;
    }

    const progressSec = await this.youtube.getCurrentTime();
    const progressMs = progressSec * 1000;

    this.player.setTrackProgress(progressMs);
  }
}
