<template>
  <div>
    <div v-if="!AuthState.hydrationComplete">
      <h1>
        Loading...
      </h1>
    </div>

    <div v-if="AuthState.hydrationComplete">
      GAME HOST
      <div v-if="!AuthState.user">
        <button @click="loginGoogle">Login Google</button>


      </div>
      <div v-if="AuthState.user">
        <button @click="logout">Logout</button>

        <GameList></GameList>

      </div>

    </div>
  </div>
</template>

<script>
import { State, loginGoogle, logout } from '../../auth.js'
import GameList from './GameList.vue'
export default {
  components: {
    GameList
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
