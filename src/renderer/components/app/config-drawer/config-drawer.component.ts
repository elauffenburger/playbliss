import Vue from "vue";
import { Store } from "vuex";
import { Component, Prop, Watch } from "vue-property-decorator";

import SpotifyLogin from "../../spotify/SpotifyLogin.vue";

import { AppState } from "../../../store";
import { MusicSource } from "../../../models";
import { stringifyMusicSource } from "../../../helpers/util";

interface Action {
  loggedInOnly?: boolean;
  text: string;
  icon: string;
  action: () => void;
}

interface GeneralConfig {
  primaryMusicSourceDialogOpen: boolean;
  pendingPrimaryMusicSource: MusicSource | null;
  musicSources: { text: string; value: MusicSource }[];
}

interface SpotifyConfig {
  actions: Action[];
}

interface ConfigLookup {
  general: GeneralConfig;
  spotify: SpotifyConfig;
}

@Component({
  name: "ConfigDrawer",
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

  get primaryMusicSource(): MusicSource | null {
    return this.store.state.player.primaryMusicSource;
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

  setPendingPrimaryMusicSource(source: MusicSource) {
    this.config.general.pendingPrimaryMusicSource = source;
  }

  onChangePrimaryMusicSource(source: MusicSource) {
    this.$services.player.setPrimaryMusicSource(source);

    this.setPrimaryMusicSourceDialogVisibility(false);
  }

  onClickClosePrimaryMusicSourceDialog() {
    this.setPrimaryMusicSourceDialogVisibility(false);
  }

  setPrimaryMusicSourceDialogVisibility(visible: boolean) {
    this.config.general.primaryMusicSourceDialogOpen = visible;
  }

  stringifyMusicSource(source: MusicSource) {
    return stringifyMusicSource(source);
  }

  async cleanup() {
    await this.flushVirtualPlaylists();
  }

  async flushVirtualPlaylists() {
    const playlists = this.$services.playlists
      .getPlaylists(true)
      .filter(p => p.isVirtual);

    for (let playlist of playlists) {
      await this.$services.playlists.removePlaylist(playlist.id);
    }

    console.log(`removed ${playlists.length} playlists`);

    this.$services.ui.openSnackbar({
      message: `Done!`,
      timeout: 3000,
      parent: this.$el.parentElement as HTMLElement
    });
  }

  config: ConfigLookup = {
    general: {
      primaryMusicSourceDialogOpen: false,
      pendingPrimaryMusicSource: null,
      musicSources: [
        {
          text: stringifyMusicSource(MusicSource.Spotify),
          value: MusicSource.Spotify
        },
        {
          text: stringifyMusicSource(MusicSource.YouTube),
          value: MusicSource.YouTube
        }
      ]
    },
    spotify: {
      actions: [
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
        },
        {
          text: "Transfer Playback to PlayBliss",
          loggedInOnly: true,
          icon: "",
          action: () =>
            this.$services.spotifyPlayer.transferPlaybackToLocalPlayer()
        }
      ]
    }
  };
}
