<template>
  <tr
    v-bind:class="{ 'spotify-playlist-track': true, 'active': isActiveTrack }"
    @contextmenu="showOptions($event)"
    @dblclick="onClickPlayPause()"
  >
    <td>
      <span class="stripe"></span>
    </td>
    <td>
      {{track.track.name}}
    </td>
    <td>
      {{track.track.artist}}
    </td>
    <td>
      {{track.track.album}}
    </td>

    <PlaylistTrackOptions ref="options" :track="track" :removable="removable" @addToPlaylist="onClickAddToPlaylistOk($event.playlist)" />
  </tr>
</template>

<script src="./spotify-playlist-track-row.component.ts" lang="ts"></script>

<style lang="less">
@import "../../common/playlist/playlist-track-row/playlist-track-row.component.less";

@spotify-green: #1ed05d;
@active: #1867c0;

table.v-table {
  tbody {
    tr.spotify-playlist-track {
      .playlist-track(@active, @spotify-green);
    }
  }
}
</style>