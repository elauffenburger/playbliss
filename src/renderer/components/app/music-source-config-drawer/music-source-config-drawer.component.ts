import Vue from "vue";
import Component from "vue-class-component";
import { Store } from "vuex";
import { AppState } from "src/renderer/store";

import SpotifyLogin from "../../spotify/SpotifyLogin.vue";
import { Prop, Watch } from "vue-property-decorator";

@Component({
  name: "MusicSourceConfigDrawer",
  components: {
    SpotifyLogin
  }
})
export default class MusicSourceConfigDrawer extends Vue {
  drawerOpen = false;

  @Prop()
  value?: boolean;

  @Watch("value")
  onOpenChanged(open: boolean) {
    this.drawerOpen = open;
  }

  @Watch("drawerOpen")
  onDrawerOpenChanged(open: boolean) {
    this.$emit("input", open);
  }

  get store(): Store<AppState> {
    return this.$store;
  }

  get spotifyStatusHealthy(): boolean {
    const healthy = this.store.state.user.spotify.loggedIn;

    return healthy;
  }

  get loggedIntoSpotify() {
    return this.store.state.user.spotify.loggedIn;
  }

  async loginToSpotify() {
    await this.$services.spotify.login();
  }

  syncSpotifyPlaylists() {
    this.$services.spotify.syncPlaylists();
  }

  clearSpotifyPlaylists() {
    this.$services.spotify.clearCachedPlaylists();
  }

  spotifyActions: { loggedInOnly?: boolean; text: string; icon: string; action: () => void }[] = [
    {
      text: "Login to Spotify",
      icon: "perm_identity",
      action: () => this.loginToSpotify()
    },
    {
      text: "Sync Spotify Playlists",
      loggedInOnly: true,
      icon: "sync",
      action: () => this.syncSpotifyPlaylists()
    },
    {
      text: "Clear Synced Spotify Playlists",
      loggedInOnly: true,
      icon: "clear",
      action: () => this.clearSpotifyPlaylists()
    }
  ];
}
