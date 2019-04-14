<template>
  <div>
    Play

    <div v-if="gameNotFound">
      Game ID Not Found
    </div>
    <div v-else-if="AuthState.user && ready">
      <Slapper v-if="AuthState.user.uid && gameID" :uid="AuthState.user.uid" :gameID="gameID" :mode="'me'"></Slapper>
    </div>

    <div :key="op.uid" v-for="op in otherPlayers">
      <Slapper :uid="op.uid" :gameID="op.gameID" :mode="'viewonly'"></Slapper>
    </div>
    <!--
     -->
  </div>
</template>

<script>
import { State, waitHydration } from '../../auth.js'
import { FDB } from '../../firebase.js'
import Slapper from './Slapper.vue'
export default {
  components: {
    Slapper
  },
  data () {
    return {
      ready: false,
      gameNotFound: false,
      AuthState: State,
      connectedClients: []
    }
  },
  mounted () {
    this.ensureReady()
  },
  computed: {
    otherPlayers () {
      if (!State.user) {
        return []
      }
      return this.connectedClients.filter(c => c.player).filter(c => c.uid !== State.user.uid)
    },
    gameID () {
      return this.$route.params.gameID
    }
  },
  methods: {
    init () {
      this.findAllPlayers()
    },
    ensureReady () {
      waitHydration().then(() => {
        if (!State.user) {
          loginAnonymous().then(() => {
            return this.findGame()
          }).then(() => {
            this.ready = true
            this.init()
          }, () => {
            this.gameNotFound = true
          })
        } else {
          this.findGame()
            .then(() => {
              this.ready = true
              this.init()
            }, () => {
              this.gameNotFound = true
            })
        }
      })
    },
    findAllPlayers () {
      FDB.ref(`/players/${this.gameID}`).on('value', (snap) => {
        let val = snap.val()
        if (val) {
          let playerUIDs = Object.keys(val)
          this.playerUIDs = playerUIDs
          this.connectedClients = playerUIDs.map((keyname) => {
            let item = val[keyname]
            item._id = keyname
            return item
          })
        } else {
          this.connectedClients = []
          this.playerUIDs = []
        }
      })
    },
    findGame () {
      return new Promise((resolve, reject) => {
        FDB.ref(`/games/${this.gameID}`).once('value', (snap) => {
          console.log()
          let ans = snap.val()
          if (ans && ans._id) {
            resolve()
          } else {
            reject(new Error('not found'))
          }
        })
      })
    }
  }
}
</script>

<style>

</style>
