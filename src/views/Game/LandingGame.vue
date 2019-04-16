<template>
  <div>
    Welcome!
    <span v-if="!ready">
      Loading...
    </span>
    <!-- <div  v-if="ready">
      <button @click="startGame">Start New Game</button>
    </div> -->
    <!-- <ul>
      <li :key="ga._id" v-for="ga in games">
        <router-link :to="`/projector/${AuthState.user.uid}/${ga._id}`">Eneter</router-link>
        <button @click="removeGame(AuthState.user.uid, ga._id)">Remove Game</button>
      </li>
    </ul> -->
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
      games: [],
      AuthState: State,
      baseURL: window.location.origin,
      gameKey: false,
      ready: false,
    }
  },
  methods: {
    init () {
      this.ready = true
      // this.reloadGames()
      this.startGame()
    },
    removeGame (uid, gameID) {

    },
    reloadGames () {
      FDB.ref(`/user-games/${State.user.uid}`).orderByChild('ntimestamp').on('value', (snap) => {
        let val = snap.val()
        if (val) {
          let games = toArr(val)
          this.games = games
          this.$forceUpdate()
          // let firstGame = games[0]
          // if (firstGame) {
          //   // FDB.ref(`/players/${firstGame._id}/players/${State.user.uid}/player`).set(1)
          //   this.$router.push(`/projector/${State.user.uid}/${firstGame._id}`)
          // } else {
          //   this.startGame()
          // }
        }
      })
    },

    startGame () {
      var newGame = {}
      FDB.ref(`/user-games/${State.user.uid}`).remove()
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
