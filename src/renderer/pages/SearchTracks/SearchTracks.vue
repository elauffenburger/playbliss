<template>
  <v-container>
    <v-layout>
      <v-flex xs3>
        <v-select
          v-model="source"
          label="Source"
          :items="sources"
        >
        </v-select>
      </v-flex>

      <v-flex xs3>
        <v-select
          v-model="entryMethod"
          label="Entry Method"
          :items="source.entryMethods"
        >
        </v-select>
      </v-flex>

      <v-flex
        v-if="entryMethod == 'search'"
        xs6
      >
        <v-text-field
          label="Search"
          :value="trackSearch"
          @input="onSearchChange($event)"
        />
      </v-flex>

      <v-flex
        v-if="entryMethod == 'manual'"
        xs6
      >
        <v-text-field
          label="Enter Song URL"
          v-model="manualEntry"
        ></v-text-field>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex xs12>
        <TracksTable :tracks="tracks">
          <template slot="no-data">
            <tr>
              <td
                colspan="4"
                class="text-xs-center"
              >Search for some songs to get started!</td>
            </tr>
          </template>
        </TracksTable>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script src="./search-tracks.component.ts" lang="ts"></script>

<style lang="less">
.search-container {
  & > * {
    @margin: 1.5%;

    &:not(:first-child) {
      margin-left: @margin;
    }

    &:not(:last-child) {
      margin-right: @margin;
    }
  }
}
</style>