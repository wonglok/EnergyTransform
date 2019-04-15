<template>
  <div>
    <div v-if="ready">

      <button v-if="!gameKey" @click="startGame">
        Start Game
      </button>

    </div>
  </div>
</template>

<script>
import { State, waitHydration, loginAnonymous } from '../../auth.js'
import { FDB } from '../../firebase.js'
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
    },
    startGame () {
      var newGame = {}
      let newGameKey = FDB.ref(`/user-games/${State.user.uid}/`).push().key
      newGame._id = newGameKey
      newGame.date = (new Date()).toString()
      newGame.ntimestamp = -(new Date()).getTime()
      newGame.timestamp = (new Date()).getTime()
      newGame.status = 'ready'

      console.log(newGameKey)
      this.gameKey = newGameKey
      FDB.ref(`/user-games/${State.user.uid}/${newGameKey}`).set(newGame)
      this.$router.push(`/projector/${State.user.uid}/${newGameKey}`)
    }
  }
}
</script>

<style>

</style>
