<template>
  <div class="flex-container">
    <div class="flexer">
      <Mover :uid="uid" :gameID="gameID" :mode="'me'"></Mover>
      <Slapper :uid="uid" :gameID="gameID" :mode="'me'"></Slapper>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    uid: {},
    gameID: {}
  },
  components: {
    Slapper: require('../Compos/Slapper.vue').default,
    Mover: require('../Compos/Mover.vue').default
  }
}
</script>

<style scoped>
.flexer{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  height: 100%;
  flex-direction: column;
}
.flex-container{
  height: 100%;
}
</style>
