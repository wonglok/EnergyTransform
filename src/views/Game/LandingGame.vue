<template>
  <div>
    Welcome!
    <span v-if="!ready">
      Loading...
    </span>
    <div  v-if="ready">
      <button @click="startGame">Start New Game</button>
    </div>
  </div>
</template>

<script>
import { State, waitHydration, loginAnonymous } from '../../auth.js'
import { FDB, toArr } from '../../firebase.js'
import qrcode from '@chenfengyuan/vue-qrcode'

export default {
  components: {
    qrcode
  },
  mounted () {
    waitHydration().then(() => {
      if (!State.user) {
        loginAnonymous().then(() => {
          return this.init()
        })
      } else {
        return this.init()
      }
    })
  },
  data () {
    return {
      AuthState: State,
      baseURL: window.location.origin,
      gameKey: false,
      ready: false,
    }
  },
  methods: {
    init () {
      this.ready = true
      // this.findFirstGame()
    },
    findFirstGame () {
      FDB.ref(`/user-games/${State.user.uid}`).orderByChild('ntimestamp').once('value', (snap) => {
        let val = snap.val()
        if (val) {
          let games = toArr(val)
          let firstGame = games[0]
          if (firstGame) {
            // FDB.ref(`/players/${firstGame._id}/players/${State.user.uid}/player`).set(1)
            this.$router.push(`/projector/${State.user.uid}/${firstGame._id}`)
          } else {
            this.startGame()
          }
        } else {
          this.startGame()
        }
      })
    },
    startGame () {
      var newGame = {}
      let newKey = FDB.ref(`/user-games/${State.user.uid}/`).push().key
      newGame._id = newKey
      newGame.date = (new Date()).toString()
      newGame.ntimestamp = -(new Date()).getTime()
      newGame.timestamp = (new Date()).getTime()
      newGame.status = 'ready'

      console.log(newKey)
      this.gameKey = newKey
      FDB.ref(`/user-games/${State.user.uid}/${newKey}`).set(newGame)
      // FDB.ref(`/players/${newKey}/players/${State.user.uid}/player`).set(1)
      this.$router.push(`/projector/${State.user.uid}/${newKey}`)
    }
  }
}
</script>

<style>

</style>
