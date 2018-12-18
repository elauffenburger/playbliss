<template>
  <v-container class="container">
    <v-layout class="spotify-container">
      <v-flex xs12>
        <SpotifyPlayer />
      </v-flex>
    </v-layout>
    <v-layout class="youtube-container">
      <v-flex xs12>
        <YouTubePlayer />
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12>
        <div v-if="isPlayingTrack()">
          <span>Now Playing: {{track.track.name}}</span>
        </div>
        <div v-else>
          <span>Paused</span>
        </div>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs3>
        <v-btn @click="onClickPrevious()">&lt;</v-btn>
      </v-flex>
      <v-flex xs3>
        <v-btn @click="onClickPlay()">Play</v-btn>
      </v-flex>
      <v-flex xs3>
        <v-btn @click="onClickNext()">&gt;</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { SubscribeActionStore } from "vuex";
import Component from "vue-class-component";

import { AppState } from "../../store";
import { PlayTrackArgs } from "../../store/modules/player";
import { Track, PlaylistTrack, Playlist } from "../../models";

import YouTubePlayer from "../youtube/YouTubePlayer.vue";
import SpotifyPlayer from "../spotify/SpotifyPlayer.vue";

@Component({
  name: "Player",
  components: {
    YouTubePlayer,
    SpotifyPlayer
  }
})
export default class Player extends Vue {
  currentPlaylist?: Playlist;
  queue: PlaylistTrack[] = [];

  get track(): PlaylistTrack | null {
    return this.store.state.player.track;
  }

  isPlayingTrack() {
    const track = this.track;
    if (!track) {
      return false;
    }

    return this.$services.player.isPlayingTrack(track);
  }

  get store(): SubscribeActionStore<AppState> {
    return this.$store as any;
  }

  mounted() {
    const player = this.$services.player;

    player.trackEnded$.subscribe(event => {
      this.onTrackEnded(event.track);
    });

    player.playTrack$.subscribe(args => {
      const track = args.track;

      this.onPlayTrack(track);
    });

    player.playPlaylist$.subscribe(playlist => {
      this.playPlaylist(playlist);
    });
  }

  playPlaylist(playlist: Playlist) {
    this.currentPlaylist = playlist;
    this.queue = playlist.tracks;

    this.playCurrentTrack();
  }

  onTrackEnded(track: PlaylistTrack) {
    if (track.playlistId) {
      this.currentPlaylist = this.$services.playlists.getPlaylistById(
        track.playlistId
      );
    }

    this.playNextTrack();
  }

  playPreviousTrack() {
    if (!this.currentPlaylist) {
      return;
    }

    this.playCurrentTrack();
  }

  playNextTrack() {
    if (!this.currentPlaylist) {
      return;
    }

    this.queue.shift();

    this.playCurrentTrack();
  }

  playCurrentTrack() {
    if (!this.currentPlaylist || !this.queue.length) {
      return;
    }

    const track = this.queue[0];

    this.$services.player.playTrack(track);
  }

  onClickPrevious() {
    this.playPreviousTrack();
  }

  onClickPlay() {
    this.playCurrentTrack();
  }

  onClickNext() {
    this.playNextTrack();
  }

  onPlayTrack(track: PlaylistTrack) {
    if (track.playlistId) {
      const previousPlaylist = this.currentPlaylist;
      const playlist = this.$services.playlists.getPlaylistById(
        track.playlistId
      );

      this.currentPlaylist = playlist;
      this.queue = (playlist && playlist.tracks.slice(track.position)) || [];
    }
  }
}
</script>

<style lang="less">
.youtube-container {
  @height: 50px;
  max-height: @height;

  iframe {
    max-height: @height;
  }
}
</style>
