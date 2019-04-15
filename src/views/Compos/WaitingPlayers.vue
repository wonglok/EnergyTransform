<template>
  <div>
    <h1>Game Lobby</h1>

    <div>
      <span v-if="isSlotTaken(1)">Player 1 is ready!</span>
      <span v-else>Waiting for Player 1</span>
    </div>
    <div>
      <span v-if="isSlotTaken(2)">Player 2 is ready!</span>
      <span v-else>Waiting for Player 2</span>
    </div>

    <qrcode :value="`${baseURL}/games/${gameID}`" :options="{ width: 200 }"></qrcode>
  </div>
</template>

<script>
import qrcode from '@chenfengyuan/vue-qrcode'
import { State } from '../../auth.js'

export default {
  components: {
    qrcode
  },
  props: {
    gameID: {},
    clients: {}
  },
  data () {
    return {
      baseURL: window.location.origin
    }
  },
  mounted () {
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
    }
  }
}
</script>

<style>

</style>
