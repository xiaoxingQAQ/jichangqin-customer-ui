<template>
  <el-tabs type="border-card" style="height: calc(100vh - 72px);" v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="即时告警" name="first">
      <immediate-alarm></immediate-alarm>
    </el-tab-pane>
    <el-tab-pane label="数据告警" name="second">
      <data-page></data-page>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ImmediateAlarm from './form/immediateAlarm'
import dataPage from './form/dataPage'
export default {
  name: 'index',
  components: {
    ImmediateAlarm,
    dataPage
  },
  data() {
    return {
      activeName: 'first'
    };
  },
  methods: {
    handleClick(tab, event) {
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__header{
  margin: 0;
  background: #ffffff;
  opacity: 1;
  padding: 5px 0;
}

::v-deep .el-tab-pane{
  background-color: #FFFFFF;
  padding: 10px;
}
::v-deep .app-container{
  padding: 0;
}
::v-deep .el-tabs__nav-wrap::after{
  background-color: transparent;
}

::v-deep .el-tabs__content {
  padding: 0px;
}
</style>
