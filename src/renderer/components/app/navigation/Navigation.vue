<template>
  <v-navigation-drawer
    class="navigation-drawer"
    permanent
  >
    <v-list expand>
      <template v-for="(item, index) in navigation">
        <v-list-tile
          v-if="item.title"
          :key="index"
          @click="item.action"
        >
          <v-list-tile-action v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider
          v-else-if="item.divider"
          :key="index"
        ></v-divider>
        <v-subheader
          v-else-if="item.header"
          :key="item.header"
        >{{ item.header }}</v-subheader>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" src="./navigation.component.ts"></script>

<style lang="less">
</style>