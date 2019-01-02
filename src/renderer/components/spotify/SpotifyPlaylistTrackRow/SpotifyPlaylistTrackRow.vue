<template>
  <tr
    v-bind:class="{ 'spotify-playlist-track': true, 'active': isActiveTrack }"
    @contextmenu="showContextMenu($event)"
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

    <v-menu
      v-model="contextMenuVisible"
      :position-x="contextMenuPosition.x"
      :position-y="contextMenuPosition.y"
    >
      <v-list>
        <v-list-tile @click="onClickSkipToEnd()">
          <v-list-tile-title>[Debug] Skip to end</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="onClickAddToPlaylist()">
          <v-list-tile-title>Add to Playlist</v-list-tile-title>
        </v-list-tile>

        <v-list-tile v-if="removable" @click="onClickRemoveFromPlaylist()">
          <v-list-tile-title>Remove from Playlist</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>

    <AddToPlaylistDialog
      :open="isAddToPlaylistDialogOpen"
      :track="track"
      @cancel="onClickAddToPlaylistCancel()"
      @ok="onClickAddToPlaylistOk($event.playlist)"
    />
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