<template>
  <div>
    <GameEnsureOkay :gameUID="gameUID" @view="(v) => { view = v }" @clients="(v) => { clients = v }">
      <div slot="default">
        <div v-if="view === 'loading'">
          <h1>Loading...</h1>
        </div>
        <div v-if="view === 'lobby'">
          <JoiningPlayers @view="(v) => { v = view }" v-if="clients" :uid="AuthState.user.uid" :gameID="gameID" :clients="clients"></JoiningPlayers>
        </div>
        <div v-if="view === 'full'">
          <h1>Game Room is full.</h1>
        </div>
        <div v-else-if="view === 'game' && clients.some(e => e.isMe)">
          <h1>Mobile Game</h1>

          <MobileGamePad :uid="AuthState.user.uid" :gameID="gameID"></MobileGamePad>
        </div>
        <div v-else-if="view === 'game' && !clients.some(e => e.isMe)">
          <h1>Room is full</h1>
        </div>
      </div>
      <div slot="e404">
        Game is not Found.
      </div>
    </GameEnsureOkay>

  </div>
</template>

<script>
import { State, logout, loginAnonymous, waitHydration } from '../../auth.js'
import { FDB } from '../../firebase.js'
import Slapper from '../Compos/Slapper.vue'
import GameEnsureOkay from '../Compos/GameEnsureOkay.vue'
import JoiningPlayers from '../Compos/JoiningPlayers.vue'

export default {
  components: {
    Slapper,
    GameEnsureOkay,
    JoiningPlayers,
    MobileGamePad: require('../Compos/MobileGamePad.vue').default
  },
  data () {
    return {
      view: 'loading',
      gameNotFound: false,
      ready: false,
      clients: [],
      AuthState: State
    }
  },
  computed: {
    gameID () {
      return this.$route.params.gameID
    },
    gameUID () {
      return this.$route.params.uid
    }
  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style scoped>
.press-me{
  width: 300px;
  height: 300px;
  display: block;
}
</style>
