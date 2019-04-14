<template>
  <div>
    Phone Contoller
    <div v-if="gameNotFound">
      Game ID Not Gound....
    </div>
    <div v-else-if="AuthState.user && ready">

      <h1>Welcome!</h1>

      <div v-if="connectedClients.length > 0">
        <button :disabled="alreadyJoinedOne() || isSlotTaken(1)" @click="joinGame({ player: 1 })">Join as Player 1</button>
        <button :disabled="alreadyJoinedOne() || isSlotTaken(2)" @click="joinGame({ player: 2 })">Join as Player 2</button>
        <button v-if="alreadyJoinedOne()" @click="leaveGame">Leave</button>
      </div>

      <h2>
        Debug
      </h2>

      <pre>{{ connectedClients }}</pre>
    </div>
  </div>
</template>

<script>
import { State, logout, loginAnonymous, waitHydration } from '../../auth.js'
import { FDB } from '../../firebase.js'
import Slapper from './Slapper.vue'

export default {
  components: {
    Slapper
  },
  data () {
    return {
      gameNotFound: false,
      ready: false,
      connectedClients: [],
      AuthState: State
    }
  },
  computed: {
    gameID () {
      return this.$route.params.gameID
    },
    numberOfPeopleJoined () {
      return this.connectedClients.filter(c => c.player).length
    }
  },
  watch: {
    numberOfPeopleJoined () {
      if (this.numberOfPeopleJoined === 2) {
        this.$router.push(`/games/${this.gameID}/play`)
      }
    }
  },
  mounted () {
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
  methods: {
    isSlotTaken (slot) {
      let isTaken = false

      if (this.connectedClients.map(c => c.player).includes(slot)) {
        isTaken = true
      }

      return isTaken
    },
    alreadyJoinedOne () {
      let uid = this.AuthState.user.uid
      let isTaken = false

      if (this.connectedClients.filter(c => c.player).map(c => c.uid).includes(uid)) {
        isTaken = true
      }

      return isTaken
    },
    init () {
      FDB.ref(`/players/${this.gameID}/${State.user.uid}/uid`).set(State.user.uid)
      FDB.ref(`/players/${this.gameID}/${State.user.uid}/gameID`).set(this.gameID)
      this.findAllPlayers()
    },
    leaveGame () {
      if (this.ready) {
        // want to play as player ID
        FDB.ref(`/players/${this.gameID}/${State.user.uid}/player`).remove()
      }
    },
    joinGame ({ player }) {
      if (this.ready) {
        // want to play as player ID
        FDB.ref(`/players/${this.gameID}/${State.user.uid}/player`).set(player)
      }
    },
    logout () {
      logout()
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

<style scoped>
.press-me{
  width: 300px;
  height: 300px;
  display: block;
}
</style>
