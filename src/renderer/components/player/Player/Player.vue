<template>
  <v-container class="player grey lighten-2">

    <v-layout class="spotify-container">
      <v-flex xs12>
        <SpotifyPlayer />
      </v-flex>
    </v-layout>

    <v-layout class="youtube-container">
      <v-flex xs12>
        <YouTubePlayer />
      </v-flex>
    </v-layout>

    <v-layout>
      <v-progress-linear v-model="progressPercentage"></v-progress-linear>
    </v-layout>

    <v-layout class="play-status">
      <v-flex xs12>
        <div v-if="isPlayingTrack">
          <span>Now Playing: {{track.track.name}}</span>
        </div>
        <div v-else>
          <span>Paused</span>
        </div>
      </v-flex>
    </v-layout>

    <v-layout class="controls-container">
      <v-flex xs4 />

      <v-flex
        xs3
        class="controls"
      >
        <v-icon @click="onClickPrevious()">skip_previous</v-icon>
        <v-icon
          class="play-pause"
          @click="onTogglePlayPause()"
        >{{isPlayingTrack ? "pause_circle_filled" : "play_circle_filled"}}</v-icon>
        <v-icon @click="onClickNext()">skip_next</v-icon>
      </v-flex>

      <v-flex xs4 />
    </v-layout>

  </v-container>
</template>

<script src="./player.component.ts" lang="ts"></script>

<style lang="less">
.player {
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
  max-width: unset;
  width: 100%;
  margin: 0;

  .youtube-container {
    @height: 50px;
    max-height: @height;

    iframe {
      max-height: @height;
    }
  }

  .play-status {
    text-align: center;
  }

  .controls-container {
    justify-content: space-between;

    .flex {
      display: flex;
    }

    .controls {
      justify-content: center;

      .play-pause {
        font-size: 40pt;
      }
    }
  }
}
</style>
