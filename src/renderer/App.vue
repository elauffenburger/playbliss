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
        <div class="navigation-drawer">
          <Navigation />
        </div>

        <div class="content-inner">
          <router-view :key="$route.fullPath"></router-view>
        </div>
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
    display: flex;
    flex: 1 1 100%;

    > * {
      max-height: inherit;
    }

    .navigation-drawer {
      display: flex;
      flex: 1 1 unset;
      z-index: 1;
      flex-direction: column;
    }

    .content-inner {
      flex: 1 1 100%;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }

  .player {
    flex: 1 0 100%;
    max-height: 120px;
  }
}
</style>
