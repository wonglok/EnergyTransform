<template>
<div>
</div>
</template>
<script>
import { ShaderMaterial, Color } from 'three'
export default {
  props: {
    audioTexture: {
      default () {
        return null
      }
    }
  },
  data () {
    return {
      material: false
    }
  },
  watch: {
    audioTexture () {
      this.setupAudio()
    }
  },
  methods: {
    setupAudio () {
      if (this.audioTexture) {
        this.material.uniforms.audioTexture.value = this.audioTexture
      }
    }
  },
  mounted () {
    let mat = this.mat = new ShaderMaterial({
      uniforms: {
        time: {
          value: window.performance.now() / 1000
        },
        audioTexture: {
          value: null
        },
        solidColor: {
          value: new Color(`#ff0000`)
        }
      },
      transparent: true,
      vertexShader: `
        varying vec2 vUv;
        uniform sampler2D audioTexture;
        uniform float time;
        void main()	{
          vUv = uv;
          vec4 colorA = texture2D(audioTexture, vec2(vUv.x, vUv.y));
          vec3 newPos = position;
          newPos += colorA.r * normal.xyz * 3.5;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( newPos, 1.0 );
          gl_PointSize = 2.0;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 solidColor;
        uniform float time;
        uniform sampler2D audioTexture;
        void main (void) {
          vec4 colorA = texture2D(audioTexture, vec2(vUv.x, vUv.y));
          gl_FragColor = vec4(vec3(colorA.r * 1.3, colorA.r, colorA.r), (colorA.r + 0.1) * 3.0);
        }
      `
    })
    this.material = mat
    this.setupAudio()
    this.$emit('material', mat)
  },
  beforeDestroy () {
    this.material.dispose()
    this.$emit('material', false)
  }
}
</script>

<style>

</style>
