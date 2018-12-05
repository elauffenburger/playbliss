import Vue from "vue";
import Router, { Route } from "vue-router";

import Home from "../pages/Home/Home.vue";
import NewPlaylist from "../pages/NewPlaylist/NewPlaylist.vue";
import Playlists from "../pages/Playlists/Playlists.vue";

Vue.use(Router);

export const ROUTES = {
  HOME: "/home",
  NEW_PLAYLIST: "/playlists/new",
  ALL_PLAYLISTS: "/playlists/all"
};

function parseComplexQuery(route: Route) {
  console.log(route);

  let json = route.query["json"];
  json = (Array.isArray(json) && json.length ? json[0] : json) as string;

  const props = {
    ...route.params,
    ...(json ? JSON.parse(json) : {})
  };

  return props;
}

export default new Router({
  routes: [
    {
      path: ROUTES.HOME,
      name: "home",
      component: Home
    },
    {
      path: ROUTES.NEW_PLAYLIST,
      name: "new-playlist",
      component: NewPlaylist,
      props: route => parseComplexQuery(route)
    },
    {
      path: ROUTES.ALL_PLAYLISTS,
      name: "all-playlists",
      component: Playlists
    },
    {
      path: "*",
      redirect: "/home"
    }
  ]
});
