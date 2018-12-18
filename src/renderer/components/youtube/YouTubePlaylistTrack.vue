<template>
  <div class='youtube-playlist-track'>
    <div v-if="track">
      <span><span class='youtube-logo'>[YouTube]</span> {{track.track.name}}</span>
    </div>

    <v-btn @click="onClickPlayPause">{{isPlayingTrack ? "Pause": "Play" }}</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Store } from "vuex";
import { AppState } from "../../store";
import { Prop } from "vue-property-decorator";
import { Playlist, PlaylistTrack, YouTubeTrack, MusicSource } from "../../../renderer/models";

@Component({ name: "YouTubePlaylistTrack" })
export default class SpotifyPlaylistTrack extends Vue {
  @Prop()
  playlist?: Playlist;

  @Prop()
  position?: number;

  @Prop()
  track?: PlaylistTrack;

  get store(): Store<AppState> {
    return this.$store;
  }

  get isPlayingTrack(): boolean {
    if (!this.track || this.track.track.source != MusicSource.YouTube) {
      // TODO: what do?
      return false;
    }

    return this.$services.player.isPlayingTrack(this.track);
  }

  onClickPlayPause() {
    if (!this.track || this.track.track.source != MusicSource.YouTube) {
      // TODO: what do?
      return false;
    }

    this.$services.player.toggleTrackPlay(this.track);
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