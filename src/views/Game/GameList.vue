<template>
  <div>
    <div>
      Game List
    </div>
    <MakeGame></MakeGame>
    <ul>
      <li :key="ga._id" v-for="ga in games">
        <span>{{ ga.status }}</span>
        <span>{{ timeFromNow(ga.date) }}</span>
        <button @click="remove(ga)">Remove</button>
      </li>
    </ul>
  </div>
</template>

<script>
import MakeGame from './MakeGame.vue'
import { FDB, toArr } from '../../firebase.js'
import moment from 'moment'
export default {
  components: {
    MakeGame
  },
  data () {
    return {
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
