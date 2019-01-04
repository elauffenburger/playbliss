<template>
  <div>
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

        <v-list-tile
          v-if="removable"
          @click="onClickRemoveFromPlaylist()"
        >
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
  </div>
</template>

<script lang="ts" src="./playlist-track-options.component.ts"></script>

<style lang="less" scoped>
</style>