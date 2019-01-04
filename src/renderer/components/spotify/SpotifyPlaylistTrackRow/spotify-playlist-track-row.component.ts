import Component from "vue-class-component";
import { SpotifyTrack, MusicSource } from "../../../../renderer/models";
import { setTimeout } from "timers";

import PlaylistTrackRow from "../../common/playlist/playlist-track-row/playlist-track-row.component";

import AddToPlaylistDialog from "../../common/playlist/AddToPlaylistDialog/AddToPlaylistDialog.vue";
import PlaylistTrackOptions from "../../common/playlist/PlaylistTrackOptions/PlaylistTrackOptions.vue";

@Component({
  name: "SpotifyPlaylistTrack",
  components: {
    AddToPlaylistDialog,
    PlaylistTrackOptions
  }
})
export default class SpotifyPlaylistTrack extends PlaylistTrackRow {
  mounted() {
    super.mounted();
  }

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
