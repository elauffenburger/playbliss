<template>
  <div class='youtube-playlist-track'>
    <div>
      <span><span class='youtube-logo'>[YouTube]</span> {{track.name}}</span>
    </div>

    <v-btn @click="onClickPlayPause">{{isPlayingTrack ? "Pause": "Play" }}</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Store } from "vuex";
import { AppState } from "@/renderer/store";
import { Prop } from "vue-property-decorator";
import { YouTubeTrack, MusicSource } from "../../../renderer/models";

@Component({ name: "YouTubePlaylistTrack" })
export default class SpotifyPlaylistTrack extends Vue {
  @Prop()
  track?: YouTubeTrack;

  get store(): Store<AppState> {
    return this.$store;
  }

  get isPlayingTrack(): boolean {
    if (!this.track || this.track.source != MusicSource.YouTube) {
      // TODO: what do?
      return false;
    }

    return this.store.getters["player/isPlayingTrack"](
      this.track
    );
  }

  onClickPlayPause() {
    if (!this.track || this.track.source != MusicSource.YouTube) {
      // TODO: what do?
      return false;
    }

    this.store.dispatch(
      "player/togglePlayPauseForTrack",
      this.track
    );
  }
}
</script>

<style lang="less">
.youtube-playlist-track {
  .youtube-logo {
    background-color: #f00;
  }
}
</style>