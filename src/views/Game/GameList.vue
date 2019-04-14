<template>
  <div>
    <div>
      Game List
    </div>
    <MakeGame></MakeGame>
    <ul>
      <li :key="ga._id" v-for="ga in games">
        <div>Game Status: {{ ga.status }}</div>
        <div>Created: {{ timeFromNow(ga.date) }}</div>
        <div><button @click="showQR(ga, games)">Show QR Code</button></div>
        <div v-if="ga.showQR">
          <qrcode :value="`${baseURL}/games/${ga._id}`" :options="{ width: 200 }"></qrcode>
        </div>
        <button @click="remove(ga)">Remove Game</button>
        <button @click="remove(ga)">Remove Game</button>
      </li>
    </ul>
  </div>
</template>

<script>
import MakeGame from './MakeGame.vue'
import { FDB, toArr } from '../../firebase.js'
import moment from 'moment'
import Vue from 'vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'
Vue.use(VueQrcode.name, VueQrcode)
export default {
  components: {
    MakeGame,
    qrcode: VueQrcode
  },
  data () {
    return {
      baseURL: window.location.origin,
      games: [],
      counterReference: false
    }
  },
  beforeDestroy () {
    if (this.counterReference) {
      this.counterReference.off()
    }
  },
  mounted () {
    this.counterReference = FDB.ref('games').orderByChild('ntimestamp');
    this.counterReference.on('value', (snapshot) => {
      this.games = toArr(snapshot.val()).reverse()
      this.$forceUpdate()
    })
  },
  methods: {
    showQR (ga, games) {
      games.forEach(ga => {
        ga.showQR = false
      })
      ga.showQR = true
      this.$forceUpdate()
    },
    timeFromNow (dateNum) {
      let date = Date.parse(dateNum)
      return moment(date).fromNow()
    },
    remove (ga) {
      FDB.ref(`/games/${ga._id}`).remove()
    }
  }
}
</script>

<style>

</style>
