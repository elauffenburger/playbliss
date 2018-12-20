<template>
  <div
    ref="wrapper"
    class="wrapper"
  >
    <div
      ref="content-wrapper"
      class="fixed"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script src="./sticky-frame.component.ts" lang="ts"></script>

<style lang="less">
.wrapper {
  flex: 1 1 100%;
  z-index: 1;
}

.fixed {
  position: fixed;
  width: 100%;
}
</style>
