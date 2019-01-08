<template>
  <tr
    v-if="track"
    v-bind:class="{ 'playlist-track': true, 'active': isActiveTrack }"
    @contextmenu="showOptions($event)"
    @dblclick="onClickPlayPause()"
  >
    <td class="stripe-container">
      <span
        class="stripe"
        :style="{
          'background-color': stripeColor
        }"
      ></span>
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

    <PlaylistTrackOptions
      ref="options"
      :track="track"
      :removable="removable"
      @addToPlaylist="onClickAddToPlaylistOk($event.playlist)"
      @skipToEnd="onClickSkipToEnd($event)"
    />
  </tr>
</template>

<script lang="ts" src="./playlist-track-row.component.ts"></script>
<style lang="less" src="./playlist-track-row.component.less"></style>