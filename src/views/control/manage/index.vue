<template>
  <div class="container">
        <DevicePage ref="device" @onChange="onChange(arguments)" v-show="!isShow" />
        <CameraPage ref="camera" @onChange="onChange(arguments)" :serverId="serverId" v-show="isShow" />
  </div>
</template>

<script>
// import DevicePage from './form/devicePage'
// import CameraPage from './form/cameraPage'
export default {
  components: {
    // DevicePage,
    // CameraPage
  },
  data() {
    return {
      isShow: false,
      serverId: "",
    }
  },
  methods: {
    // 改变isShow 为true
    onChange(arg) {
      this.isShow = arg[1]
      this.serverId = arg[0]+""
     
    },
  },
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
