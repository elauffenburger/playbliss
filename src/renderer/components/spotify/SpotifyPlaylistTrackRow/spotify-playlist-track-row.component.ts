import {
  SpotifyTrack,
  MusicSource,
  Track,
  PlaylistTrack
} from "../../../../renderer/models";
import { setTimeout } from "timers";

import PlaylistTrackRow from "../../common/playlist/playlist-track-row/PlaylistTrackRow.vue";
import { Prop, Component, Vue } from "vue-property-decorator";

@Component({
  name: "SpotifyPlaylistTrack",
  components: {
    PlaylistTrackRow
  }
})
export default class SpotifyPlaylistTrack extends Vue {
  @Prop({ required: true })
  track!: PlaylistTrack;

  @Prop({ type: Boolean })
  removable!: boolean;

  async onClickSkipToEnd() {
    if (!this.track || this.track.track.source != MusicSource.Spotify) {
      return;
    }

    await this.$services.player.playTrack(this.track);
    setTimeout(async () => {
      if (!this.track) {
        return;
      }

      await this.$services.spotifyPlayer.seek(
        (this.track.track as SpotifyTrack).sourceMedia.duration_ms - 1000
      );
    }, 1000);
  }
}
