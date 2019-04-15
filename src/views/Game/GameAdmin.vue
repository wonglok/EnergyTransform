'<template>
  <div>
    <div v-if="!AuthState.hydrationComplete">
      <h1>
        Loading...
      </h1>
    </div>

    <div v-if="AuthState.hydrationComplete">
      <div>
        <h1>
          Game Host
        </h1>
      </div>
      <div v-if="!AuthState.user || AuthState.user.isAnonymous">
        <button @click="loginGoogle">Login Google</button>
      </div>

      <div v-if="AuthState.user && !AuthState.user.isAnonymous">
        <button @click="logout">Logout</button>
        <MakeGame></MakeGame>
        <GameList></GameList>
      </div>
    </div>
  </div>
</template>

<script>
import { State, loginGoogle, logout } from '../../auth.js'
import GameList from '../Compos/GameList.vue'
import MakeGame from '../Compos/GameMakeSession.vue'

export default {
  components: {
    GameList,
    MakeGame
  },
  data () {
    return {
      AuthState: State
    }
  },
  mounted () {
  },
  methods: {
    loginGoogle () {
      loginGoogle()
    },
    logout () {
      logout()
    }
  }
}
</script>

<style>

</style>
