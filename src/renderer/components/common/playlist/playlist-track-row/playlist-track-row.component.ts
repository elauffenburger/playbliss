import Vue from "vue";
import { Store } from "vuex";
import { Prop, Component } from "vue-property-decorator";

import { PlaylistTrack, Playlist } from "../../../../models";
import { AppState } from "../../../../store";
import PlaylistTrackOptions from "../PlaylistTrackOptions/PlaylistTrackOptions.vue";
import PlaylistTrackOptionsComponent from "../PlaylistTrackOptions/playlist-track-options.component";

@Component({
  name: "PlaylistTrackRow",
  components: {
    PlaylistTrackOptions
  }
})
export default class PlaylistTrackRow extends Vue {
  options: PlaylistTrackOptionsComponent | null = null;

  @Prop({ required: true })
  track!: PlaylistTrack;

  @Prop({ default: true, type: Boolean })
  removable!: boolean;

  @Prop({ default: '#f5f5f5', type: String })
  stripeColor!: string;

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
    this.options = this.$refs["options"] as PlaylistTrackOptionsComponent;
  }

  onClickPlayPause() {
    this.$services.player.toggleTrackPlay(this.track);
  }

  onClickSkipToEnd(event: any) {
    this.$emit("skipToEnd", event);
  }

  showOptions(e: MouseEvent) {
    if (!this.options) {
      console.error("No PlaylistTrackOptions ref found in template");

      return;
    }

    this.options.show(e);
  }
}
