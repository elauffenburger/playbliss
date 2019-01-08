import Vue from "vue";
import { Store } from "vuex";
import { Watch, Component } from "vue-property-decorator";

import { MusicSource, Track, PlaylistTrack } from "../../models";
import { AppState } from "../../store";
import { mapSpotifyTrack, mapYouTubeVideo } from "../../helpers/tracks";
import { debouncer } from "../../helpers/util";
import { youtube_v3 } from "googleapis";

import TracksTable from "../../components/tracks/TracksTable/TracksTable.vue";

enum EntryMethod {
  search = "search",
  manual = "manual"
}

interface EntryMethodOption {
  text: string;
  value: EntryMethod;
}

interface Source {
  source: MusicSource;
  entryMethods: EntryMethodOption[];
}

interface SourceOption {
  text: string;
  value: Source;
}

const ENTRY_METHODS: { [key: string]: EntryMethodOption } = {
  SEARCH: {
    text: "Search",
    value: EntryMethod.search
  },
  MANUAL: {
    text: "Manual",
    value: EntryMethod.manual
  }
};

const SOURCES: { [key: string]: SourceOption } = {
  SPOTIFY: {
    text: "Spotify",
    value: {
      source: MusicSource.Spotify,
      entryMethods: [ENTRY_METHODS.SEARCH]
    }
  },
  YOUTUBE: {
    text: "YouTube",
    value: {
      source: MusicSource.YouTube,
      entryMethods: [ENTRY_METHODS.SEARCH, ENTRY_METHODS.MANUAL]
    }
  }
};

@Component({
  name: "SearchTracks",
  components: {
    TracksTable
  }
})
export default class SearchTracks extends Vue {
  sources: SourceOption[] = [SOURCES.SPOTIFY, SOURCES.YOUTUBE];

  loading = false;
  entryLabel = "";
  tracks: PlaylistTrack[] = [];

  source: Source = SOURCES.SPOTIFY.value;
  entryMethod: EntryMethod = this.getFirstEntryMethodForSource(
    SOURCES.SPOTIFY.value
  );

  manualEntry = "";

  debouncedSearch = debouncer();
  debouncedManualEntry = debouncer();

  @Watch("entryMethod")
  onEntryMethodChanged(entryMethod: EntryMethod) {
    this.entryLabel = this.getEntryLabelForMethod(entryMethod);
  }

  @Watch("source")
  onSourceChanged(source: Source) {
    this.tracks = [];
    this.entryMethod = this.getFirstEntryMethodForSource(source);

    this.onSearchChange(this.trackSearch);
  }

  @Watch("manualEntry")
  onManualEntryChanged(url: string) {
    this.loading = true;

    this.debouncedManualEntry(() => {
      this.updateTrackFromManualEntry(url);

      this.loading = false;
    });
  }

  get store(): Store<AppState> {
    return this.$store;
  }

  get trackSearch(): string {
    return this.store.state.ui.search;
  }

  mounted() {
    this.runSearch(this.trackSearch);
  }

  onSearchChange(search: string) {
    this.debouncedSearch(async () => {
      await this.runSearch(search);
    });
  }

  async runSearch(search: string): Promise<any> {
    try {
      this.loading = true;

      if (!search) {
        console.error("no search provided to runSearch");

        this.tracks = [];
        return;
      }

      this.$services.ui.setSearch(search);

      switch (this.source.source) {
        case MusicSource.Spotify:
          return await this.runSpotifySearch(search);
        case MusicSource.YouTube:
          return await this.runYouTubeSearch(search);
        default:
          console.error("no source provided for runSearch");
      }
    } finally {
      this.loading = false;
    }
  }

  async runSpotifySearch(search: string) {
    const spotifyTracks = await this.$services.spotify.searchTrack(search);
    const tracks = spotifyTracks.map<Track>(t => mapSpotifyTrack(t));

    const playlist = await this.$services.playlists.createPlaylist({
      tracks: tracks,
      isVirtual: true
    });

    this.tracks = playlist.tracks;
  }

  async runYouTubeSearch(search: string) {
    const youtubeTracks = await this.searchYouTubeVideos(search);

    const tracks = youtubeTracks
      .map(t => mapYouTubeVideo(t))
      .filter(t => !!t) as Track[];

    const playlist = await this.$services.playlists.createPlaylist({
      isVirtual: true,
      tracks
    });

    this.tracks = playlist.tracks;
  }

  async searchYouTubeVideos(
    search: string
  ): Promise<youtube_v3.Schema$Video[]> {
    const searchVideosResponse = await this.$services.youtube.searchVideos({
      search,
      maxResults: 10
    });

    const videoIds = (searchVideosResponse.items || [])
      .map(v => v.id && v.id.videoId)
      .filter(id => !!id);

    const getVideosResponse = await this.$services.youtube.getVideos({
      id: videoIds.join(",")
    });

    return getVideosResponse.items || [];
  }

  updateTrackFromManualEntry(url: string) {
    switch (this.source.source) {
      case MusicSource.YouTube:
        this.updateTrackFromYouTubeManualEntry(url);
        break;
    }
  }

  async updateTrackFromYouTubeManualEntry(url: string) {
    const youtubeVideo: youtube_v3.Schema$Video = await this.$services.youtube.getVideoByUrl(
      url
    );

    const track = mapYouTubeVideo(youtubeVideo);
    if (!track) {
      this.tracks = [];
      return;
    }

    const playlist = await this.$services.playlists.createPlaylist({
      isVirtual: true,
      tracks: [track]
    });

    this.tracks = playlist.tracks;
  }

  getFirstEntryMethodForSource(source: Source): EntryMethod {
    return source.entryMethods[0].value;
  }

  getEntryLabelForMethod(entryMethod: EntryMethod): string {
    switch (entryMethod) {
      case EntryMethod.search:
        return `Song Name`;
      case EntryMethod.manual:
        return `Song URL`;
    }

    throw "Unknown entry method!";
  }

  reset() {
    this.tracks = [];
    this.manualEntry = "";
    this.$services.ui.setSearch("");
  }
}
