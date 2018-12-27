<template>
  <tr
    v-bind:class="{ 'spotify-playlist-track': true, 'active': isActiveTrack }"
    @contextmenu="showContextMenu($event)"
    @dblclick="onClickPlayPause()"
  >
    <td class="stripe"></td>
    <td>
      {{track.track.name}}
    </td>
    <td>
      {{track.track.artist}}
    </td>
    <td>
      {{track.track.album}}
    </td>

    <v-menu
      v-model="contextMenuVisible"
      :position-x="contextMenuPosition.x"
      :position-y="contextMenuPosition.y"
    >
      <v-list>
        <v-list-tile @click="onClickSkipToEnd()">
          <v-list-tile-title>[Debug] Skip to end</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </tr>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Store } from "vuex";
import { AppState } from "../../store";
import { Prop } from "vue-property-decorator";
import {
  Playlist,
  PlaylistTrack,
  SpotifyTrack,
  MusicSource
} from "../../../renderer/models";
import { setTimeout } from "timers";

import PlaylistTrackRow from "../common/playlist/playlist-track-row/playlist-track-row.component";

@Component({ name: "SpotifyPlaylistTrack" })
export default class SpotifyPlaylistTrack extends PlaylistTrackRow {
  async onClickSkipToEnd() {
    if (!this.track || this.track.track.source != MusicSource.Spotify) {
      return;
    }

    await this.$services.player.playTrack(this.track);
    setTimeout(async () => {
      if (!this.track) {
        return;
      }

      await this.$services.spotifyPlayer.seek(
        (this.track.track as SpotifyTrack).sourceMedia.duration_ms - 1000
      );
    }, 1000);
  }
}
</script>

<style lang="less">
@import "../common/playlist/playlist-track-row/playlist-track-row.component.less";

@spotify-green: #1ed05d;
@active: #1867c0;

table.v-table {
  tbody {
    tr.spotify-playlist-track {
      .playlist-track();

      &.active {
        color: @active;
      }

      td.stripe {
        position: absolute;
        background-color: @spotify-green;
        padding-left: 0;
        padding-right: 0;
        width: 10px;
      }
    }
  }
}
</style>