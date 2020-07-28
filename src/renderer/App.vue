<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'SimpleRedis'
  }
</script>

<style>
  html, body, #app {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        font-family: "Bitstream Vera Sans Mono", Monaco, "Courier New", Courier, monospace;
    }
</style>
