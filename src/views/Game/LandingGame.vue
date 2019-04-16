<template>
  <div>
    <span v-if="!isMobile">
      Welcome!
      <div v-if="!ready">
        Loading...
      </div>
      <div v-if="ready">
        <div class="cta-gogo" @click="startGame">
          <div class="center">
            Start Game
          </div>
        </div>
      </div>
    </span>
    <div v-if="isMobile">
      <div class="cta-gogo" v-if="!openScanner" @click="openScanner =  true">
        <div class="center">
          Scan QR Code
        </div>
      </div>
      <QRCam v-if="openScanner"></QRCam>
    </div>
  </div>
</template>

<script>
import { State, waitHydration, loginAnonymous } from '../../auth.js'
import { FDB, toArr } from '../../firebase.js'
import qrcode from '@chenfengyuan/vue-qrcode'
import QRCam from '../Compos/QRCam.vue'
import screenfull from 'screenfull'

function detectmob () {
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    return true;
  }
 else {
    return false;
  }
}

export default {
  components: {
    qrcode,
    QRCam
  },
  mounted () {
    waitHydration().then(() => {
      if (!State.user) {
        loginAnonymous().then(() => {
          return this.init()
        })
      } else {
        return this.init()
      }
    })
  },
  data () {
    return {
      openScanner: false,
      isMobile: detectmob() || window.innerWidth < 500,
      games: [],
      AuthState: State,
      baseURL: window.location.origin,
      gameKey: false,
      ready: false,
    }
  },
  methods: {
    init () {
      this.ready = true
      // this.reloadGames()
      // if (!this.isMobile) {
      //   this.startGame()
      // }
    },
    reloadGames () {
      FDB.ref(`/user-games/${State.user.uid}`).orderByChild('ntimestamp').on('value', (snap) => {
        let val = snap.val()
        if (val) {
          let games = toArr(val)
          this.games = games
          this.$forceUpdate()
          // let firstGame = games[0]
          // if (firstGame) {
          //   // FDB.ref(`/players/${firstGame._id}/players/${State.user.uid}/player`).set(1)
          //   this.$router.push(`/projector/${State.user.uid}/${firstGame._id}`)
          // } else {
          //   this.startGame()
          // }
        }
      })
    },

    startGame () {
      if (screenfull.enabled) {
          screenfull.request();
      }
      var newGame = {}
      FDB.ref(`/user-games/${State.user.uid}`).remove()
      let newKey = FDB.ref(`/user-games/${State.user.uid}/`).push().key
      newGame._id = newKey
      newGame.date = (new Date()).toString()
      newGame.ntimestamp = -(new Date()).getTime()
      newGame.timestamp = (new Date()).getTime()
      newGame.status = 'ready'

      console.log(newKey)
      this.gameKey = newKey
      FDB.ref(`/user-games/${State.user.uid}/${newKey}`).set(newGame)

      this.$router.push(`/projector/${State.user.uid}/${newKey}`)
    }
  }
}
</script>

<style scoped>
.cta-gogo{
  width: 250px;
  height: 250px;
  background-color: #87c997;
  border: lime solid 1px;
}
.center{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
