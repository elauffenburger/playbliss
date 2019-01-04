<template>
  <v-dialog v-model="open" max-width="370px">
    <v-card>
      <v-card-title>Add Track to Playlist</v-card-title>

      <v-card-text>
        <v-layout>
          <v-flex xs12>Select Playlist to add {{track.name}} to:</v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs12>
            <v-select
              label="Playlist"
              :items="playlists"
              v-model="playlist"
            />
          </v-flex>
        </v-layout>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn flat @click="onClickCancel()">Cancel</v-btn>
        <v-btn flat @click="onClickOk()">Ok</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" src="./add-to-playlist-dialog.component.ts"></script>