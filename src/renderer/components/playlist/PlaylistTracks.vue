<template>
  <v-container class="playlist-tracks">
    <v-layout>
      <v-flex xs12>
        <TracksTable :tracks="playlist.tracks">
          <template slot="no-data">
            <tr>
              <td
                colspan="4"
                class="text-xs-center"
              >Add some new songs to get started!</td>
            </tr>
          </template>
        </TracksTable>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Playlist } from "../../models";

import TracksTable from "../../components/tracks/TracksTable/TracksTable.vue";
import AddPlaylistTrack from "../../components/playlist/AddPlaylistTrack.vue";

@Component({
  name: "PlaylistTracks",
  components: {
    TracksTable,
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
}
</style>
