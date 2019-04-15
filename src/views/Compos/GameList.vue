<template>
  <div>
    <div>
      <h1>
        Game List
      </h1>
    </div>
    <ul>
      <li :key="ga._id" v-for="ga in games">
        <div>Game Status: {{ ga.status }}</div>
        <div>Created: {{ timeFromNow(ga.date) }}</div>
        <div><button @click="showQR(ga, games)">Show QR Code</button></div>
        <div v-if="ga.showQR">
          <qrcode :value="`${baseURL}/mobile/${ga._id}`" :options="{ width: 200 }"></qrcode>
        </div>
        <div>
          <ol>
            <li>
              <router-link :to="`/mobile/${ga._id}`">Mobile</router-link>
            </li>
            <li>
              <router-link :to="`/projector/${ga._id}`">Projector</router-link>
            </li>
          </ol>
        </div>
        <button @click="remove(ga)">Remove Game</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { FDB, toArr } from '../../firebase.js'
import moment from 'moment'
import Vue from 'vue'
import qrcode from '@chenfengyuan/vue-qrcode'
export default {
  components: {
    qrcode
  },
  data () {
    return {
      baseURL: window.location.origin,
      games: []
    }
  },
  beforeDestroy () {
  },
  mounted () {
    FDB.ref('games').orderByChild('ntimestamp').on('value', (snapshot) => {
      this.games = toArr(snapshot.val()).reverse()
      let latestGame = this.games[0]
      if (latestGame) {
        this.showQR(latestGame, this.games)
      }
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
    timeFromNow (date) {
      let dd = Date.parse(date)
      return moment(dd).fromNow()
    },
    remove (ga) {
      if (window.confirm(`remove game? \n This is created ${this.timeFromNow(ga.date)}`)) {
        FDB.ref(`/games/${ga._id}`).remove()
        FDB.ref(`/players/${ga._id}/`).remove()
      }
    }
  }
}
</script>

<style>

</style>
