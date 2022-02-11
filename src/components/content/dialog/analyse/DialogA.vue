<template>
  <el-dialog
    title="事件处置"
    :visible.sync="visible"
    width="1322px"
    :before-close="handleCancel"
    class="impotDialog"
  >
    <div class="dialog_con">
      <header>
        <div class="left">
          <img src="@/assets/images/analyse/组 759.svg" alt />
        </div>
        <div class="right">
          <i class="iconfont icon-bofang"></i>
        </div>
      </header>
      <footer>
        <div>
          <span>一楼门口</span>
          <b>[0]-2019/03/22 08:01:25</b>
        </div>

        <el-button type="primary">吸烟检测</el-button>
      </footer>
    </div>
    <span slot="footer" class="footer">
      <el-button type="warning" @click="handleCancel">处置详情</el-button>
      <el-button @click="handleCancel">事件上报</el-button>
      <el-button @click="handleCancel">现场处理</el-button>
      <el-button type="primary" @click="handleOk">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean
    }
  },
  methods: {
    handleCancel() {
      this.$emit('onChange')
    },
    handleOk() {},
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  border-bottom: 1px solid #6fe9ce;
}
.dialog_con {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    .left,
    .right {
      width: 601px;
      height: 338px;
    }
    .left {
      margin-right: 10px;
      img {
        width: 100%;
      }
    }
    .right {
      position: relative;
      background-color: #eee;
      i {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 50px;
      }
    }
  }

  footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 35px;
    div:first-child {
      display: flex;
      flex-direction: column;
    }
    span {
      margin-bottom: 10px;
    }
    span,
    b {
      font-size: 17px;
      font-weight: bold;
      line-height: 14px;
      color: #ffffff;
    }
  }
}
::v-deep .el-dialog__footer {
  padding-top: 20px;
  transform: translateX(64%);
}
</style>