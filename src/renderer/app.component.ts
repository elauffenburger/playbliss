import Vue from "vue";
import Component from "vue-class-component";

import Player from "./components/player/Player/Player.vue";
import Header from "./components/app/header/Header.vue";
import Navigation from "./components/app/navigation/Navigation.vue";
import MusicSourceConfigDrawer from "./components/app/music-source-config-drawer/MusicSourceConfigDrawer.vue";

@Component({
  name: "app",
  components: {
    Player,
    Navigation,
    MusicSourceConfigDrawer,
    Header
  }
})
export default class App extends Vue {
  navigationDrawerOpen = false;
  musicSourceConfigDrawerOpen = false;

  mounted() { }

  onToolbarIconClicked() {
    this.navigationDrawerOpen = !this.navigationDrawerOpen;
  }

  onSettingsClicked() {
    this.musicSourceConfigDrawerOpen = !this.musicSourceConfigDrawerOpen;
  }
}
