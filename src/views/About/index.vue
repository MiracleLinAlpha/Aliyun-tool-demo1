<template>
  <div class="about-conti">
    <div class="banner" style="text-align:center;">
      <img class="banner-img" src="@/assets/banner-aliyuntool.png">
    </div>
    <div></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
</style>
