<template>
  <el-tabs
    style="height: calc(100vh - 72px)"
    type="border-card"
    v-model="activeName"
    @tab-click="handleClick"
  >
    <el-tab-pane label="数据统计" name="first" v-if="false">
      <statistics-page></statistics-page>
    </el-tab-pane>
    <el-tab-pane label="智能分析" name="second">
      <analyse-page></analyse-page>
    </el-tab-pane>
    <el-tab-pane label="智能抓拍" name="three">
      <capture-page></capture-page>
    </el-tab-pane>
    <el-tab-pane label="名单预警" name="four">
      <list-page></list-page>
    </el-tab-pane>
    <el-tab-pane label="人车轨迹" name="five">
      <track-page></track-page>
    </el-tab-pane>
    <el-tab-pane label="研判告警" name="six">
      <abnormal-page></abnormal-page>
    </el-tab-pane>
    <el-tab-pane label="任务管理" name="seven">
      <task-notification-page></task-notification-page>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import statisticsPage from "./form/statisticsPage";

import analysePage from "./form/analysePage"; // 智能分析
import capturePage from "./form/capturePage"; // 智能抓拍

import listPage from "./form/listPage"; // 名单预警
import trackPage from "./form/trackPage"; // 人车轨迹
import abnormalPage from "./form/abnormalPage"; // 研判告警
import taskNotificationPage from "./form/taskNotificationPage"; // 任务管理

export default {
  name: "index",
  components: {
    statisticsPage,
    analysePage,
    capturePage,
    listPage,
    trackPage,
    abnormalPage,
    taskNotificationPage,
  },
  data() {
    return {
      activeName: "second",
    };
  },
  methods: {
    handleClick(tab, event) {
    },
  },
};
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
::v-deep .page-main {
  font-size: 12px;
}

::v-deep .el-tabs__content {
  padding: 0;
}
.cascader {
  position: absolute;
  z-index: 9;
  width: 200px;
}
</style>
