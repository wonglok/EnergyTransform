<template>
  <div>
    Phone Contoller
    <div v-if="AuthState.user">
      OMG
    </div>
  </div>
</template>

<script>
import { State, logout, loginAnonymous, waitHydration } from '../../auth.js'
import { FDB } from '../../firebase.js'

export default {
  data () {
    return {
      ready: false,
      AuthState: State
    }
  },
  computed: {
    gameID () {
      return this.$route.params.gameID
    }
  },
  mounted () {
    waitHydration().then(() => {
      if (!State.user) {
        loginAnonymous().then(() => {
          this.ready = true
        })
      } else {
        this.ready = true
      }
    })
  },
  methods: {
    login () {

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
