<template>
  <div id="app">
    <v-app>
      <div class="">
        <v-toolbar class="nav-container">
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
        </v-toolbar>
      </div>

      <div class="content">
        <router-view></router-view>
      </div>

      <Player class="player" />
    </v-app>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import Player from "./components/player/Player/Player.vue";
import StickyFrame from "./widgets/StickyFrame/StickyFrame.vue";

@Component({
  name: "app",
  components: {
    Player,
    StickyFrame
  }
})
export default class App extends Vue {
  navigateTo(path: string) {
    this.$router.push(path);
  }

  mounted() {}
}
</script>

<style lang="less">
html {
  overflow-y: auto;
}

#app {
  display: flex;
  max-height: 100vh;
  flex-direction: column;

  .nav-container {
    flex: 1 1 100%;

    .nav {
      a {
        color: unset;
        text-decoration: none;
      }
    }
  }

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
