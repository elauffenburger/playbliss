import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Playlist, PlaylistTrack } from "../../../../models";

import AddToPlaylistDialog from "../AddToPlaylistDialog/AddToPlaylistDialog.vue";

@Component({
  name: "PlaylistTrackOptions",
  components: {
    AddToPlaylistDialog
  }
})
export default class PlaylistTrackOptions extends Vue {
  contextMenuVisible = false;
  contextMenuPosition = {
    x: 0,
    y: 0
  };

  isAddToPlaylistDialogOpen = false;

  @Prop({ required: true })
  track!: PlaylistTrack;

  @Prop({ required: true })
  removable!: boolean;

  show(e: MouseEvent) {
    e.preventDefault();

    const isOpen = this.contextMenuVisible;
    this.contextMenuVisible = false;

    if (isOpen) {
      return;
    }

    this.contextMenuPosition.x = e.clientX;
    this.contextMenuPosition.y = e.clientY;

    this.$nextTick(() => {
      this.contextMenuVisible = true;
    });
  }

  onClickAddToPlaylist() {
    this.setAddToPlaylistDialogVisibility(true);
  }

  onClickAddToPlaylistCancel() {
    this.setAddToPlaylistDialogVisibility(false);
  }

  onClickAddToPlaylistOk(playlist: Playlist | null) {
    if (!playlist) {
      return;
    }

    this.$services.playlists.addTrackToPlaylist(playlist.id, this.track.track);
    this.setAddToPlaylistDialogVisibility(false);
  }

  setAddToPlaylistDialogVisibility(visible: boolean) {
    this.isAddToPlaylistDialogOpen = visible;
  }

  onClickRemoveFromPlaylist() {
    this.$services.playlists.removeTrack(this.track);
  }

  onClickSkipToEnd(event: any) {
    this.$emit("skipToEnd", event);
  }
}
