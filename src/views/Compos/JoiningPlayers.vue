<template>
  <div>
    <h1>Game Lobby @ Phone</h1>

    <div class="join-game" :class="{ taken: isSlotTaken(1) }">
      <div class="text-center-wrap" v-if="isSlotTaken(1) && alreadyJoinedOne()">
        You are Player 1.
      </div>
      <div class="text-center-wrap" v-else-if="isSlotTaken(1)">
        Player 1 is Taken.
      </div>
      <div class="text-center-wrap" v-else  @click="joinGame({ player: 1 })">
        Join as Player 1
      </div>
    </div>

    <div class="join-game" :class="{ taken: isSlotTaken(2) }">
      <div class="text-center-wrap" v-if="isSlotTaken(2) && alreadyJoinedOne()">
        You are Player 2.
      </div>
      <div class="text-center-wrap" v-else-if="isSlotTaken(2)">
        Player 2 is Taken.
      </div>
      <div class="text-center-wrap" v-else  @click="joinGame({ player: 2 })">
        Join as Player 2
      </div>
    </div>

    <qrcode :value="`${baseURL}/mobile/${gameID}`" :options="{ width: 250 }"></qrcode>
  </div>
</template>

<script>
import qrcode from '@chenfengyuan/vue-qrcode'
import { State, logout } from '../../auth.js'
import { FDB } from '../../firebase.js'

export default {
  components: {
    qrcode
  },
  props: {
    uid: {},
    gameID: {},
    clients: {}
  },
  data () {
    return {
      baseURL: window.location.origin
    }
  },
  mounted () {
    this.resetGame()
    this.init()
    let closeFn = () => {
      this.closeGame()
    }

    window.addEventListener('beforeunload', closeFn, false)
    this.clean = () => {
      window.removeEventListener('beforeunload', closeFn)
    }
  },
  methods: {
    isSlotTaken (slot) {
      let isTaken = false

      if (this.clients.map(c => c.player).includes(slot)) {
        isTaken = true
      }

      return isTaken
    },
    alreadyJoinedOne () {
      let uid = State.user.uid
      let isTaken = false

      if (this.clients.filter(c => c.player).map(c => c.uid).includes(uid)) {
        isTaken = true
      }

      return isTaken
    },
    closeGame () {
      FDB.ref(`/players/${this.gameID}/players/${State.user.uid}`).remove()
      if (State.user.isAnonymous) {
        FDB.ref(`/users/${State.user.uid}`).remove()
      }
    },
    resetGame () {
      FDB.ref(`/players/${this.gameID}/players/${State.user.uid}/player`).remove()
      FDB.ref(`/players/${this.gameID}/players/${State.user.uid}/position`).remove()
      FDB.ref(`/players/${this.gameID}/players/${State.user.uid}/slap`).remove()
    },
    joinGame ({ player }) {
      // want to play as player ID
      FDB.ref(`/players/${this.gameID}/players/${State.user.uid}/player`).set(player)
    },
    init () {
      FDB.ref(`/players/${this.gameID}/players/${State.user.uid}/uid`).set(State.user.uid)
      FDB.ref(`/players/${this.gameID}/players/${State.user.uid}/gameID`).set(this.gameID)
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
.join-game{
  display: inline-block;
  width: 200px;
  height: 200px;
  overflow: hidden;
  border: green solid 1px;
  background-color: rgba(156, 201, 156, 1);
  margin: 15px;
}
.join-game.taken{
  border-color: grey;
  background-color: #eee;
}
.text-center-wrap{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
