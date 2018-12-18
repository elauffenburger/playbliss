<template>
  <v-container>
    <div class="spotify">
      <SpotifyLogin />

      <div v-if="loggedIntoSpotify">
        <v-btn @click="syncSpotifyPlaylists()">Sync Spotify Playlists</v-btn>
        <v-btn @click="clearSpotifyPlaylists()">Clear Synced Spotify Playlists</v-btn>

        <div
          v-for="(playlist, i) in spotifyPlaylists"
          :key="i"
          class="playlist-container"
        >
          <div>{{playlist}}</div>
          <div>
            <v-btn @click="forkPlaylist(playlist)">Fork Playlist</v-btn>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Store } from "vuex";
import {Component, Watch} from "vue-property-decorator";

import SpotifyLogin from "../../components/spotify/SpotifyLogin.vue";

import { AppState } from "../../store";
import { ROUTES } from "../../router";
import { Track, SpotifyTrack } from "../../models";
import { mapSpotifyTrack } from "../../helpers/tracks";

@Component({
  name: "Home",
  components: { SpotifyLogin }
})
export default class Home extends Vue {
  get loggedIntoSpotify() {
    return this.store.state.user.spotify.loggedIn;
  }

  get spotifyPlaylists(): SpotifyApi.PlaylistObjectSimplified[] {
    return this.$services.spotify.getCachedPlaylists();
  }

  get store(): Store<AppState> {
    return this.$store;
  }

  created() {
    (window as any).getRouter = () => this.$router;
  }

  syncSpotifyPlaylists() {
    this.$services.spotify.syncPlaylists();
  }

  clearSpotifyPlaylists() {
    this.$services.spotify.clearCachedPlaylists();
  }

  async forkPlaylist(playlist: SpotifyApi.PlaylistObjectSimplified) {
    const tracks = await this.$services.spotify.getPlaylistTracks(playlist);

    this.$router.push({
      path: ROUTES.NEW_PLAYLIST,
      query: {
        json: JSON.stringify({
          tracks: tracks.map<Track>(trackInfo => {
            const track = trackInfo.track;
            return mapSpotifyTrack(track);
          })
        })
      }
    });
  }
}
</script>

<style lang="less">
.spotify {
  .playlist-container {
    border: 1px solid black;

    &self::not(:last-child) {
      margin-bottom: 10px;
    }
  }
}
</style>