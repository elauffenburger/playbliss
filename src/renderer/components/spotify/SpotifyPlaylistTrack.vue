<template>
  <div class='spotify-playlist-track'>
    <div v-if="track">
      <span><span class='spotify-logo'>[Spotify]</span> {{track.track.name}} | {{track.track.artist}} | {{track.track.album}}</span>
    </div>

    <v-btn @click="onClickPlayPause()">{{isPlayingTrack ? "Pause": "Play" }}</v-btn>
    <v-btn @click="onClickSkipToEnd()">[Debug] Skip to end</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Store } from "vuex";
import { AppState } from "../../store";
import { Prop } from "vue-property-decorator";
import { Playlist, PlaylistTrack, SpotifyTrack, MusicSource } from "../../../renderer/models";
import { setTimeout } from "timers";

@Component({ name: "SpotifyPlaylistTrack" })
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

  get isPlayingTrack() {
    if (!this.track || this.track.track.source != MusicSource.Spotify) {
      // TODO: what do?
      return false;
    }

    return this.$services.player.isPlayingTrack(this.track);
  }

  onClickPlayPause() {
    if (!this.track || this.track.track.source != MusicSource.Spotify) {
      // TODO: what do?
      return false;
    }

    this.$services.player.toggleTrackPlay(this.track);
  }

  async onClickSkipToEnd() {
    if (!this.track || this.track.track.source != MusicSource.Spotify) {
      return;
    }

    await this.$services.player.playTrack(this.track);
    setTimeout(async () => {
      if (!this.track) {
        return;
      }

      await this.$services.spotifyPlayer.seek(
        (this.track.track as SpotifyTrack).sourceMedia.duration_ms - 1000
      );
    }, 1000);
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