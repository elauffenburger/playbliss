<template>
  <PlaylistTrackRow
    class="spotify-playlist-track"
    :track="track"
    :removable="removable"
    stripeColor="#1ed05d"
    @skipToEnd="onClickSkipToEnd($event)"
  />
</template>

<script src="./spotify-playlist-track-row.component.ts" lang="ts"></script>

<style lang="less"></style>