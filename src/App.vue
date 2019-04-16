<template>
  <div id="app" class="full">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view class="full" />
    <router-link tag="div" to="/" class="ya-home">Home</router-link>
    <router-link tag="div" to="/routes" class="ya-routes">Routes</router-link>
    <div  class="ya-fullscreen" @click="goFullscreen">FullScreen</div>
  </div>
</template>
<script>
import screenfull from 'screenfull'
export default {
  methods: {
    goFullscreen () {
      if (screenfull.enabled) {
        screenfull.request();
      }
    }
  }
}
</script>

<style>
html, body{
  margin: 0px;
}
.full{
  width: 100%;
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.ya-routes{
  cursor: pointer;
  display: block;
  position: fixed;
  top: 50px;
  right: 20px;
  color: white;
  text-shadow: 0px 0px 4px black;
}
.ya-home{
  cursor: pointer;
  display: block;
  position: fixed;
  right: 20px;
  top: 20px;
  color: white;
  text-shadow: 0px 0px 4px black;
}

.ya-fullscreen{
  cursor: pointer;
  display: block;
  position: fixed;
  right: 20px;
  top: 80px;
  color: white;
  text-shadow: 0px 0px 4px black;
}
</style>
