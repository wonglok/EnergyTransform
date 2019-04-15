<template>
  <div>

  </div>
</template>

<script>
import { FDB, toArr } from '../../firebase.js'

export default {
  mounted () {
    FDB.ref('games').orderByChild('ntimestamp').on('value', (snapshot) => {
      let games = toArr(snapshot.val()).reverse()
      let latestGame = games[0]
      if (latestGame) {
        this.$router.push(`/projector/${latestGame._id}`)
      } else {
        this.$router.push('/game-admin')
      }
      this.$forceUpdate()
    })
  }
}
</script>

<style>

</style>
