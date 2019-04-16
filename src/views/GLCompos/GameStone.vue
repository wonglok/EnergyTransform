<template>
  <Object3D>
    <PhysicsItem :size="stone.size" :move="stone.move" :id="stone._id" :geo="stone.geo" :idb="idb" :world="world" :name="stone.name">
      <Object3D :quaternion="stone.quaternion" :position="stone.position">
        <Box :size="stone.size" :color="stone.color"></Box>
      </Object3D>
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

let getRD = () => {
  return `_${(Math.random() * 1000000).toFixed(0)}`
}

export default {
  components: {
    Box,
    ...FreeJS
  },
  props: {
    world: {},
    idb: {},
    stone: {},
  },
  watch: {

  },
  data () {
    let stone = this.stone
    return {
      temp: new Vector3(0, 0, 0),
      element: false,
      body: false
    }
  },
  computed: {

  },
  mounted () {
    // let self = this
    // var tween = false
    // var run = () => {
    //   self.client.position = self.client.position || { x: 0, y: 0, z: 0 }
    //   if (tween) {
    //     tween.stop()
    //   }
    //   let coord = { ...this.body.position }
    //   tween = new TWEEN.Tween(coord)
    //     .to({
    //       x: self.client.position.x,
    //       z: self.client.position.y,
    //       y: self.client.position.z + 3
    //     }, 150 * 2)
    //     .onUpdate(() => {
    //       if (this.body) {
    //         this.body.position.copy(coord)
    //       }
    //     })
    //     .start()

    //     setTimeout(() => {
    //       run()
    //     }, 100 * 2)
    // }

    // run()
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
