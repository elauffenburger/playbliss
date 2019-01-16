import { Track, Playlist, MusicSource, PlaylistTrack } from "../../models";
import { Store } from "vuex";
import { AppState } from "../../store";
import { Subject, Observable } from "rxjs";
import { PlayTrackArgs } from "src/renderer/store/modules/player";

export interface TrackEndedEventArgs {
  track: PlaylistTrack;
}

export interface MasterPlayerService extends PlayerService {
  playTrack$: Observable<PlayTrackArgs>;
  playPlaylist$: Observable<Playlist>;
  started$: Observable<any>;
  trackEnded$: Observable<TrackEndedEventArgs>;

  setPrimaryMusicSource(source: MusicSource): Promise<void>;

  getCurrentTrack(): Promise<PlaylistTrack | null>;
  isActiveTrack(track: PlaylistTrack): boolean;
  isPlayingTrack(track: PlaylistTrack): boolean;
  setTrack(track: PlaylistTrack | null): Promise<any>;
  playPlaylist(playlist: Playlist): Promise<any>;
  setIsPlaying(isPlaying: boolean): Promise<any>;
  notifyTrackEnded(track: PlaylistTrack): Promise<any>;
  notifyStarted(): Promise<any>;
  toggleTrackPlay(track: PlaylistTrack): Promise<any>;
  setTrackProgress(progressMs: number | null): Promise<void>;
}

export interface PlayerService {
  source?: MusicSource;

  playTrack(track: PlaylistTrack): Promise<any>;
  pauseTrack(): Promise<any>;
  resumeTrack(): Promise<any>;
  seek(progressMs: number): Promise<any>;
}

export class DefaultMasterPlayerService implements MasterPlayerService {
  playTrack$ = new Subject<PlayTrackArgs>();
  playPlaylist$ = new Subject<Playlist>();
  started$ = new Subject();
  trackEnded$: Subject<TrackEndedEventArgs> = new Subject();

  constructor(
    private store: Store<AppState>,
    private players: PlayerService[]
  ) {}

  async setPrimaryMusicSource(source: MusicSource) {
    this.store.dispatch("player/setPrimaryMusicSource", source);
  }

  isPlayingTrack(track: PlaylistTrack): boolean {
    const state = this.store.state.player;

    return state.isPlaying && this.isActiveTrack(track);
  }

  isActiveTrack(track: PlaylistTrack) {
    const state = this.store.state.player;

    if (!state.track) {
      return false;
    }

    if (state.track.playlistId && track.playlistId) {
      return (
        state.track.playlistId == track.playlistId &&
        state.track.position == track.position
      );
    }

    return state.track.track.id == track.track.id;
  }

  async getCurrentTrack(): Promise<PlaylistTrack | null> {
    return this.store.state.player.track;
  }

  setTrack(track: PlaylistTrack | null): Promise<any> {
    return this.store.dispatch("player/setTrack", track);
  }

  async playPlaylist(playlist: Playlist): Promise<any> {
    this.playPlaylist$.next(playlist);
  }

  async playTrack(track: PlaylistTrack): Promise<any> {
    await this.store.dispatch("player/playTrack", { track });

    this.getPlayerForTrack(track.track).playTrack(track);
    this.getPlayersNotForTrack(track.track).forEach(p => p.pauseTrack());

    this.playTrack$.next({ track });
  }

  async resumeTrack(): Promise<any> {
    const track = await this.getCurrentTrack();
    if (!track) {
      // TODO: What do?
      return;
    }

    await this.store.dispatch("player/resumeTrack");

    this.getPlayerForTrack(track.track).resumeTrack();
    this.getPlayersNotForTrack(track.track).forEach(p => p.pauseTrack());
  }

  async pauseTrack(): Promise<any> {
    const track = await this.getCurrentTrack();
    if (!track) {
      // TODO: What do?
      return;
    }

    await this.store.dispatch("player/pauseTrack");

    this.getPlayerForTrack(track.track).pauseTrack();
  }

  async toggleTrackPlay(track: PlaylistTrack): Promise<any> {
    const state = this.store.state.player;

    // If the currently selected track is the passed in track:
    if (await this.isActiveTrack(track)) {
      return state.isPlaying
        ? await this.pauseTrack()
        : await this.resumeTrack();
    }

    // ...otherwise, start playing the passed track!
    return await this.playTrack(track);
  }

  async seek(progressMs: number) {
    const track = await this.getCurrentTrack();
    if (!track) {
      // TODO: What do?
      return;
    }

    await this.getPlayerForTrack(track.track).seek(progressMs);
    await this.setTrackProgress(progressMs);
  }

  async setIsPlaying(isPlaying: boolean): Promise<any> {
    this.store.dispatch("player/setIsPlaying", isPlaying);
  }

  async notifyTrackEnded(track: PlaylistTrack): Promise<any> {
    this.trackEnded$.next({ track });
  }

  async notifyStarted(): Promise<any> {
    this.started$.next();
  }

  async setTrackProgress(progressMs: number | null) {
    this.store.dispatch("player/setProgress", progressMs);
  }

  private getPlayerForTrack(track: Track): PlayerService {
    const player = this.players.find(p => p.source == track.source);
    if (!player) {
      throw new Error("No player found for track");
    }

    return player;
  }

  private getPlayersNotForTrack(track: Track): PlayerService[] {
    return this.players.filter(p => p.source != track.source) || [];
  }
}
