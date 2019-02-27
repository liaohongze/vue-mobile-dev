<template>
  <div class="with_navbar">
    <router-view></router-view>
    <van-tabbar v-model="active" active-color="#00c482" @change='tabChange'>
      <van-tabbar-item icon="wap-home">首页</van-tabbar-item>
      <van-tabbar-item icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0
    }
  },
  methods: {
    tabChange: function (active) {
      const routerObj = new Map([
        [0, { path: 'home' }],
        [1, { path: 'user' }]
      ])
      this.$router.replace(routerObj.get(active))
    }
  }
}
</script>
