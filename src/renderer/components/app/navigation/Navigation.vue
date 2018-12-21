<template>
  <v-navigation-drawer
    class="navigation-drawer"
    absolute
    stateless
    style="max-height: calc(100% - 185px);"
    v-model="drawerOpen"
  >
    <v-list expand>
      <v-list-group>
        <v-list-tile slot="activator">
          <v-list-tile-title>Playlists</v-list-tile-title>
        </v-list-tile>

        <v-list>
          <v-list-tile @click="">
            <v-list-tile-title>View</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" src="./navigation.component.ts"></script>

<style lang="less">
.navigation-drawer {
  top: 65px;
  z-index: 1;
}
</style>