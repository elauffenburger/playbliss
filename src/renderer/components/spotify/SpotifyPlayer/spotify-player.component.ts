import Vue from "vue";
import { SubscribeActionStore } from "vuex";

import { AppState } from "../../../store";
import { Component } from "vue-property-decorator";
import { SpotifyPoller } from "./helpers/spotify-poller";

import { initSpotifyPlaybackSdk } from "../../../spotify";

@Component({
  name: "SpotifyPlayer"
})
export default class SpotifyPlayer extends Vue {
  get store(): SubscribeActionStore<AppState> {
    return this.$store as any;
  }

  mounted() {
    if (this.$services) {
      const poller = new SpotifyPoller(
        this.$services.player,
        this.$services.spotify,
        this.$services.spotifyPlayer,
        this.store,
        {
          singlePoller: true,
          enabled: false,
          initSdk: () => {
            initSpotifyPlaybackSdk(cb =>
              cb(this.store.state.user.spotify.token)
            );
          }
        }
      );

      poller.startPolling();
    }
  }
}
