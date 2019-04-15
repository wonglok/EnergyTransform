<template>
  <Object3D ref="elem" @element="(v) => { element = v }">
    <PhysicsItem @body="(v) => { body = v }" :size="oo.size" :move="oo.move" :id="oo._id" :geo="oo.geo" :idb="idb" :noSleep="oo.noSleep" :name="oo.name" :userData="oo.userData" :kinematic="oo.kinematic" :world="world" :key="oo._id">
      <Box :size="oo.size" :color="oo.color"></Box>
    </PhysicsItem>
  </Object3D>
</template>

<script>
import Box from '../../ProtoEnergy/Items/Box.vue'
import FreeJS from '../../ProtoEnergy/FreeJS'
import { setInterval, setTimeout } from 'timers'
import { Vector3 } from 'three'

var TWEEN = require('@tweenjs/tween.js')
function animate(time) {
  requestAnimationFrame(animate)
  TWEEN.update(time)
}
requestAnimationFrame(animate)

export default {
  components: {
    Box,
    ...FreeJS
  },
  props: {
    world: {},
    idb: {},
    client: {},
  },
  watch: {

  },
  data () {
    return {
      temp: new Vector3(0, 0, 0),
      element: false,
      body: false
    }
  },
  computed: {
    oo () {
      let c = this.client
      return {
        _id: c.gameID + c.player,
        geo: 'box',
        move: true,
        size: { x: 30, y: 30, z: 30 },
        color: `hsl(${(360 * Math.random()).toFixed(0)}, 100%, 64%)`,
        quaternion: { x: 0.0, y: 0.0, z: 0.0, w: 1.0 },
        position: { x: 0, y: 0, z: 0 },
        move:true,
        noSleep:true,
        name:'chars',
        kinematic:true,
        userData: c
      }
    }
  },
  mounted () {
    let self = this

    var tween = false
    var run = () => {
      self.client.position = self.client.position || { x: 0, y: 0, z: 0 }
      if (tween) {
        tween.stop()
      }
      let coord = { ...this.body.position }
      tween = new TWEEN.Tween(coord)
        .to({
          x: self.client.position.x,
          z: self.client.position.y,
          y: self.client.position.z + 3
        }, 150 * 2)
        .onUpdate(() => {
          if (this.body) {
            this.body.position.copy(coord)
          }
        })
        .start()

        setTimeout(() => {
          run()
        }, 100 * 2)
    }

    run()
  },
  created () {
    this.$on('add', (v) => {
      this.$parent.$emit('add', v)
    })
    this.$on('remove', (v) => {
      this.$parent.$emit('remove', v)
    })
  }
}
</script>

<style>

</style>
