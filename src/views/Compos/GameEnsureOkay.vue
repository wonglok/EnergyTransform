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
          })
      }
    })

    this.$emit('view', 'loading')
    this.$on('okay', () => {
      this.findAllPlayers()
      this.$emit('clients', this.clients)
    })
  },
  methods: {
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
    },
    findAllPlayers () {
      FDB.ref(`/players/${this.gameID}/players`).on('value', (snap) => {
        let val = snap.val()
        if (val) {
          let playerUIDs = Object.keys(val)
          this.clients = playerUIDs.map((keyname) => {
            let item = val[keyname]
            item._id = keyname
            return item
          }).filter(c => !!c).filter(c => c.player)

          if (this.clients.filter(c => !!c && c.player).length === this.playerCount) {
            console.log(this.clients)
            let me = this.clients.find(c => !!c && c.uid === State.user.uid && c.player)
            if (me) {
              this.$emit('view', 'game')
            } else {
              this.$emit('view', 'full')
            }
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
