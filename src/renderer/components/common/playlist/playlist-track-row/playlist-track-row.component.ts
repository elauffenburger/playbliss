import Vue from "vue";
import { Store } from "vuex";
import { Prop } from "vue-property-decorator";

import { PlaylistTrack, Playlist } from "../../../../models";
import { AppState } from "../../../../store";

export default class PlaylistTrackRow extends Vue {
  contextMenuVisible = false;
  contextMenuPosition = {
    x: 0,
    y: 0
  };

  isAddToPlaylistDialogOpen = false;

  @Prop({ required: true })
  track!: PlaylistTrack;

  @Prop({ default: true })
  removable!: boolean;

  get store(): Store<AppState> {
    return this.$store;
  }

  get isPlayingTrack() {
    return this.$services.player.isPlayingTrack(this.track);
  }

  get isActiveTrack() {
    return this.$services.player.isActiveTrack(this.track);
  }

  onClickPlayPause() {
    this.$services.player.toggleTrackPlay(this.track);
  }

  showContextMenu(e: MouseEvent) {
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
}
