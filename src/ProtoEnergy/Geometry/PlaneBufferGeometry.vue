<template>
  <div class="hidden">
    <slot></slot>
  </div>
</template>

<script>
import { PlaneBufferGeometry } from 'three'
export default {
  props: {
    size: {
      default () {
        return { x: 1.0, y: 1.0, z: 1.0 }
      }
    }
  },
  data () {
    return {
      geometry: false
    }
  },
  mounted () {
    let geo = new PlaneBufferGeometry(this.size.x, this.size.y, 512, 512)
    this.geometry = geo
    this.$emit('geometry', geo)
  },
  beforeDestroy () {
    this.$emit('geometry', false)
  }
}
</script>

<style scoped>
.hidden{
  display: none;
}
</style>
