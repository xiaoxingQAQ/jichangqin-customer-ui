<template>
  <div class="container" style="height: calc(100vh - 72px)">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      type="border-card"
    >
      <el-tab-pane label="用户管理" name="first">
        <user-page></user-page>
      </el-tab-pane>
      <el-tab-pane label="人员管理" name="second">
        <personnel-page></personnel-page>
      </el-tab-pane>
      <el-tab-pane label="设备管理" name="third">
        <Device></Device>
      </el-tab-pane>
      <el-tab-pane label="地图管理" name="fourth">
        <map-page></map-page>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import userPage from './form/userPage'
import PersonnelPage from './form/personPage'
import MapPage from '@/views/operation/manage/form/mapPage'

import Device from './form/Device'
export default {
  name: 'index',
  components: {
    MapPage,
    PersonnelPage,
    userPage,
    Device
  },
  data() {
    return {
      activeName: 'first'
    };
  },
  methods: {
    handleClick(tab, event) {
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__header {
  margin: 0;
  background: #ffffff;
  opacity: 1;
  padding: 5px;
}
::v-deep .el-tab-pane {
  background-color: #ffffff;
  padding: 10px;
}
::v-deep .app-container {
  padding: 0;
}
::v-deep .el-tabs__nav-wrap::after {
  background-color: transparent;
}
::v-deep .el-tabs__content {
  padding: 0;
}
</style>
