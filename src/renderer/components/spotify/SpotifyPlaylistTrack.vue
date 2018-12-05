<template>
  <div>
    <div>
      <span>{{name}} | {{artist}} | {{album}}</span>
    </div>

    <button @click="onClickPlayPause">{{isPlayingTrack ? "Pause": "Play" }}</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Store } from "vuex";
import { AppState } from "@/renderer/store";
import { Prop } from "vue-property-decorator";
import { SpotifyTrack, MusicSource } from "../../../renderer/models";

@Component({ name: "SpotifyPlaylistTrack" })
export default class SpotifyPlaylistTrack extends Vue {
  @Prop()
  track?: SpotifyTrack;

  get store(): Store<AppState> {
    return this.$store;
  }

  get name(): string {
    if (!this.track) {
      return "";
    }

    return this.track.name;
  }

  get artist(): string {
    if (!this.track) {
      return "";
    }

    return this.track.sourceTrack.artists[0].name;
  }

  get album(): string {
    if (!this.track) {
      return "";
    }

    return this.track.sourceTrack.album.name;
  }

  get isPlayingTrack(): boolean {
    if (!this.track || this.track.source != MusicSource.Spotify) {
      // TODO: what do?
      return false;
    }

    return this.store.getters["user/spotify/player/isPlayingTrack"](
      this.track.sourceTrack
    );
  }

  onClickPlayPause() {
    if (!this.track || this.track.source != MusicSource.Spotify) {
      // TODO: what do?
      return false;
    }

    this.store.dispatch(
      "user/spotify/player/togglePlayPauseForTrack",
      this.track.sourceTrack
    );
  }
}
</script>

<style lang="less">
</style>