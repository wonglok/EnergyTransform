<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export const fullscreen = ({ object, camera }) => {
  var cameraZ = camera.position.z
  var distance = cameraZ - object.position.z
  var aspect = camera.aspect
  var vFov = camera.fov * Math.PI / 180
  var planeHeightAtDistance = 2 * Math.tan(vFov / 2) * distance
  var planeWidthAtDistance = planeHeightAtDistance * aspect
  /*
  let dist = camera.position.z - mesh.position.z
  let height = ... // desired height to fit
  camera.fov = 2 * Math.atan(height / (2 * dist)) * (180 / Math.PI)
  camera.updateProjectionMatrix()
  */
  return {
    aspect: planeWidthAtDistance / planeHeightAtDistance,
    vmin: Math.min(planeWidthAtDistance, planeHeightAtDistance),
    vmax: Math.max(planeWidthAtDistance, planeHeightAtDistance),
    width: planeWidthAtDistance,
    height: planeHeightAtDistance
  }
}

// import { fullscreen } from './sdk.js'

export default {
  props: {
    camera: {}
  },
  data () {
    return {
      mode: 'item',
      thisIsLayout3D: true,
      rect: {}
    }
  },
  created () {
    if (!this.$parent.thisIsLayout3D) {
      this.mode = 'root'
    }
    this.$on('add', (v) => {
      this.tellAllChildren()
      this.$parent.$emit('add', v)
    })
    this.$on('remove', (v) => {
      this.$parent.$emit('remove', v)
    })
    window.addEventListener('resize', () => {
      this.tellAllChildren()
    }, false)
  },
  methods: {
    tellAllChildren () {
      if (this.mode === 'root') {
        var cascader = (ea) => {
          let screen = fullscreen({
            object: {
              position: { x: 0, y: 0, z: 0 }
            },
            camera: this.camera
          })

          ea.$children.forEach(e => {
            if (e.object) {
              let rect = fullscreen({ camera: this.camera, object: e.object })
              e.$emit('rect', rect)
            }
            e.$emit('screen', screen)
            this.$nextTick(() => {
              cascader(e)
            })
          })
        }
        cascader(this)
      }
    }
  },
  watch: {
    $children () {
      this.tellAllChildren()
    }
  }
}
</script>

<style>

</style>
