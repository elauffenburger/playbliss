<template>
  <div id="app">
    <v-app>
      <div
        class="nav-wrapper"
        ref="navWrapper"
      >
        <v-toolbar
          fixed
          ref="nav"
        >
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

      <router-view></router-view>

      <div class="player-wrapper">
        <Player />
      </div>
    </v-app>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import Player from "./components/player/Player.vue";

@Component({
  name: "app",
  components: {
    Player
  }
})
export default class App extends Vue {
  navigateTo(path: string) {
    this.$router.push(path);
  }

  mounted() {
    const navWrapper = this.$refs["navWrapper"] as HTMLDivElement;
    const nav = this.$refs["nav"] as Vue;

    if (!navWrapper || !nav) {
      return;
    }

    navWrapper.style.height = `${nav.$el.scrollHeight}px`;
  }
}
</script>

<style lang="less">
.nav {
  a {
    color: unset;
    text-decoration: none;
  }
}
</style>
