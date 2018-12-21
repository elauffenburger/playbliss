<template>
  <v-toolbar class="nav-container" style="z-index: 2;">
    <v-toolbar-side-icon @click="onClickToolbarIcon()"></v-toolbar-side-icon>
    <v-toolbar-title>PlayBliss</v-toolbar-title>

    <v-toolbar-items class="nav">
      <v-btn
        flat
        @click="navigateTo('/home')"
      >Home</v-btn>

      <v-btn
        flat
        @click="navigateTo('/playlists/all')"
      >Playlists</v-btn>
    </v-toolbar-items>
    
    <v-spacer />

    <v-btn icon @click="onClickSettings()">
      <v-icon>settings</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script lang="ts" src="./header.component.ts"></script>

<style lang="less">
.nav-container {
  flex: 1 1 100%;

  .nav {
    a {
      color: unset;
      text-decoration: none;
    }
  }
}
</style>
