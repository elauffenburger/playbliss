<template>
  <div>
    <div>Logged into Spotify: {{loggedIn}}</div>
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

  getAuthorizeUri(): Promise<string> {
    return this.$services.spotify.getOAuthAuthorizationUri();
  }

  getRedirectUri(): Promise<string> {
    return this.$services.spotify.getOAuthRedirectUri();
  }

  get loggedIn(): boolean {
    return this.store.state.user.spotify.loggedIn;
  }

  async onClickLogin() {
    const authWindow = new remote.BrowserWindow({
      width: 600,
      height: 400
    });

    this.authWindow = authWindow;

    authWindow.loadURL(await this.getAuthorizeUri());

    authWindow.webContents.on("did-navigate", async event => {
      const uri = authWindow.webContents.getURL();

      if (!uri.startsWith(await this.getRedirectUri())) {
        console.log("login incomplete");
        return;
      }

      const url = new URL(uri);
      const token = toHashParams(url.hash)['access_token'];
      if (!token) {
        // TODO: what do?
        console.log("failed to find token in url");
        return;
      }

      this.completeLogin(token);
    });
  }

  async completeLogin(token: string) {
    console.log("login complete!");

    if (this.authWindow) {
      this.authWindow.close();
    }

    await this.$services.spotify.login(token);

    this.emitLogin();
  }

  emitLogin() {
    this.$emit("login");
  }
}
</script>