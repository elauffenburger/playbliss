<template>
  <div id="app">
    <v-app>

      <div>
        <Header
          @settingsClicked="onSettingsClicked()"
          @toolbarIconClicked="onToolbarIconClicked()"
        />
        <MusicSourceConfigDrawer v-model="musicSourceConfigDrawerOpen" />
      </div>

      <div class="content">
        <Navigation v-model="navigationDrawerOpen" />
        <router-view></router-view>
      </div>

      <Player class="player" />
    </v-app>
  </div>
</template>

<script src="./app.component.ts" lang="ts"></script>

<style lang="less">
html {
  overflow-y: auto;
}

#app {
  display: flex;
  max-height: 100vh;
  flex-direction: column;

  .content {
    flex: 1 1 100%;

    overflow-y: auto;
    overflow-x: hidden;

    > * {
      max-height: inherit;
    }
  }

  .player {
    flex: 1 0 100%;
    max-height: 120px;
  }
}
</style>
