import Vue from "vue";
import Component from "vue-class-component";
import { ROUTES } from "../../../router";

type NavigationOption =
  | { title: string; icon?: string; action: () => void }
  | { header: string }
  | { divider: boolean };

const PLAYLISTS_HEADER = "Playlists";

@Component({ name: "Navigation" })
export default class Navigation extends Vue {
  get navigation(): NavigationOption[] {
    const baseNavOptions: NavigationOption[] = [
      {
        title: "Home",
        icon: "home",
        action: () => this.navigateTo(ROUTES.HOME)
      },
      {
        title: "All Playlists",
        icon: "playlist_play",
        action: () => this.navigateTo(ROUTES.ALL_PLAYLISTS)
      },
      {
        title: "Search Tracks",
        icon: "search",
        action: () => this.navigateTo(ROUTES.SEARCH_TRACKS)
      },
      { header: PLAYLISTS_HEADER }
    ];

    const playlists = this.getPlaylistsAsNavOptions();

    return baseNavOptions.concat(playlists);
  }

  getPlaylistsAsNavOptions(): NavigationOption[] {
    const playlists: NavigationOption[] = this.$services.playlists
      .getPlaylists()
      .map(p => {
        return {
          title: p.name,
          action: () => this.navigateTo(ROUTES.BUILD.viewPlaylist(p.id))
        };
      });

    return playlists;
  }

  navigateTo(path: string, props?: any) {
    console.log("navigating to page:", path);

    this.$router.push({
      path,
      query: !props
        ? {}
        : {
            json: JSON.stringify(props)
          }
    });
  }

  isHeader(option: NavigationOption): option is { header: string } {
    return (<any>option).header !== undefined;
  }
}
