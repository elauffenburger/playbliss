<template>
  <div class='spotify-playlist-track'>
    <div>
      <span><span class='spotify-logo'>[Spotify]</span> {{track.name}} | {{track.artist}} | {{track.album}}</span>
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
import { SpotifyTrack, MusicSource } from "../../../renderer/models";

@Component({ name: "SpotifyPlaylistTrack" })
export default class SpotifyPlaylistTrack extends Vue {
  @Prop()
  track?: SpotifyTrack;

  get store(): Store<AppState> {
    return this.$store;
  }

  get isPlayingTrack(): boolean {
    if (!this.track || this.track.source != MusicSource.Spotify) {
      // TODO: what do?
      return false;
    }

    return this.store.getters["player/isPlayingTrack"](
      this.track
    );
  }

  onClickPlayPause() {
    if (!this.track || this.track.source != MusicSource.Spotify) {
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
.spotify-playlist-track {
  .spotify-logo {
    background-color: #1ed05d;
  }
}
</style>