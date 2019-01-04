import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Track, Playlist } from "../../../../models";

interface PlaylistItem {
  text: string;
  value: Playlist;
}

@Component({
  name: "AddToPlaylistDialog"
})
export default class AddToPlaylistDialog extends Vue {
  @Prop({ required: true })
  open!: boolean;

  @Prop({ required: true })
  track!: Track;

  playlist: Playlist | null = null;

  get playlists(): PlaylistItem[] {
    return this.$services.playlists.getPlaylists().map<PlaylistItem>(p => {
      return {
        text: p.name,
        value: p
      };
    });
  }

  mounted() {}

  onClickCancel() {
    this.$emit("cancel");

    this.reset();
  }

  onClickOk() {
    const event: { playlist: Playlist | null } = {
      playlist: this.playlist
    };

    this.$emit("ok", event);

    this.reset();
  }

  reset() {
    this.playlist = null;
  }
}
