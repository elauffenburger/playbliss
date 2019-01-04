<template>
  <v-navigation-drawer
    v-model="drawerOpen"
    absolute
    temporary
    right
  >
    <v-list expand>
      <v-list-tile>
        <v-list-tile-title>
          <h2 class="font-weight-thin">Config</h2>
        </v-list-tile-title>
      </v-list-tile>

      <v-list-group value="true">
        <v-list-tile slot="activator">
          <v-list-tile-content>
            <v-list-tile-title>General</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list class="pa-1">
          <v-list-tile @click="config.general.primaryMusicSourceDialogOpen = true">
            <v-list-tile-action>
              <v-icon>library_music</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Primary Music Source{{ primaryMusicSource ? ` (${stringifyMusicSource(primaryMusicSource)})`: `` }}</v-list-tile-title>

              <v-dialog
                width="300"
                v-model="config.general.primaryMusicSourceDialogOpen"
              >
                <v-card>
                  <v-card-title>Select Primary Music Source:</v-card-title>
                  <v-card-text>
                    <div>
                      <v-select
                        :value="primaryMusicSource"
                        :items="config.general.musicSources"
                        @change="setPendingPrimaryMusicSource($event)"
                      ></v-select>
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      flat
                      @click="onChangePrimaryMusicSource(config.general.pendingPrimaryMusicSource)"
                    >Ok</v-btn>
                    <v-btn
                      flat
                      @click="onClickClosePrimaryMusicSourceDialog()"
                    >Cancel</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click="cleanup()">
            <v-list-tile-action>
              <v-icon>delete_sweep</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>Clean Up</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-list-group>

      <!-- Spotify -->
      <v-list-group value="true">
        <v-list-tile slot="activator">
          <v-list-tile-content>
            <v-list-tile-title>Spotify</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list class="pa-1">
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>Status: <span :class="{ 'spotify-status' : true, 'healthy': spotifyStatusHealthy, 'unhealthy': !spotifyStatusHealthy }"></span></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <template v-for="(action, i) in config.spotify.actions">
            <v-list-tile
              v-if="!action.loggedInOnly || loggedIntoSpotify"
              @click="action.action()"
              :key="i"
            >
              <v-list-tile-action>
                <v-icon>{{action.icon}}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{action.text}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-list-group>

      <!-- YouTube -->
      <v-list-group value="true">
        <v-list-tile slot="activator">
          <v-list-tile-title>YouTube</v-list-tile-title>
        </v-list-tile>
      </v-list-group>

    </v-list>
  </v-navigation-drawer>
</template>

<script src="./config-drawer.component.ts" lang="ts"></script>

<style lang="less">
.spotify-status {
  &.healthy {
    color: green;

    &::after {
      content: "Healthy";
    }
  }

  &.unhealthy {
    color: red;

    &::after {
      content: "Unhealthy";
    }
  }
}
</style>