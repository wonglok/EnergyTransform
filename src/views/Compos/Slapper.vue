<template>
  <div v-if="mode === 'me'" class="press-me" @click="slaper">
    <span v-if="ready">CLICK ME {{ slap }}</span>
  </div>
  <div v-else-if="mode === 'dataonly'">
  </div>
  <div v-else-if="mode === 'viewonly'">
    <span v-if="ready">{{ slap }}</span>
  </div>
</template>

<script>
import { FDB } from '../../firebase.js'

export default {
  props: {
    mode: {},
    uid: {},
    gameID: {}
  },
  data () {
    return {
      ready: false,
      slap: 0,
    }
  },
  mounted () {
    this.showSlap()
  },
  methods: {
    slaper () {
      FDB.ref(`/players/${this.gameID}/players/${this.uid}/slap`).transaction((currentVal) => {
        if (!currentVal) {
          return 1
        }
        return currentVal + 1
      })
    },
    showSlap () {
      FDB.ref(`/players/${this.gameID}/players/${this.uid}/slap`).on('value', (snap) => {
        let val = snap.val()
        if (val) {
          this.slap = val
          this.$emit('slap', val)
        }
        this.ready = true
      })
    }
  }
}
</script>

<style scoped>
.press-me{
  touch-action: manipulation;
  user-select: none;
  width: 320px;
  height: 100px;
  background-color: rgb(145, 145, 145);
}
</style>
