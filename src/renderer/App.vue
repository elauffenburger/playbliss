<template>
  <div id="app">
    <div>
      <router-link to="/home">Home</router-link>
      <router-link to="/playlists/all">Playlists</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "playbliss"
};
</script>

<style>
/* CSS */
</style>
