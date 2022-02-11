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
          <i class="iconfont icon-tishi">暂无视频</i>
        </div>
      </header>
      <footer>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column
            prop="index"
            label="车辆类型"
            width="80"
          ></el-table-column>
          <el-table-column prop="name" label="口罩"></el-table-column>
          <el-table-column prop="address" label="帽子"></el-table-column>
          <el-table-column prop="address" label="上装"></el-table-column>
          <el-table-column prop="address" label="下装"></el-table-column>
        </el-table>
        <div class="btn">
          <el-button type="primary">骑行抓拍</el-button>
          <el-button type="success">顾客</el-button>
        </div>
      </footer>

      <div class="text">
        <span>一楼门口</span>
        <b>[0]-{{ cur_data.createTime }}</b>
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
      type: Boolean,
    },
    cur_data: Object,
  },
  data() {
    return {
      tableData: [
        {
          index: '电动车',
          date: '2016-05-02',
          name: '王小虎',
          address: '1518 弄',
        },
      ],
    };
  },
  methods: {
    handleCancel() {
      this.$emit('cancel');
    },
    handleOk() {},
    // 处理图片error
    handleErr(item, imgSrc, count) {
      return
      if (count > 0) {
        // this.handleErr(item, imgSrc, count - 1)
        setTimeout(() => {
          item.eventSnapPic = imgSrc + `?t+${Math.random()}`;
        }, 900);
      }
    },
  },
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
      image {
        width: 100%;
        cursor: pointer;
      }

      img,
      .image,
      .image-slot {
        width: 100%;
        height: 338px;
        background: #eee;
        border-radius: 8px 8px 0 0;
      }

      .image,
      .image-slot {
        display: flex;
        justify-content: center;
        align-items: center;

        font-size: 25px;
        font-weight: 500;
        color: #19adca;
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
