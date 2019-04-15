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

    <div v-if="gameID && gameUID && baseURL">
      <qrcode :value="`${baseURL}/mobile/${gameUID}/${gameID}`" :options="{ width: 400 }"></qrcode>
      <div>
        <ol>
          <li>
            <router-link :to="`/mobile/${gameUID}/${gameID}`">Mobile</router-link>
          </li>
          <!-- <li>
            <router-link :to="`/projector/${gameUID}/${gameID}`">Projector</router-link>
          </li> -->
        </ol>
      </div>
    </div>
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
    gameUID: {},
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
