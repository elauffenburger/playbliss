<template>
  <div ref="playerRoot"></div>
</template>

<script lang="ts">
import Vue from "vue";
import { SubscribeActionStore } from "vuex";
import { AppState } from "../../store";
import { YouTubeTrack } from "../../models";
import Component from "vue-class-component";
import YouTube, { PlayerEvent } from "youtube-player";

@Component({ name: "YouTubePlayer" })
export default class YouTubePlayer extends Vue {
  player?: YouTube;

  get store(): SubscribeActionStore<AppState> {
    return this.$store as SubscribeActionStore<AppState>;
  }

  mounted() {
    const playerRoot = this.$refs["playerRoot"] as HTMLDivElement;
    const player = new YouTube(playerRoot, {});

    player.on<PlayerEvent>("stateChange", event => {
      switch (event.data) {
        case 0:
          this.onVideoEnd();
          break;
      }
    });

    this.player = player;

    this.store.subscribeAction(async (mutation, state) => {
      switch (mutation.type) {
        case "user/youtube/player/play":
          const track = mutation.payload as YouTubeTrack;

          await this.play(track);
          break;
        case "user/youtube/player/resume":
          await this.resume();
          break;
        case "user/youtube/player/pause":
          await this.pause();
          break;
      }
    });
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
      const track = this.store.state.player.track as YouTubeTrack;

      await this.player.loadVideoById(track.id);
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
</script>

<style>
</style>
