<template>
  <div>

    <div v-html="omgomg"></div>
    <GLLayout style="width: 300px; height: 300px;">
      <template slot-scope="tmp" slot="scene">
        <Layout3D v-if="tmp.camera" :camera="tmp.camera">
          <Layout3D>
            <Content3D :color="colorHex"></Content3D>
          </Layout3D>
        </Layout3D>
      </template>
    </GLLayout>
    <div class="mybox"></div>

    <pre>{{ root }}</pre>

    <div>{{ voice }}</div>

  </div>
</template>

<script>
import * as SDK from '../../ui-database/sdk.js'

export default {
  components: {
    Content3D: require('./Content3D.vue').default,
    GLLayout: require('./GLLayout.vue').default,
    Layout3D: require('./Layout3D.vue').default
  },
  data () {
    return {
      colorHex2: '#ff00ff',
      colorHex: '#ffffff',
      voice: '',
      omgomg: '',
      root: false
    }
  },
  mounted () {
    var cascader = (ea) => {
      this.$forceUpdate()
      this.$emit('fast-edit-refresh')
      ea.$children.forEach(e => {
        e.$forceUpdate()
        e.$emit('fast-edit-refresh')
        this.$nextTick(() => {
          cascader(e)
        })
      })
    }

    let cleanFn = SDK.getRealTimeUpdates({
      getRoot: () => {
        return this.root
      },
      refresh: () => {
        cascader(this)
      },
      onRootArrived: (data) => {
        this.root = data
      }
    })

    this.clean = () => {
      cleanFn()
    }

    this.$on('fast-edit-refresh', () => {
      let holder = SDK.getItem(this.root, 'css', 'HUMAN_INPUT')
      if (holder) {
        this.omgomg = `<style>${holder.css}</style>`
      }
    })

    this.$on('fast-edit-refresh', () => {
      let holder = SDK.getItem(this.root, 'text', 'MY_VOICE')
      if (holder) {
        this.voice = holder.text
      }
    })

    this.$on('fast-edit-refresh', () => {
      let holder = SDK.getItem(this.root, 'color', 'color_1')
      if (holder) {
        this.colorHex = holder.colors.hex
      }
    })
    this.$on('fast-edit-refresh', () => {
      let holder = SDK.getItem(this.root, 'color', 'color_2')
      if (holder) {
        this.colorHex2 = holder.colors.hex
      }
    })
  }
}
</script>

<style>

</style>
