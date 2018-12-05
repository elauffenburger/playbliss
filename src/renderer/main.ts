import Vue from "vue";
import Vuex from "vuex";
import SpotifyWebApi from 'spotify-web-api-node';

Vue.use(Vuex);

import router from "./router";
import makeStore from "./store";
import App from "./App.vue";
import environment from '../environment';
import { BasicOAuthService } from './services/oauth';

if (!process.env.IS_WEB) {
  Vue.use(require("vue-electron"));
}

Vue.config.productionTip = false;

const store = makeStore({
  user: {
    spotify: {
      client: new SpotifyWebApi(),
      oauth: {
        ...environment.spotify.oauth,
        service: new BasicOAuthService()
      }
    }
  }
});

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
