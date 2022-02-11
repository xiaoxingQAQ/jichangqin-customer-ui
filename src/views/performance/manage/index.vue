<template>
  <div class="container">
    <el-tabs type="border-card" style="min-height: calc(100vh - 72px);" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="绩效" name="first">
        <abnormal-page></abnormal-page>
      </el-tab-pane>
<!--      <el-tab-pane label="评分规则" name="second" v-if="false">-->
<!--        <analyse-page></analyse-page>-->
<!--      </el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script>
import abnormalPage from './form/abnormalPage'
// import analysePage from './form/analysePage'
export default {
  components: {
    abnormalPage
  },
  data() {
    return {
      isShow: false,
      serverId: "",
        activeName: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {
    },
    // 改变isShow 为true
    onChange(arg) {
      this.isShow = arg[1]
      this.serverId = arg[0]+""
    },
  },
}
</script>

<style lang="scss" scoped>

::v-deep .el-tabs__header{
  margin: 0;
  background: #ffffff;
  opacity: 1;
   padding: 5px;
}

::v-deep .el-tabs__content {
  height: calc(100% - 49px);
  /*background-color: #F2F2F2;*/
}
::v-deep .el-tab-pane{
  height: calc(100% - 12px);
  background-color: #FFFFFF;
  padding: 10px;
}
::v-deep .app-container{
  padding: 0;
}
::v-deep .el-tabs__nav-wrap::after{
  background-color: transparent;
}
::v-deep .el-tabs__active-bar{
  background-color: transparent;
}

::v-deep .el-tabs--border-card > .el-tabs__content {
  padding: 0;
}
</style>
