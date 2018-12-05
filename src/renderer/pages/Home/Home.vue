<template>
  <div>
    <div class="spotify">
      <SpotifyLogin />

      <div v-if="loggedIntoSpotify">
        <button @click="syncSpotifyPlaylists()">Sync Spotify Playlists</button>

        <div
          v-for="(playlist, i) in spotifyPlaylists"
          :key="i"
          class="playlist-container"
        >
          <div>{{playlist}}</div>
          <div>
            <button @click="forkPlaylist(playlist)">Fork Playlist</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import SpotifyLogin from "../../components/spotify/SpotifyLogin.vue";
import { Store } from "vuex";
import { AppState } from "@/renderer/store";
import { ROUTES } from "../../router";
import { Track, SpotifyTrack } from "../../../renderer/models";

@Component({
  name: "Home",
  components: { SpotifyLogin }
})
export default class Home extends Vue {
  store: Store<AppState> = <any>null;

  get loggedIntoSpotify() {
    return this.store.state.user.spotify.loggedIn;
  }

  get spotifyPlaylists(): SpotifyApi.PlaylistObjectSimplified[] {
    return this.store.getters["user/spotify/playlists"];
  }

  created() {
    this.store = this.$store;

    (window as any).getRouter = () => this.$router;
  }

  syncSpotifyPlaylists() {
    this.store.dispatch("user/spotify/getPlaylists");
  }

  async forkPlaylist(playlist: SpotifyApi.PlaylistObjectSimplified) {
    const tracks: SpotifyApi.PlaylistTrackObject[] = await this.store.dispatch(
      "user/spotify/getPlaylistTracks",
      playlist
    );

    this.$router.push({
      path: ROUTES.NEW_PLAYLIST,
      query: {
        json: JSON.stringify({
          tracks: tracks.map<Track>(trackInfo => {
            const track = trackInfo.track;

            return <SpotifyTrack>{
              name: track.name,
              sourceTrack: track,
              source: "spotify"
            };
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