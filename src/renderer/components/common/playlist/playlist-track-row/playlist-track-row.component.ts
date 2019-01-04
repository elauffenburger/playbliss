import Vue from "vue";
import { Store } from "vuex";
import { Prop } from "vue-property-decorator";

import { PlaylistTrack, Playlist } from "../../../../models";
import { AppState } from "../../../../store";
import PlaylistTrackOptions from "../PlaylistTrackOptions/playlist-track-options.component";

export default class PlaylistTrackRow extends Vue {
  options: PlaylistTrackOptions | null = null;

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

  mounted() {
    this.options = this.$refs["options"] as PlaylistTrackOptions;
  }

  onClickPlayPause() {
    this.$services.player.toggleTrackPlay(this.track);
  }

  showOptions(e: MouseEvent) {
    if (!this.options) {
      console.error("No PlaylistTrackOptions ref found in template");

      return;
    }

    this.options.show(e);
  }
}
