<template>
  <v-container class="container">
    <v-layout class="youtube-container">
      <v-flex xs12>
        <YouTubePlayer />
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12>
        <div v-if="isPlayingTrack">
          <span>Now Playing: {{track.name}}</span>
        </div>
        <div v-else>
          <span>Paused</span>
        </div>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs3>
        <v-btn @click="onClickPrevious()">&lt;</v-btn>
      </v-flex>
      <v-flex xs3>
        <v-btn @click="onClickPlay()">Play</v-btn>
      </v-flex>
      <v-flex xs3>
        <v-btn @click="onClickNext()">&gt;</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { SubscribeActionStore } from "vuex";
import Component from "vue-class-component";

import { AppState } from "../../store";
import { PlayTrackArgs } from "../../store/modules/player";
import { Track, Playlist } from "../../models";

import YouTubePlayer from "../youtube/YouTubePlayer.vue";

@Component({
  name: "Player",
  components: {
    YouTubePlayer
  }
})
export default class Player extends Vue {
  currentPlaylist?: Playlist;
  queuePosition?: number;
  queue: Track[] = [];

  get track(): Track | null {
    return this.store.state.player.track;
  }

  get isPlayingTrack() {
    const track = this.track;

    return this.store.getters["player/isPlayingTrack"](track);
  }

  get store(): SubscribeActionStore<AppState> {
    return this.$store as any;
  }

  mounted() {
    this.store.dispatch("player/started");

    this.store.subscribeAction((action, state) => {
      switch (action.type) {
        case "player/playTrack":
          const payload = action.payload as PlayTrackArgs;

          const track = payload.track;
          const position = payload.position;
          const playlist = payload.playlist;

          this.updatePlayerInfo(track, position,  playlist);
          break;
        case "player/playPlaylist":
          this.playPlaylist(action.payload);
          break;
        case "player/trackEnded":
          this.onTrackEnded();
          break;
      }
    });
  }

  playPlaylist(playlist: Playlist) {
    this.currentPlaylist = playlist;
    this.queue = playlist.tracks;
    this.queuePosition = 0;

    this.playNextTrack();
  }

  onTrackEnded() {
    this.playNextTrack();
  }

  playPreviousTrack() {
    if(!this.queuePosition || !this.currentPlaylist) {
      return;
    }

    this.queuePosition--;

    this.playCurrentTrack();
  }

  playNextTrack() {
    if(!this.queuePosition || !this.currentPlaylist) {
      return;
    }

    this.queuePosition++;

    this.playCurrentTrack();
  }

  playCurrentTrack() {
    if(!this.queuePosition || !this.currentPlaylist) {
      return;
    }

    const track = this.queue[this.queuePosition];

    this.store.dispatch("player/playTrack", {
      track: track,
      position: this.queuePosition,
      playlist: this.currentPlaylist
    });
  }

  onClickPrevious() {
    this.playPreviousTrack();
  }

  onClickPlay() {
    this.playCurrentTrack();
  }

  onClickNext() {
    this.playNextTrack();
  }

  updatePlayerInfo(track: Track, position?: number, playlist?: Playlist) {
    this.queuePosition = position;
    this.currentPlaylist = playlist;
  }
}
</script>

<style lang="less">
.youtube-container {
  @height: 50px;
  max-height: @height;

  iframe {
    max-height: @height;
  }
}
</style>
