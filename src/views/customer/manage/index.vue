<!--
 * @Author: :luck
 * @Date: 2021-11-25 14:30:26
 * @LastEditors: :your name
 * @LastEditTime: 2022-01-07 19:34:01
 * @Description: :file content
-->
<template>
  <div class="container">
    <el-tabs
      type="border-card"
      style="min-height: calc(100vh - 72px)"
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane label="报表" name="first">
        <DailyPaper />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DailyPaper from "./form/dailyPaper";

export default {
  components: {
    DailyPaper,
  },
  data() {
    return {
      isShow: false,
      serverId: "",
      activeName: "first",
    };
  },
  methods: {
    handleClick(tab, event) {
    },
    // 改变isShow 为true
    onChange(arg) {
      this.isShow = arg[1];
      this.serverId = arg[0] + "";
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
::v-deep .el-tabs__content {
  height: calc(100% - 40px);
}
::v-deep .el-tab-pane {
  height: calc(100% - 12px);
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

::v-deep .el-tabs--border-card > .el-tabs__content {
  padding: 0;
}
</style>
