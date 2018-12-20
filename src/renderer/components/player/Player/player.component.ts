import Vue from "vue";
import { SubscribeActionStore } from "vuex";
import Component from "vue-class-component";

import { AppState } from "../../../store";
import { PlaylistTrack, Playlist } from "../../../models";

import YouTubePlayer from "../../youtube/YouTubePlayer/YouTubePlayer.vue";
import SpotifyPlayer from "../../spotify/SpotifyPlayer/SpotifyPlayer.vue";

@Component({
  name: "Player",
  components: {
    YouTubePlayer,
    SpotifyPlayer
  }
})
export default class Player extends Vue {
  currentPlaylist: Playlist | null = null;
  queue: PlaylistTrack[] = [];

  get track(): PlaylistTrack | null {
    return this.store.state.player.track;
  }

  get progressPercentage(): number | null {
    if (!this.track) {
      return null;
    }

    const progressMs = this.store.state.player.progress.progressMs;
    if (!progressMs) {
      return null;
    }

    const durationMs = this.track.track.durationMs;
    if (durationMs == 0) {
      return null;
    }

    return (progressMs / durationMs) * 100;
  }

  get isPlayingTrack() {
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
      this.currentPlaylist = this.$services.playlists.getPlaylistById(track.playlistId);
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
      const playlist = this.$services.playlists.getPlaylistById(track.playlistId);

      this.currentPlaylist = playlist;
      this.queue = (playlist && playlist.tracks.slice(track.position)) || [];
    }
  }

  onTogglePlayPause() {
    if (!this.track) {
      return;
    }

    this.$services.player.toggleTrackPlay(this.track);
  }
}
