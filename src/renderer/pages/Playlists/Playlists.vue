<template>
  <v-container>
    <v-layout>
      <v-flex xs12>
        <v-btn
          color="success"
          @click="goToNewPlaylist()"
        >+ New Playlist</v-btn>
      </v-flex>
    </v-layout>

    <div
      class='playlist-container'
      v-for="(playlist, i) in playlists"
      :key="i"
    >
      <div class="playlist-title-container">
        <h3 class="title">{{playlist.name}}</h3>
        <v-btn
          color="error"
          @click="removePlaylist(playlist)"
        >Remove Playlist</v-btn>
      </div>

      <div>
        <v-btn @click="goToPlaylist(playlist)">Go To Playlist</v-btn>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Store } from "vuex";
import { AppState } from "../../store";
import { Playlist } from "../../models";
import { ROUTES } from "../../router";

@Component({
  name: "Playlists"
})
export default class Playlists extends Vue {
  get store(): Store<AppState> {
    return this.$store;
  }

  get playlists(): Playlist[] {
    return this.$services.playlists.getPlaylists();
  }

  removePlaylist(playlist: Playlist) {
    this.$services.playlists.removePlaylist(playlist.id);
  }

  goToPlaylist(playlist: Playlist) {
    this.$router.push({
      path: ROUTES.PLAYLIST,
      query: {
        json: JSON.stringify({
          playlistId: playlist.id
        })
      }
    });
  }

  goToNewPlaylist() {
    this.$router.push(ROUTES.NEW_PLAYLIST);
  }
}
</script>

<style lang="less">
.playlist-container {
  border: 1px solid black;

  &::not(:last-child) {
    margin-bottom: 10px;
  }
}
</style>