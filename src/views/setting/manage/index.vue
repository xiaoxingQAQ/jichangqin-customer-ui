<template>
  <el-tabs
    style="height: calc(100vh - 72px)"
    v-model="activeName"
    @tab-click="handleClick"
    type="border-card"
  >
    <el-tab-pane label="操作日志" name="first">
      <OperationLog />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import OperationLog from '@/views/setting/manage/from/versions/OperationLog'
export default {
  components: {
    OperationLog
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
::v-deep .el-tabs__active-bar {
  background-color: transparent;
}
::v-deep.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #7bf5d4ff !important;
  color: #000 !important;
}
::v-deep.el-pagination.is-background .el-pager li {
  margin: 0 0.0625rem;
  background-color: transparent !important;
  color: #fff !important;
  min-width: 0.375rem;
  border-radius: 0.025rem;
}

::v-deep .el-tabs--border-card > .el-tabs__content {
  padding: 1 !important;
}

::v-deep .el-tabs__content {
  padding: 0;
}
</style>
