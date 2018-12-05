<template>
  <div>
    <div>
      <input
        type="text"
        v-model="playlistName"
      />
      <button @click="createPlaylist()">Create Playlist</button>
    </div>
    <div
      v-for="(track, i) in tracks"
      :key="i"
    >
      <pre>{{track}}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Store } from "vuex";
import { Playlist, Track } from "@/renderer/models";
import { AppState } from "@/renderer/store";

@Component({ name: "NewPlaylist" })
export default class NewPlaylist extends Vue {
  playlistName = "";

  @Prop()
  tracks?: Track[];

  get store(): Store<AppState> {
    return this.$store;
  }

  created() {}

  mounted() {
    console.log(this);
  }

  createPlaylist() {
    console.log("attempting to save playlist: %O", this.playlistName);

    const playlist: Playlist = {
      name: this.playlistName,
      tracks: this.tracks || []
    };

    this.store.dispatch("playlists/createPlaylist", playlist);
  }
}
</script>