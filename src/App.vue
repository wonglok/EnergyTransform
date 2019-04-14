<template>
  <div id="app" class="full">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view class="full" />
    <router-link tag="div" to="/" style="cursor: pointer; display: block; position: fixed; top: 20px; right: 20px; color: white; text-shadow: 0px 0px 4px black;">Home</router-link>
  </div>
</template>

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
</style>
