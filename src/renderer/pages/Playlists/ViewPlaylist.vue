<template>
  <v-container v-if="playlist">
    <v-layout>
      <v-flex xs12>
        <div class="playlist-title-container">
          <h3 class="title">{{playlist.name}}</h3>
          <v-btn
            color="error"
            @click="removePlaylist(playlist)"
          >Remove Playlist</v-btn>
        </div>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex xs4>
        <v-btn
          color="success"
          :block="true"
          @click="play()"
        >Play</v-btn>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex xs12>
        <PlaylistTracks :playlist="playlist" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Store } from "vuex";
import { Component, Prop } from "vue-property-decorator";

import PlaylistTracks from "./PlaylistTracks.vue";
import { Playlist } from "../../models";
import { AppState } from "../../store";

@Component({
  name: "ViewPlaylist",
  components: {
    PlaylistTracks
  }
})
export default class ViewPlaylist extends Vue {
  @Prop()
  playlistId?: string;

  playlist: Playlist | null = null;

  get store(): Store<AppState> {
    return this.$store;
  }

  async mounted() {
    if(!this.playlistId) {
      return;
    }

    this.playlist = (await this.$services.playlists.getPlaylistById(this.playlistId)) || null;
  }

  play() {
    if(!this.playlist) {
      return;
    }

    this.$services.player.playPlaylist(this.playlist);
  }
}
</script>

<style lang="less">
.playlist-title-container {
  .title {
    display: inline-block;
  }
}
</style>
