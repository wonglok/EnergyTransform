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
      router: this.$router.options.routes.map((r) => {
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
