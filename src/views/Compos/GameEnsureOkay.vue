<template>
  <div>
    <slot v-if="isOkay"></slot>
    <div v-if="!isOkay">
      <slot name="loading"></slot>
      <slot name="e404" v-if="gameNotFound">GameID Not Found</slot>
    </div>
  </div>
</template>

<script>
import { State, logout, loginAnonymous, waitHydration } from '../../auth.js'
import { FDB } from '../../firebase.js'
import Slapper from './Slapper.vue'
import qrcode from '@chenfengyuan/vue-qrcode'

export default {
  components: {
    Slapper,
    qrcode
  },
  props: {
    gameUID: {}
  },
  data () {
    return {
      playerCount: 2,
      isOkay: false,
      // baseURL: window.location.origin,
      gameNotFound: false,
      ready: false,
      clients: [],
      AuthState: State
    }
  },
  computed: {
    gameID () {
      return this.$route.params.gameID
    }//,
    // numberOfPeopleJoined () {
    //   return this.clients.filter(c => c.player).length
    // }
  },
  watch: {
    // numberOfPeopleJoined () {
    //   if (this.numberOfPeopleJoined === this.playerCount) {
    //     this.$emit('view', 'game')
    //   }
    // },
    clients () {
      this.$emit('clients', this.clients)
    }
  },
  mounted () {
    waitHydration().then(() => {
      if (!State.user) {
        loginAnonymous().then(() => {
          return this.findGame()
        }).then(() => {
          this.isOkay = true
          this.$emit('okay')
        }, () => {
          this.gameNotFound = true
          this.isOkay = false
          this.$emit('e404')
          this.$router.push('/')
        })
      } else {
        this.findGame()
          .then(() => {
            this.isOkay = true
            this.$emit('okay')
          }, () => {
            this.gameNotFound = true
            this.isOkay = false
            this.$emit('e404')
            this.$router.push('/')
          })
      }
    })

    let closeFn = () => {
      // this.closeGame()
    }

    window.addEventListener('beforeunload', closeFn, false)
    this.clean = () => {
      window.removeEventListener('beforeunload', closeFn)
    }

    this.$emit('view', 'loading')
    this.$on('okay', () => {
      this.findAllPlayers()
      this.resetToDefaultStat()
      this.$emit('clients', this.clients)
    })
  },
  methods: {
    resetToDefaultStat () {
      FDB.ref(`/players/${this.gameID}/players/${State.user.uid}/slap`).set(0)
      FDB.ref(`/players/${this.gameID}/players/${State.user.uid}/position`).set({
        x: 0,
        y: 0,
        z: 0
      })
    },
    closeGame () {
      FDB.ref(`/players/${this.gameID}/players/${State.user.uid}`).remove()
      if (State.user.isAnonymous) {
        FDB.ref(`/users/${State.user.uid}`).remove()
      }
    },
    findGame () {
      return new Promise((resolve, reject) => {
        FDB.ref(`/user-games/${this.gameUID}/${this.gameID}`).once('value', (snap) => {
          console.log()
          let ans = snap.val()
          if (ans && ans._id) {
            resolve()
          } else {
            reject(new Error('not found'))
          }
        })
      })
    },
    findAllPlayers () {
      FDB.ref(`/players/${this.gameID}/players`).on('value', (snap) => {
        let val = snap.val()
        if (val) {
          let playerUIDs = Object.keys(val)
          this.clients = playerUIDs.map((keyname) => {
            let item = val[keyname]
            if (item) {
              item._id = keyname
              item.isMe = item.uid === State.user.uid
            }
            return item
          }).filter(c => !!c).filter(c => c.player)
          console.log(this.clients)

          if (this.clients.length === this.playerCount) {
            this.$emit('view', 'game')
          } else {
            this.$emit('view', 'lobby')
          }
        } else {
          this.clients = []
          this.$emit('view', 'lobby')
        }
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
