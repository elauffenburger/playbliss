import Vue from "vue";
import Router, { Route } from "vue-router";

import Home from "../pages/Home/Home.vue";
import NewPlaylist from "../pages/NewPlaylist/NewPlaylist.vue";
import Playlists from "../pages/Playlists/Playlists.vue";
import ViewPlaylist from "../pages/Playlists/ViewPlaylist.vue";
import SearchTracks from '../pages/SearchTracks/SearchTracks.vue';

Vue.use(Router);

export const ROUTES = {
  HOME: "/home",
  SEARCH_TRACKS: "/tracks/search",
  VIEW_PLAYLIST: "/playlist/:id",
  NEW_PLAYLIST: "/playlists/new",
  ALL_PLAYLISTS: "/playlists/all",
  BUILD: {
    viewPlaylist: (id: string) => `/playlist/${id}`
  }
};

function parseComplexQuery(route: Route) {
  let json = route.query["json"];
  json = (Array.isArray(json) && json.length ? json[0] : json) as string;

  const props = {
    ...route.params,
    ...(json ? JSON.parse(json) : {})
  };

  console.log("finished parsing query");

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
      path: ROUTES.SEARCH_TRACKS,
      name: "search-tracks",
      component: SearchTracks
    },
    {
      path: ROUTES.VIEW_PLAYLIST,
      name: "playlist",
      component: ViewPlaylist,
      props: route => {
        return {
          playlistId: route.params["id"]
        }
      }
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
