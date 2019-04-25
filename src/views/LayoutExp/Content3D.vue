<template>
<div>
</div>
</template>

<script>
import { Mesh, ShaderMaterial, Color, PlaneBufferGeometry } from 'three'
export default {
  props: {
    size: {
      default () {
        return { x: 20, y: 20, z: 20 }
      }
    },
    mode: {
      default () {
        return 'center' // top, left, right, bottom, center
      }
    },
    formula: {
      default () {
        return { x: '20', y: '20', z: '20' }
      }
    },
    color: {
      default () {
        return `#ff00ff`
      }
    }
  },
  data () {
    return {
      rect: false,
      screen: false,
      object: false
    }
  },
  beforeCreate () {
    this.$on('rect', (rect) => {
      this.rect = rect
    })
    this.$on('screen', (screen) => {
      this.screen = screen
    })
  },
  methods: {
    geoGeometry () {
      let width = 2
      let height = 2
      if (this.rect) {
        width = this.rect.width
        height = this.rect.height
      }
      let geo = new PlaneBufferGeometry(width, height, 4, 4, 4)
      return geo
    }
  },
  watch: {
    color () {
      if (this.object && this.object.material) {
        this.object.material.uniforms.neoColor.value = new Color(`${this.color}`)
        this.object.material.uniforms.neoColor.needsUpdate = true
      }
    },
    rect () {
      this.object.geometry = this.geoGeometry()
      this.object.needsUpdate = true
    }
  },
  mounted () {
    let geo = this.geoGeometry()
    let mat = new ShaderMaterial({
      uniforms: {
        neoColor: {
          value: new Color(`${this.color}`)
        }
      },
      transparent: true,
      vertexShader: `
        void main(){
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        uniform vec3 neoColor;
        void main (void) {
          gl_FragColor = vec4(neoColor, 1.0);
        }
      `
    })
    this.object = new Mesh(geo, mat)
    this.$parent.$emit('add', this.object)
  },
  beforeDestroy () {
    this.$parent.$emit('remove', this.object)
  }
}
</script>

<style>

</style>
