<template>
  <v-layout row>
    <SearchTrack ref="search" @trackSelected="onTrackSelected($event)" />

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

import SearchTrack from "../tracks/SearchTrack.vue";

import { Track, Playlist } from "../../models";
import { AppState } from "../../store";

@Component({
  name: "AddPlaylistTrack",
  components: {
    SearchTrack
  }
})
export default class AddPlaylistTrack extends Vue {
  @Prop()
  playlist?: Playlist;

  track?: Track;
  search?: SearchTrack;

  get store(): Store<AppState> {
    return this.$store;
  }

  mounted() {
    this.search = this.$refs["search"] as SearchTrack;
  }

  onTrackSelected(track: Track) {
    this.track = track;
  }

  onClickAdd() {
    this.store.dispatch("playlists/addTrackToPlaylist", {
      playlistName: this.playlist && this.playlist.name,
      track: this.track
    });

    if(this.search) {
      this.search.reset();
    }
  }
}
</script>

<style>
</style>