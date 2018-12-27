import Vue from "vue";
import Component from "vue-class-component";
import { ROUTES } from "../../../router";

type NavigationOption = { title: string; icon?: string; action: () => void } | { header: string } | { divider: boolean };

const PLAYLISTS_HEADER = "Playlists";

@Component({ name: "Navigation" })
export default class Navigation extends Vue {
  navigation: NavigationOption[] = [
    {
      title: "Home",
      icon: "home",
      action: () => this.navigateTo(ROUTES.HOME)
    },
    {
      title: "All Playlists",
      icon: "",
      action: () => this.navigateTo(ROUTES.ALL_PLAYLISTS)
    },
    { header: PLAYLISTS_HEADER }
  ];

  mounted() {
    this.insertPlaylistsIntoNavigation();
  }

  insertPlaylistsIntoNavigation() {
    const playlistsMarkerIndex = this.navigation.findIndex(n => this.isHeader(n) && n.header == PLAYLISTS_HEADER);
    if (!playlistsMarkerIndex) {
      return;
    }

    const playlists: NavigationOption[] = this.$services.playlists.getPlaylists().map(p => {
      return {
        title: p.name,
        action: () =>
          this.navigateTo(ROUTES.VIEW_PLAYLIST, {
            playlistId: p.id
          })
      };
    });

    this.navigation.splice(playlistsMarkerIndex + 1, 0, ...playlists);
  }

  navigateTo(path: string, props?: any) {
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
