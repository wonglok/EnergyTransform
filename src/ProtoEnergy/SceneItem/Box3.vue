<template>
  <Object3D>
    <!-- <Box :color="'#0ff0f0'"></Box> -->

    <PlaneBufferGeometry @geometry="(v) => { geo.box = v }"></PlaneBufferGeometry>
    <!-- <SolidMaterial @material="(v) => { mat.solid = v }"></SolidMaterial> -->
    <AudioMaterial @material="(v) => { mat.audio = v }"></AudioMaterial>

    <Object3D v-if="geo.box && mat.audio">
      <!-- <Object3D :position="{ x: 0, y: 0, z: 0 }" :scale="{ x: 50, y: 50, z: 50 }">
        <Mesh :geo="geo.box" :mat="mat.audio"></Mesh>
      </Object3D>
      <Object3D :position="{ x: 0, y: 50, z: 0 }" :scale="{ x: 50, y: 50, z: 50 }">
        <Mesh :geo="geo.box" :mat="mat.audio"></Mesh>
      </Object3D> -->
      <Object3D :position="{ x: 0, y: 0, z: 0 }" :scale="{ x: 130, y: 130, z: 130 }">
        <Mesh :geo="geo.box" :mat="mat.audio"></Mesh>
      </Object3D>
    </Object3D>
  </Object3D>
</template>

<script>
import Box from '../Items/Box.vue'
import PlaneBufferGeometry from '../Geometry/PlaneBufferGeometry.vue'
import Mesh from '../Items/Mesh.vue'
import SolidMaterial from '../Material/SolidMaterial.vue'
import AudioMaterial from '../Material/AudioMaterial.vue'
import DevMaterial from '../Material/DevMaterial.vue'
import FreeJS from '../FreeJS'
import { setInterval } from 'timers';

export default {
  props: {
    audioAPI: {}
  },
  components: {
    ...FreeJS,
    DevMaterial,
    SolidMaterial,
    AudioMaterial,
    Mesh,
    PlaneBufferGeometry,
    Box
  },
  data () {
    return {
      geo: {
        box: false,
      },
      mat: {
        audio: false
      }
    }
  },
  watch: {
    audioAPI () {
      this.setup()
    }
  },
  created () {
    this.$on('add', (v) => {
      this.$parent.$emit('add', v)
    })
    this.$on('remove', (v) => {
      this.$parent.$emit('remove', v)
    })
  },
  mounted () {
    this.setup()
  },
  methods: {
    setup () {
      if (this.audioAPI) {
        this.mat.audio.uniforms.audioTexture.value = this.audioAPI.texture
        setInterval(() => {
          if (this.audioAPI) {
            this.mat.audio.uniforms.audioTexture.value = this.audioAPI.texture
          }
        }, 100)
      }
    }
  }
}
</script>

<style>

</style>
