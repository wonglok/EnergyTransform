<template>
  <div>
    <ol>
      <li :key="ii" v-for="(item, ii) in router">
        <router-link :to="item.path">{{ item.path }}</router-link>
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  data () {
    return {
      router: this.$router.options.routes.filter((r) => {
        if (r.meta) {
          return !r.meta.hide
        } else {
          return true
        }
      }).map((r) => {
        return {
          path: r.path
        }
      })
    }
  }
}
</script>

<style>

</style>
