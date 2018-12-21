<template>
  <div>
    <v-btn @click="onClickLogin()">Click to {{loggedIn ? 'Re-': ''}}Login To Spotify</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import environment from "../../../environment";
import { remote, BrowserWindow } from "electron";
import { Prop } from "vue-property-decorator";
import { Store } from "vuex";
import { AppState } from "../../store";
import { toHashParams } from '../../helpers/util';

@Component({
  name: "SpotifyLogin"
})
export default class SpotifyLogin extends Vue {
  authWindow?: BrowserWindow;

  get store(): Store<AppState> {
    return this.$store;
  }

  get loggedIn(): boolean {
    return this.store.state.user.spotify.loggedIn;
  }

  async onClickLogin() {
    await this.$services.spotify.login();
    this.emitLogin();
  }

  emitLogin() {
    this.$emit("login");
  }
}
</script>