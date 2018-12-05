<template>
  <div>
    <div
      class='playlist-container'
      v-for="(playlist, i) in playlists"
      :key="i"
    >
      <div class="playlist-title-container">
        <h3 class="title">{{playlist.name}}</h3>
        <button @click="removePlaylist(playlist)">Remove Playlist</button>
      </div>

      <PlaylistTracks :playlist="playlist" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Store } from "vuex";
import { AppState } from "@/renderer/store";
import { Playlist } from "../../models";

import PlaylistTracks from './PlaylistTracks.vue';

@Component({
  name: "Playlists",
  components: {
    PlaylistTracks
  }
})
export default class Playlists extends Vue {
  get store(): Store<AppState> {
    return this.$store;
  }

  get playlists(): Playlist[] {
    return this.store.getters["playlists/playlists"];
  }

  removePlaylist(playlist: Playlist) {
    this.store.dispatch("playlists/removePlaylist", playlist);
  }
}
</script>

<style lang="less">
.playlist-container {
  border: 1px solid black;

  &::not(:last-child) {
    margin-bottom: 10px;
  }

  .playlist-title-container {
    .title {
      display: inline-block;
    }
  }
}
</style>