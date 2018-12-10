<template>
  <div id="app">
    <v-app>
      <v-toolbar>
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

      <router-view></router-view>
    </v-app>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({ name: "app" })
export default class App extends Vue {
  navigateTo(path: string) {
    this.$router.push(path);
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
