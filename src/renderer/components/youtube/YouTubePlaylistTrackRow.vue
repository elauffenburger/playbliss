<template>
  <PlaylistTrackRow
    class="youtube-playlist-track"
    :track="track"
    :removable="removable"
    stripeColor="#f00"
    @skipToEnd="onClickSkipToEnd($event)"
  />
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import PlaylistTrackRow from "../common/playlist/playlist-track-row/PlaylistTrackRow.vue";
import { Prop } from "vue-property-decorator";

@Component({
  name: "YouTubePlaylistTrack",
  components: {
    PlaylistTrackRow
  }
})
export default class SpotifyPlaylistTrack extends Vue {
  @Prop({ required: true })
  track!: PlaylistTrackRow;

  @Prop({ required: true, type: Boolean })
  removable!: boolean;
}
</script>

<style lang="less"></style>