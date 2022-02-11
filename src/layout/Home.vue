<template>
  <div class="home">
    <div id="web_bg"></div>
    <!-- NavBar -->
    <header>
      <NavBar />
    </header>
    <main>
      <transition name="fade-transform" mode="out-in">
        <router-view></router-view>
      </transition>
    </main>
  </div>
</template>

<script>
import NavBar from '@/components/content/navBar/NavBar'

export default {
  name: 'Home',
  components: {
    NavBar,
  },
  data() {
    return {

    }
  },
  created() {

  },
  methods: {

  },
}
</script>

<style lang="scss" scoped>
#web_bg {
  position: fixed;
  top: 64px;
  left: 0;
  width: 100%;
  height: 100%;
  //min-width: 1000px;
  z-index: -10;
  zoom: 1;
  background-color: #fff;
  background-repeat: no-repeat;
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  background-position: center 0;
  background-image: url("../assets/images/home/背景.svg");
  background-size: 100%;
}
.home {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  header {
    position: absolute;
    top: 0;
    left: 0;
  }

  main {
    position: absolute;
    left: 0px;
    right: 0;
    top: 64px;
    bottom: 0;
  }
}
</style>
