<template>
  <div>
    Phone Contoller
    <button v-if="!AuthState.user" @click="login">Start Game</button>
    <div v-if="AuthState.user">
      <button v-if="AuthState.user" @click="logout">Logout</button>

    </div>
  </div>
</template>

<script>
import { State, logout, loginAnonymous } from '../../auth.js'
import { FDB } from '../../firebase.js'

export default {
  data () {
    return {
      AuthState: State
    }
  },
  computed: {
    gameID () {
      return this.$route.params.gameID
    }
  },
  mounted () {
    this.findGame()
  },
  methods: {
    login () {
      loginAnonymous()
    },
    logout () {
      logout()
    },
    findGame () {
      // FDB.ref('/players/')
    }
  }
}
</script>

<style>

</style>
