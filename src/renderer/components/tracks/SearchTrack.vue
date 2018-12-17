<template>
  <v-layout>
    <v-flex xs3>
      <v-select
        v-model="source"
        label="Source"
        :items="sources"
      >
      </v-select>
    </v-flex>

    <v-flex xs3>
      <v-select
        v-model="entryMethod"
        label="Entry Method"
        :items="source.entryMethods"
      >
      </v-select>
    </v-flex>

    <v-flex
      v-if="entryMethod == 'search'"
      xs6
    >
      <v-autocomplete
        v-model="track"
        :items="tracks"
        :loading="loading"
        :search-input.sync="search"
        :label="entryLabel"
        item-text="text"
        item-value="track"
      >
        <template slot="no-data">
          <v-list-tile>
            <v-list-tile-title>
              Search for a song
            </v-list-tile-title>
          </v-list-tile>
        </template>

        <template
          slot="item"
          slot-scope="{ item }"
        >
          <v-list-tile>
            <v-list-tile-title>
              {{item.track.name}} | {{item.track.artist}} | {{item.track.album}}
            </v-list-tile-title>
          </v-list-tile>
        </template>
      </v-autocomplete>
    </v-flex>

    <v-flex
      v-if="entryMethod == 'manual'"
      xs6
    >
      <v-text-field
        label="Enter Song URL"
        v-model="manualEntry"
      ></v-text-field>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from "vue";
import { Store } from "vuex";
import { Watch, Component, Prop } from "vue-property-decorator";

import { MusicSource, Track, Playlist } from "../../models";
import { AppState } from "../../store";
import { mapSpotifyTrack, mapYouTubeVideo } from "../../helpers/tracks";
import { clearTimeout, setTimeout } from "timers";
import { debouncer } from "../../helpers/util";
import { youtube_v3 } from 'googleapis';

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
      entryMethods: [ENTRY_METHODS.MANUAL]
    }
  }
};

@Component({ name: "SearchTrack" })
export default class SearchTrack extends Vue {
  sources: SourceOption[] = [SOURCES.SPOTIFY, SOURCES.YOUTUBE];

  loading = false;
  entryLabel = "";
  tracks: { text: string; track: Track }[] = [];

  source: Source = SOURCES.SPOTIFY.value;
  entryMethod: EntryMethod = this.getFirstEntryMethodForSource(
    SOURCES.SPOTIFY.value
  );
  search = "";
  manualEntry = "";
  track: Track | null = null;

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
  }

  @Watch("search")
  onSearchChanged(search: string) {
    this.loading = true;

    this.debouncedSearch(async () => {
      await this.runSearch(search);
      this.loading = false;
    });
  }

  @Watch("manualEntry")
  onManualEntryChanged(url: string) {
    this.loading = true;

    this.debouncedManualEntry(() => {
      this.updateTrackFromManualEntry(url);
      this.loading = false;
    });
  }

  @Watch("track")
  onTrackChanged(track: Track) {
    this.$emit("trackSelected", track);
  }

  get store(): Store<AppState> {
    return this.$store;
  }

  async runSearch(search: string): Promise<any> {
    if (!search) {
      this.tracks = [];
      return;
    }

    switch (this.source.source) {
      case MusicSource.Spotify:
        return await this.runSpotifySearch(search);
      case MusicSource.YouTube:
        this.runYouTubeSearch(search);
        break;
    }
  }

  async runSpotifySearch(search: string) {
    const spotifyTracks: SpotifyApi.TrackObjectFull[] = await this.store.dispatch(
      "user/spotify/searchTrack",
      search
    );

    const tracks = spotifyTracks.map(t => {
      const track = mapSpotifyTrack(t);

      return {
        text: track.name,
        track: track
      };
    });

    this.tracks = this.tracks.concat(tracks);
  }

  runYouTubeSearch(search: string) {}

  updateTrackFromManualEntry(url: string) {
    switch (this.source.source) {
      case MusicSource.YouTube:
        this.updateTrackFromYouTubeManualEntry(url);
        break;
    }
  }

  async updateTrackFromYouTubeManualEntry(url: string) {
    const youtubeVideo: youtube_v3.Schema$Video = await this.store.dispatch(
      "user/youtube/getVideoByUrl",
      url
    );

    this.track = mapYouTubeVideo(youtubeVideo);
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
    this.search = "";
    this.manualEntry = "";
    this.track = null;
  }
}
</script>

<style>
</style>
