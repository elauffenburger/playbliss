<template>
  <v-container class="playlist-tracks">
    <v-layout>
      <v-flex xs12>
        <AddPlaylistTrack :playlist="playlist" />
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex xs12>
        <v-data-table
          :headers="headers"
          :items="playlist.tracks"
          :hide-actions="true"
          class="elevation-1 playlist-tracks"
        >
          <template
            slot="items"
            slot-scope="props"
          >
            <SpotifyPlaylistTrackRow
              v-if="props.item.track.source == 'spotify'"
              :track="props.item"
              :playlist="playlist"
            />

            <YouTubePlaylistTrackRow
              v-if="props.item.track.source == 'youtube'"
              :track="props.item"
              :playlist="playlist"
            />
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Playlist } from "../../models";

import SpotifyPlaylistTrackRow from "../../components/spotify/SpotifyPlaylistTrackRow.vue";
import YouTubePlaylistTrackRow from "../../components/youtube/YouTubePlaylistTrackRow.vue";
import AddPlaylistTrack from "../../components/playlist/AddPlaylistTrack.vue";

@Component({
  name: "PlaylistTracks",
  components: {
    SpotifyPlaylistTrackRow,
    YouTubePlaylistTrackRow,
    AddPlaylistTrack
  }
})
export default class PlaylistTracks extends Vue {
  @Prop()
  playlist?: Playlist;

  headers: { text: string; sortable?: boolean; width?: string }[] = [
    {
      text: "",
      sortable: false,
      width: "10"
    },
    {
      text: "Title",
      sortable: false
    },
    {
      text: "Artist",
      sortable: false
    },
    {
      text: "Album",
      sortable: false
    }
  ];
}
</script>

<style lang="less">
.playlist-tracks {
  padding: 0;

  thead tr th:first-child {
    padding: 0;
  }
}
</style>
