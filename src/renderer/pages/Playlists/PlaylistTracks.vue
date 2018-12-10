<template>
  <v-container>
    <AddPlaylistTrack :playlist="playlist" />

    <div
      class="track"
      v-for="(track, i) of playlist.tracks"
      :key="i"
    >
      <SpotifyPlaylistTrack
        v-if="track.source == 'spotify'"
        :track="track"
      />

      <YouTubePlaylistTrack
        v-if="track.source == 'youtube'"
        :track="track"
      />
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Playlist } from "@/renderer/models";

import SpotifyPlaylistTrack from "../../components/spotify/SpotifyPlaylistTrack.vue";
import YouTubePlaylistTrack from "../../components/youtube/YouTubePlaylistTrack.vue";
import AddPlaylistTrack from "../../components/playlist/AddPlaylistTrack.vue";

@Component({
  name: "PlaylistTracks",
  components: {
    SpotifyPlaylistTrack,
    YouTubePlaylistTrack,
    AddPlaylistTrack
  }
})
export default class PlaylistTracks extends Vue {
  @Prop()
  playlist?: Playlist;
}
</script>

<style lang="less">
.track {
  &:not(:last-child) {
    margin-bottom: 20px;
  }
}
</style>
