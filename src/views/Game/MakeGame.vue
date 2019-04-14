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
    // getPlayer ({ pid }) {
    //   return {
    //     pid,
    //     position: {
    //       x: 0,
    //       y: 0,
    //       z: 0
    //     },
    //     slapCount: 0,
    //     stones: []
    //   }
    // },
    reset () {
      this.newGame = JSON.parse(JSON.stringify(this.template))
    },
    makeGame () {
      var newGame = this.newGame
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
/*

var ref = firebase.database().ref('node/clicks');
ref.transaction(function(currentClicks) {
  // If node/clicks has never been set, currentRank will be `null`.
  var newValue = (currentClicks || 0) + 1;
  if (newValue > 20) {
    return; // abort the transaction
  }
  return newValue;
});

*/
</script>

<style>

</style>
