import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import SpotifyPlaylistTrackRow from "../../../components/spotify/SpotifyPlaylistTrackRow/SpotifyPlaylistTrackRow.vue";
import YouTubePlaylistTrackRow from "../../../components/youtube/YouTubePlaylistTrackRow.vue";

import { PlaylistTrack } from "../../../models";

@Component({
  name: "TracksTable",
  components: {
    SpotifyPlaylistTrackRow,
    YouTubePlaylistTrackRow
  }
})
export default class TracksTable extends Vue {
  @Prop()
  tracks?: PlaylistTrack[];

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
