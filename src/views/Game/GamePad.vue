<template>
  <div>
    Phone Contoller
  </div>
</template>

<script>
export default {
  computed: {
    gameID () {
      return this.$route.params.gameID
    }
  },
  mounted () {
    this.findGame()
  },
  methods: {
    findGame () {

    }
  }
}
</script>

<style>

</style>
