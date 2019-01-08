<template>
  <v-data-table
    :headers="headers"
    :items="tracks"
    :hide-actions="true"
    class="elevation-1 tracks"
  >
    <template slot="no-data">
      <slot name="no-data" />
    </template>

    <template
      slot="items"
      slot-scope="props"
    >
      <SpotifyPlaylistTrackRow
        v-if="props.item.track.source == 'spotify'"
        removable
        :track="props.item"
      />

      <YouTubePlaylistTrackRow
        v-if="props.item.track.source == 'youtube'"
        removable
        :track="props.item"
      />
    </template>
  </v-data-table>
</template>

<script src="./tracks-table.component.ts" lang="ts"></script>

<style lang="less" scoped>
.tracks {
  padding: 0;
}

thead tr th:first-child {
  padding: 0;
}
</style>
