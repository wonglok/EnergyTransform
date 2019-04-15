<template>
  <div>
    <Slapper :uid="uid" :gameID="gameID" :mode="'me'"></Slapper>
    <Mover :uid="uid" :gameID="gameID" :mode="'me'"></Mover>
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

<style>

</style>
