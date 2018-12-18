<template>
  <v-container>
    <v-layout row>
      <v-flex xs9>
        <v-text-field
          v-model="playlistName"
          label="Playlist Name"
        ></v-text-field>
      </v-flex>

      <v-flex xs3>
        <v-btn
          color="success"
          @click="createPlaylist()"
        >Create Playlist</v-btn>
      </v-flex>
    </v-layout>

    <div
      v-for="(track, i) in tracks"
      :key="i"
    >
      <pre>{{track}}</pre>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Store } from "vuex";
import { Playlist, Track } from "../../models";
import { AppState } from "../../store";
import { ROUTES } from "../../router";
import uuid from 'uuid/v4';

@Component({ name: "NewPlaylist" })
export default class NewPlaylist extends Vue {
  playlistName = "";

  @Prop()
  tracks?: Track[];

  get store(): Store<AppState> {
    return this.$store;
  }

  created() {
    
  }

  mounted() {}

  async createPlaylist() {
    const playlist: Playlist = {
      id: uuid(),
      name: this.playlistName,
      tracks: []
    };

    playlist.tracks = (this.tracks || [])
      .map((track, i) => {
        return {
          track: track,
          position: i,
          playlist: playlist
        };
      });

    await this.$services.playlists.createPlaylist(playlist);

    this.$router.replace(ROUTES.ALL_PLAYLISTS);
  }
}
</script>