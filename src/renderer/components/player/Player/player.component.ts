import Vue from "vue";
import { SubscribeActionStore } from "vuex";
import Component from "vue-class-component";

import { AppState } from "../../../store";
import { PlaylistTrack, Playlist } from "../../../models";

import YouTubePlayer from "../../youtube/YouTubePlayer/YouTubePlayer.vue";
import SpotifyPlayer from "../../spotify/SpotifyPlayer/SpotifyPlayer.vue";

const PLAY_PREVIOUS_TRACK_THRESHOLD_PERCENTAGE = 5;

@Component({
  name: "Player",
  components: {
    YouTubePlayer,
    SpotifyPlayer
  }
})
export default class Player extends Vue {
  queue: PlaylistTrack[] = [];

  get currentPlaylist(): Playlist | null {
    return (
      (this.track &&
        this.track.playlistId &&
        this.$services.playlists.getPlaylistById(this.track.playlistId)) ||
      null
    );
  }

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

  get isActiveTrack() {
    const track = this.track;
    if (!track) {
      return false;
    }

    return this.$services.player.isActiveTrack(track);
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
    this.queue = playlist.tracks;

    this.playCurrentTrack();
  }

  onTrackEnded(track: PlaylistTrack) {
    this.playNextTrack();
  }

  playPreviousTrack() {
    if (
      !this.currentPlaylist ||
      !this.track ||
      this.track.position == null ||
      this.track.position == 0
    ) {
      return;
    }

    this.queue = this.cloneTracks(this.currentPlaylist.tracks, this.track.position - 1);

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

  shouldRestartTrackInsteadOfPlayingPrevious() {
    const progressAboveSkipThreshold = (this.progressPercentage || 0) > PLAY_PREVIOUS_TRACK_THRESHOLD_PERCENTAGE;
    const noPreviousTrack = (this.track && this.track.position != null && this.track.position == 0) || false;

    return progressAboveSkipThreshold || noPreviousTrack;
  }

  onClickPrevious() {
    if (this.shouldRestartTrackInsteadOfPlayingPrevious()) {
      this.$services.player.seek(1);

      return;
    }

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

      this.queue = (playlist && this.cloneTracks(playlist.tracks, track.position)) || [];
    }
  }

  onTogglePlayPause() {
    if (!this.track) {
      return;
    }

    this.$services.player.toggleTrackPlay(this.track);
  }

  private cloneTracks(tracks: PlaylistTrack[], from: number = 0) {
    return tracks.slice(from);
  }
}
