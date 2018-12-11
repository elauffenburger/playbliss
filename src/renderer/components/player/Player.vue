<template>
  <v-container class="container">
    <v-layout>
      <v-flex xs12>
        <div v-if="isPlayingTrack">
          <span>Now Playing: {{track.name}}</span>
        </div>
        <div v-else>
          <span>Paused</span>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Store } from "vuex";
import Component from "vue-class-component";
import { AppState } from "../../store";
import { Track } from "@/renderer/models";
import { setInterval } from 'timers';

@Component({ name: "Player" })
export default class Player extends Vue {
  get track(): Track | null {
    return this.store.state.player.track;
  }

  get isPlayingTrack() {
    const track = this.track;

    return this.store.getters["player/isPlayingTrack"](track);
  }

  get store(): Store<AppState> {
    return this.$store;
  }
}
</script>

<style>
</style>
