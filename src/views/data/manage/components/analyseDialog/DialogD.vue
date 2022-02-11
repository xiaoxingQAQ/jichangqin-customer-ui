<template>
  <el-dialog
    title="事件处置"
    :visible.sync="visible"
    width="60%"
    :before-close="handleCancel"
    class="impotDialog"
  >
    <div class="dialog_con">
      <header>
        <div class="left">
          <el-image
            @error="handleErr(cur_data, cur_data.eventSnapPic, 5)"
            class="image"
            :src="cur_data.eventSnapPic"
            lazy
          >
            <div class="image-slot" slot="placeholder">
              <div>加载中...</div>
            </div>
            <div slot="error" class="image-slot">
              <div>加载中...</div>
            </div>
          </el-image>
        </div>
        <div class="right" v-if="false">
          <div>
            <i class="iconfont icon-tishi">暂无视频</i>
          </div>
        </div>
      </header>
      <footer>
        <div class="main">
          <div>
            <img src="@/assets/images/analyse/蒙版组 39.svg" alt />
            <img src="@/assets/images/analyse/蒙版组 39.svg" alt />
          </div>

          <div>
            <div>
              <div>
                <span>姓名：</span>
                <b></b>
              </div>
              <div>
                <span>编号：</span>
                <b></b>
              </div>
              <div>
                <span>备注：</span>
                <b></b>
              </div>
            </div>
            <div>
              <div>
                <span>性别：</span>
                <b></b>
              </div>
              <div>
                <span>部门：</span>
                <b></b>
              </div>
            </div>
          </div>
        </div>
        <div class="btn">
          <el-button type="primary">人脸抓拍</el-button>
          <el-button type="success">顾客</el-button>
        </div>
      </footer>

      <div class="text">
        <span>一楼门口</span>
        <b>[0]-2019/03/22 08:01:25</b>
      </div>
    </div>
    <span slot="footer" class="footer">
      <el-button @click="handleCancel">黑名单</el-button>
      <el-button @click="handleCancel">陌生人</el-button>
      <el-button @click="handleCancel">员工</el-button>
      <el-button @click="handleOk">顾客</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean
    },
    cur_data: Object
  },
  data() {
    return {
    };
  },
  methods: {
    handleCancel() {
      this.$emit("cancel");
    },
    handleErr(item, imgSrc, count) {
      return
      if (count > 0) {
        setTimeout(() => {
          item.eventSnapPic = imgSrc + `?t+${Math.random()}`
        }, 500);
      }
    },
    handleOk() { }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  border-bottom: 1px solid #6fe9ce;
}
.dialog_con {
  position: relative;
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
        font-size: 25px;
      }
    }
  }

  footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 0 35px;
    .btn {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }

    .main {
      width: 100%;
      display: flex;
      justify-content: space-between;
      > div:nth-child(1) {
        display: flex;
        width: 210px;
        img {
          width: 100px;
          margin-left: 10px;
        }
      }
      > div:last-child {
        display: flex;
        width: 580px;
        > div:nth-child(1) {
          width: 280px;
        }

        > div:nth-child(2) {
          flex: 1;
        }
        span {
          display: inline-block;
          margin-bottom: 10px;
        }
        span,
        b {
          font-size: 17px;
          font-weight: 500;
          line-height: 14px;
          color: #ffffff;
        }
      }
    }
  }
  .text {
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: -16.5%;
    left: 36px;
    span {
      margin-bottom: 10px;
    }
    span,
    b {
      font-size: 17px;
      font-weight: 500;
      line-height: 14px;
      color: #ffffff;
    }
  }
}
::v-deep .el-dialog__footer {
  padding-right: 55px;
}

::v-deep .el-table td.el-table__cell,
::v-deep .el-table th.el-table__cell.is-leaf {
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  background-color: #1a2c3fff;
}

::v-deep .el-table td.el-table__cell,
::v-deep .el-table th.el-table__cell.is-leaf {
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  background-color: #1a2c3fff;
}
// 边框
::v-deep .el-table--border {
  border-color: #4eece2ff;
}

// 暂无数据
::v-deep .el-table__empty-block {
  background-color: #1a2c3fff;
}

// 每一行的背景颜色
::v-deep
  .el-table--enable-row-hover
  .el-table__body
  tr:hover
  > td.el-table__cell {
  background-color: #1a2c3fff;
}
// 边框
::v-deep .el-table td.el-table__cell,
::v-deep .el-table th.el-table__cell.is-leaf,
::v-deep .el-table--border th.el-table__cell,
::v-deep .el-table__fixed-right-patch,
::v-deep .el-table--border {
  border-color: #4eece2ff;
}

::v-deep .el-table--border::after,
.el-table--group::after,
.el-table::before {
  background-color: #4eece2ff;
}

// 暂无数据
::v-deep .el-table__empty-block {
  background-color: #1a2c3fff;
}
</style>