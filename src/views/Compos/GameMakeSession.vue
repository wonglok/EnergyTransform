<template>
  <div>
    <h1>
      Make Game
    </h1>
    <div>
      <button @click="makeGame">makeGame</button>
    </div>
  </div>
</template>

<script>
import { FDB } from '../../firebase.js'
export default {
  data () {
    return {
      template: {
        status: 'ready'
      },
      newGame: {
        status: 'ready'
      }
    }
  },
  mounted () {
    this.reset()
  },
  methods: {
    reset () {
      this.newGame = JSON.parse(JSON.stringify(this.template))
    },
    makeGame () {
      var newGame = JSON.parse(JSON.stringify(this.newGame))
      let newGameKey = FDB.ref('games').push().key
      newGame._id = newGameKey
      newGame.date = (new Date()).toString()
      newGame.ntimestamp = -(new Date()).getTime()
      newGame.timestamp = (new Date()).getTime()
      newGame.status = 'ready'

      console.log(newGameKey)
      FDB.ref(`games/${newGameKey}`).set(newGame).then(() => {
        this.reset()
      })
    }
  }
}
</script>

<style>

</style>
