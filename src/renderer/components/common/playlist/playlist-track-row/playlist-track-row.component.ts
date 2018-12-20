import Vue from "vue";
import { Store } from "vuex";
import { Prop } from "vue-property-decorator";

import { PlaylistTrack } from "../../../../models";
import { AppState } from "../../../../store";

export default class PlaylistTrackRow extends Vue {
  contextMenuVisible = false;
  contextMenuPosition = {
    x: 0,
    y: 0
  };

  @Prop()
  track?: PlaylistTrack;

  get store(): Store<AppState> {
    return this.$store;
  }

  get isPlayingTrack() {
    if (!this.track) {
      // TODO: what do?
      return false;
    }

    return this.$services.player.isPlayingTrack(this.track);
  }

  onClickPlayPause() {
    if (!this.track) {
      // TODO: what do?
      return false;
    }

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
}
