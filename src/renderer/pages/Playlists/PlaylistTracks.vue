<template>
  <div>
    <div
      class="track"
      v-for="(track, i) of playlist.tracks"
      :key="i"
    >
      <SpotifyPlaylistTrack
        v-if="track.source == 'spotify'"
        :track="track"
      />
    </div>
  </div>

</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import SpotifyPlaylistTrack from "../../components/spotify/SpotifyPlaylistTrack.vue";
import { Prop } from "vue-property-decorator";
import { Playlist } from "@/renderer/models";

@Component({
  name: "PlaylistTracks",
  components: {
    SpotifyPlaylistTrack
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
