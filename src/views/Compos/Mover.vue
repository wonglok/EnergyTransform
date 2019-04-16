<template>
  <div class="press-me" ref="area" @mousedown="h.onMD" @mouseup="h.onMU" @mousemove="h.onMM">
    <h1>Move Pad Controller</h1>
    <pre>{{ pos }}</pre>
  </div>
</template>

<script>
import { FDB } from '../../firebase.js'
import { setInterval, clearInterval, setTimeout } from 'timers';

export default {
  props: {
    uid: {},
    gameID: {}
  },
  data () {
    return {
      ready: false,
      pos: {
        x: 0,
        y: 0,
        z: 0
      },
      delta: {
        x: 0,
        y: 0,
        z: 0
      },
      rect: {
        width: 0,
        height: 0
      },
      inertia: 1,
      lastPos: ''
    }
  },
  created () {
    this.h = {
      mmi: 0,
      onMD: () => {
        this.rect = this.$refs['area'].getBoundingClientRect()
        this.h.isDown = true
      },
      onMM: (evt) => {
        if (this.h.isDown) {
          let x = this.rect.left
          let y = this.rect.top

          let h = this.rect.height
          let w = this.rect.width
          let whalf = this.rect.width * 0.5
          let hhalf = this.rect.height * 0.5

          let cX = evt.pageX - x
          let cY = evt.pageY - y

          this.delta.x = (cX - whalf) / w * 0.18
          this.delta.y = (cY - hhalf) / h * 0.18
          this.inertia = 2
        }
      },
      onMU: () => {
        this.h.isDown = false
      }
    }



    window.addEventListener('mousemove', this.h.onMM)
    window.addEventListener('mouseup', this.h.onMU)

    this.h.mmi = setInterval(() => {
      if (this.h.isDown) {
        this.inertia = 2
      }

      if (this.inertia > 0.03) {
        this.pos.x += this.delta.x * this.inertia
        this.pos.y += this.delta.y * this.inertia
      }

      this.inertia *= 0.8
    }, 1000 / 60)
    this.clean2 = () => {
      clearInterval(this.h.mmi)
    }
  },
  mounted () {
    this.showPos()
    let tt = setInterval(() => {
      if (this.lastPos !== JSON.stringify(this.pos)) {
        this.sync()
        this.lastPos = JSON.stringify(this.pos)
      }
    }, 100 * 2)
    this.clean = () => {
      clearInterval(tt)
    }

    this.$refs['area'].addEventListener('touchstart', (evt) => {
      evt.preventDefault()
      this.h.onMD()
    }, false)
    this.$refs['area'].addEventListener('touchmove', (evt) => {
      evt.preventDefault()
      console.log(evt.touches[0])
      this.h.onMM({
        pageX: evt.touches[0].pageX,
        pageY: evt.touches[0].pageY
      })
    }, false)
    window.document.body.addEventListener('touchmove', (evt) => {
      evt.preventDefault()
      console.log(evt.touches[0])
      this.h.onMM({
        pageX: evt.touches[0].pageX,
        pageY: evt.touches[0].pageY
      })
    }, false)
    this.$refs['area'].addEventListener('touchend', () => {
      this.h.onMU()
    }, false)
    window.addEventListener('touchend', () => {
      this.h.onMU()
    }, false)
  },
  beforeDestroy () {
    this.clean()
    this.clean2()
  },
  methods: {
    sync () {
      FDB.ref(`/players/${this.gameID}/players/${this.uid}/position`).set({
        x: this.pos.x,
        y: this.pos.y,
        z: this.pos.z
      })
    },
    showPos () {
      FDB.ref(`/players/${this.gameID}/players/${this.uid}/position`).on('value', (snap) => {
        let val = snap.val()
        if (val) {
          this.pos = val
          this.$emit('pos', val)
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
  width: 60vmin;
  height: 60vmin;
  background-color: #eee;
}
</style>
