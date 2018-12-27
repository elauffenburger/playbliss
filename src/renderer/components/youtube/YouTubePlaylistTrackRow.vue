<template>
  <tr
    v-bind:class="{ 'youtube-playlist-track': true, 'active': isActiveTrack }"
    @dblclick="onClickPlayPause()"
  >
    <td class="stripe"></td>
    <td>{{track.track.name}}</td>
    <td>Unknown</td>
    <td>Unknown</td>
  </tr>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import PlaylistTrackRow from "../common/playlist/playlist-track-row/playlist-track-row.component";

@Component({ name: "YouTubePlaylistTrack" })
export default class SpotifyPlaylistTrack extends PlaylistTrackRow {}
</script>

<style lang="less">
@import "../common/playlist/playlist-track-row/playlist-track-row.component.less";

@youtube-red: #f00;
@active: #1867c0;

table.v-table {
  tbody {
    tr.youtube-playlist-track {
      .playlist-track();

      &.active {
        color: @active;
      }

      td.stripe {
        position: absolute;
        background-color: @youtube-red;
        padding-left: 0;
        padding-right: 0;
        width: 10px;
      }
      padding-bottom: 5px;
    }
  }
}
</style>