<template>
  <div class="full">
    <GameEnsureOkay class="full" :gameUID="gameUID" @view="(v) => { view = v }" @clients="(v) => { clients = v }">
      <div slot="default" class="full">
        <div v-if="view === 'loading'">
          <h1>Loading...</h1>
        </div>
        <div v-if="view === 'lobby'">
          <WaitingPlayers :gameUID="gameUID" v-if="clients" :gameID="gameID" :clients="clients"></WaitingPlayers>
        </div>
        <div v-else-if="view === 'game'" class="full">
          <ProjectorGameVisual class="full" :uid="AuthState.user.uid" :gameID="gameID" :clients="clients"></ProjectorGameVisual>
        </div>
      </div>
      <div slot="e404">
        Game is not Found.
      </div>
      <div slot="loading">
        <h1>Connecting to Game Server...</h1>
      </div>
    </GameEnsureOkay>

  </div>
</template>

<script>
import { State, logout, loginAnonymous, waitHydration } from '../../auth.js'
import { FDB } from '../../firebase.js'
import Slapper from '../Compos/Slapper.vue'
import GameEnsureOkay from '../Compos/GameEnsureOkay.vue'
import WaitingPlayers from '../Compos/WaitingPlayers.vue'

export default {
  components: {
    Slapper,
    GameEnsureOkay,
    WaitingPlayers,
    ProjectorGameVisual: require('../GLCompos/ProjectorGameVisual.vue').default
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
