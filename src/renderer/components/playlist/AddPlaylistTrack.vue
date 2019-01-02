<template>
  <v-layout row>

    <v-flex xs3>
      <v-btn
        color="success"
        @click="onClickAdd()"
      >Add</v-btn>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from "vue";
import { Store } from "vuex";
import { Watch, Component, Prop } from "vue-property-decorator";

import { Track, Playlist } from "../../models";
import { AppState } from "../../store";

@Component({
  name: "AddPlaylistTrack",
  components: {}
})
export default class AddPlaylistTrack extends Vue {
  @Prop()
  playlist?: Playlist;

  track?: Track;

  get store(): Store<AppState> {
    return this.$store;
  }

  mounted() {
  }

  onTrackSelected(track: Track) {
    this.track = track;
  }

  onClickAdd() {
    if (!this.playlist || !this.track) {
      return;
    }

    this.$services.playlists.addTrackToPlaylist(this.playlist.id, this.track);
  }
}
</script>

<style>
</style>