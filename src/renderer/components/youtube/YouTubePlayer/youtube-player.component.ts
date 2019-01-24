import Vue from "vue";
import { SubscribeActionStore } from "vuex";
import { AppState } from "../../../store";
import { YouTubeTrack } from "../../../models";
import Component from "vue-class-component";
import YouTube from "youtube-player";
import { YouTubePlayerPoller } from "./helpers/youtube-poller";

@Component({
  name: "YouTubePlayer"
})
export default class YouTubePlayer extends Vue {
  player?: YouTube;
  poller?: YouTubePlayerPoller;

  get store(): SubscribeActionStore<AppState> {
    return this.$store as SubscribeActionStore<AppState>;
  }

  mounted() {
    const playerRoot = this.$refs["playerRoot"] as HTMLDivElement;
    const player = new YouTube(playerRoot, {});

    player.on<YT.OnStateChangeEvent>("stateChange", event => {
      switch (event.data) {
        case YT.PlayerState.ENDED:
          this.onVideoEnd();
          break;
      }
    });

    this.player = player;
    this.poller = new YouTubePlayerPoller(player, this.$services.player, {
      singleInstance: true,
      pollRateMs: 300
    });

    const youtubePlayer = this.$services.youtubePlayer;

    youtubePlayer.play$.subscribe(track => {
      this.play(track);
    });

    youtubePlayer.resume$.subscribe(() => this.resume());
    youtubePlayer.pause$.subscribe(() => this.pause());

    this.poller.poll();
  }

  async play(track: YouTubeTrack) {
    if (!this.player) {
      return;
    }

    await this.player.loadVideoById(track.id);
    await this.player.playVideo();
  }

  async resume() {
    if (!this.player) {
      return;
    }

    if ((await this.player.getDuration()) == 0) {
      const track = this.store.state.player.track;
      const youtubeTrack = (track && track.track) as YouTubeTrack;

      await this.player.loadVideoById(youtubeTrack.id);
    }

    await this.player.playVideo();
  }

  async pause() {
    if (!this.player) {
      return;
    }

    await this.player.pauseVideo();
  }

  onVideoEnd() {}
}
