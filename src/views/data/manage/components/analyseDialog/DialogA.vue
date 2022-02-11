<template>
  <div>
    <el-dialog
      title="事件处置"
      :visible.sync="visible"
      width="50%"
      :before-close="handleCancel"
      class="impotDialog first"
    >
      <div class="dialog_con">
        <header>
          <div class="left" @dblclick="handlePreview(cur_data.eventSnapPic)">
            <el-image
              @error="handleErr(cur_data, cur_data.eventSnapPic, 5)"
              class="image"
              :src="cur_data.eventSnapPic"
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
          <div>
            <span>{{ cur_data.cameraName + ' ' + cur_data.address }}</span>
            <b>{{ cur_data.createTime }}</b>
          </div>

          <el-button :type="setType_1(cur_data)">
            {{ setType_1_a(cur_data) }}
          </el-button>
        </footer>
      </div>
      <span slot="footer" class="footer clear_fix">
        <el-button
          v-if="show_detail"
          :class="{ tran: false }"
          type="success"
          @click="lookDetail"
          :loading="loading_detail"
          >处置详情</el-button
        >
        <template v-else>
          <el-button @click="handleReported">事件上报</el-button>
          <el-button @click="handleScene">现场处理</el-button>
        </template>
        <el-button type="primary" @click="handleCancel" :class="{ tran: false }"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 事件上报的dialog -->
    <el-dialog
      :title="show_detail ? '事件上报详情' : '事件上报'"
      :visible.sync="visible_1"
      width="40%"
      top="30%"
      center
      :before-close="handleClose_1"
      :modal="false"
      class="reported unique"
    >
      <span class="title">{{
        show_detail ? '本次事件的处理方式：' : '上报本次事件：'
      }}</span>
      <div class="main">
        <p>上报部门：</p>
        <el-checkbox @change="handleChange" v-model="checkList" :label="1"
          >集团上级部门</el-checkbox
        >
        <el-checkbox @change="handleChange" v-model="checkList" :label="2"
          >政府监管部门</el-checkbox
        >
      </div>
      <div slot="footer">
        <el-button type="primary" @click="handleOk_1">{{
          show_detail ? '修 改' : '保 存'
        }}</el-button>
        <el-button type="danger" @click="handleClose_1">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 现场处理的dialog -->
    <el-dialog
      :title="show_detail ? '现场处理详情' : '现场处理'"
      :visible.sync="visible_2"
      width="40%"
      top="30%"
      center
      :before-close="handleClose_2"
      :modal="false"
      class="scene unique"
    >
      <div class="top">
        <div class="title">文字记录：</div>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="文字记录..."
          v-model="textarea"
          class="scene unique"
        >
        </el-input>
      </div>
      <div class="bottom">
        <div class="title">快速选择：</div>
        <el-checkbox @change="handleChange" v-model="checkList_1" :label="3"
          >有效告警</el-checkbox
        >
        <el-checkbox @change="handleChange" v-model="checkList_1" :label="4"
          >无效告警</el-checkbox
        >
      </div>

      <div slot="footer">
        <el-button type="primary" @click="handleOk_2">{{
          show_detail ? '修 改' : '保 存'
        }}</el-button>
        <el-button type="danger" @click="handleClose_2">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 预览图片的dialog -->
    <el-dialog
      title="预览图片"
      :visible.sync="visible_preview"
      center
      top="50px"
      width="80%"
    >
      <img style="max-width: 100%" :src="imageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { handleWarning, getWarningDet } from '@/api/data/alarmManage';

export default {
  props: {
    visible: {
      type: Boolean,
    },
    cur_data: Object,
    isHome: Boolean,
  },
  data() {
    return {
      loading_detail: false,
      imageUrl: null,
      visible_preview: false,
      /* 事件上报 */
      show_detail: false,
      // 多选
      checkList: [],
      checked_1: false,
      checked_2: false,

      // 事件上报
      visible_1: false,
      // 现场处理
      visible_2: false,

      /* 现场处理 */
      textarea: null,
      checkList_1: [],
    };
  },
  watch: {
    cur_data: {
      handler(val) {
        const handleStatus = val.handleStatus;
        if (handleStatus == '1') {
          return (this.show_detail = true);
        } else {
          return (this.show_detail = false);
        }
      },
      deep: true,
    },
  },
  methods: {
    // 处理打开
    handleOpen() {
      this.$emit('open');
    },
    // 处理关闭
    handleCancel() {
      this.$emit('cancel');
    },
    /* 打开事件上报dialog */
    handleReported() {
      this.checkList.push(1)
      this.visible_1 = true;
      this.handleCancel();
    },
    // 处理关闭
    handleClose_1() {
      this.checkList = [];
      this.visible_1 = false;
      this.handleOpen();
    },
    // 处理保存
    handleOk_1() {
      if (this.checkList.length == 0) return this.$message.info('请选择');
      const handleType = this.checkList[0];
      const alarmMessageId = this.cur_data.id;
      const eventCode = this.cur_data.eventCode;
      const orgId = this.cur_data.orgId;
      let handleContent;
      if (handleType == 1) {
        handleContent = '集团上级部门';
      } else {
        handleContent = '政府监管部门';
      }
      const data = {
        orgId,
        alarmMessageId,
        eventCode,
        handleContent,
        handleOption: 'report',
        handleType,
      };
      // 发送请求
      handleWarning(data).then((res) => {
        console.log('事件上报', res);
        if (res.code === 200) {
          this.$message.success('上报成功');
          this.handleClose_1();
          this.$emit('refreshList');
          if (this.isHome) {
            this.$bus.$emit('refreshFooter');
          }
          this.handleCancel();
        } else {
          this.$message.error('上报失败');
        }
      });
    },

    // 打开现场处理dialog
    handleScene() {
      this.textarea = '我已查阅，知晓本次事件的全部内容。';
      this.checkList_1.push(3)
      this.visible_2 = true;
      this.handleCancel();
    },
    // 处理关闭 现场处理dialog
    handleClose_2() {
      this.textarea = null;
      this.checkList_1 = [];
      this.visible_2 = false;
      this.handleOpen();
    },
    // 处理保存
    handleOk_2() {
      if (this.checkList_1.length == 0) return this.$message.info('请选择');
      let handleType = this.checkList_1[0];
      const handleContent = this.textarea;
      const alarmMessageId = this.cur_data.id;
      const eventCode = this.cur_data.eventCode;

      const data = {
        alarmMessageId,
        eventCode,
        handleType,
        handleContent,
        handleOption: 'handle',
      };
      // 发送请求
      handleWarning(data).then((res) => {
        console.log('现场处理', res);
        if (res.code === 200) {
          this.$message.success('处理成功！');
          this.handleClose_2();
          this.$emit('refreshList');
          if (this.isHome) {
            this.$bus.$emit('refreshFooter');
          }
          this.handleCancel();
        } else {
          this.$message.error('处理失败！');
        }
      });
    },
    // 查看详情
    lookDetail() {
      this.loading_detail = true;
      const id = this.cur_data.id;
      // 请求
      getWarningDet(id).then((res) => {
        console.log('查看处理后的详情', res);
        if (res.code === 200) {
          const handleOption = res.data.handleOption;
          const handleType = res.data.handleType;
          const handleContent = res.data.handleContent;
          switch (handleOption) {
            case 'report':
              this.handleCancel();
              this.visible_1 = true;
              this.checkList.push(handleType);
              break;
            case 'handle':
              this.handleCancel();
              this.visible_2 = true;
              this.textarea = handleContent;
              this.checkList_1.push(handleType);
              break;
          }
        }
        this.loading_detail = false;
      });
    },

    // 处理多选发生变化
    handleChange() {
      if (this.checkList.length > 1) {
        this.checkList.splice(0, 1);
      }

      if (this.checkList_1.length > 1) {
        this.checkList_1.splice(0, 1);
      }
    },

    // 设置按钮类型
    setType_1(item) {
      switch (item.eventCode) {
        case 'face':
          return 'primary';
        case 'fire':
          return 'danger';
        case 'phone':
          return 'info';
        case 'smoking':
          return 'warning';
        case 'extinguisher':
          return 'info';
        case 'box':
          return 'info';
        case 'car':
          return 'info';
        case 'vehicle':
          return 'primary';
        case 'riding':
          return 'primary';
        case 'personnel_sleepling_post':
          return 'warning';
        case 'service_leaving':
          return 'warning';
        case 'job_leaving':
          return 'warning';
        case 'supervisor_off_duty':
          return 'warning';
        case 'helmet_detection':
          return 'warning';
        case 'oil_unloading_and_off_duty':
          return 'warning';
        case 'smoke':
          return 'danger';
        case 'person_leave':
          return 'warning';
        case 'person':
          return 'danger';
        default:
          return '';
      }
    },

    setType_1_a(item) {
      switch (item.eventCode) {
        case 'face_captured':
          return '人脸抓拍';
        case 'fire':
          return '烟火检测';
        case 'phone':
          return '使用手机';
        case 'smoking':
          return '吸烟检测';
        case 'extinguisher':
          return '设备监控';
        case 'box':
          return '物品占道';
        case 'car':
          return '车辆占道';
        case 'vehicle':
          return '车辆抓拍';
        case 'riding':
          return '骑行抓拍';
        case 'personnel_sleepling_post':
          return '人员睡岗';
        case 'service_leaving':
          return '服务离岗';
        case 'job_leaving':
          return '作业离岗';
        case 'supervisor_off_duty':
          return '主管脱岗';
        case 'helmet_detection':
          return '安全帽检测';
        case 'oil_unloading_and_off_duty':
          return '卸油离岗';
        case 'smoke':
          return '烟雾检测';
        case 'person_leave':
          return '人员离岗';
        case 'person':
          return '非法入侵';
        default:
          return '其他类型';
      }
    },
    // 处理图片error
    handleErr(item, imgSrc, count) {
      return
      if (count > 0) {
        setTimeout(() => {
          item.eventSnapPic = imgSrc + `?t+${Math.random()}`;
        }, 900);
      }
    },
    // 双击查看图片
    handlePreview(url) {
      this.imageUrl = url;
      this.visible_preview = true
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  border-bottom: 3px solid #6fe9cf;
}

.dialog_con {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    margin-bottom: 20px;
    .left,
    .right {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 601px;
      height: 338px;

      > div {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .left {
      cursor: pointer;
      image {
        width: 100%;
      }

      img,
      .image,
      .image-slot {
        width: 100%;
        height: 338px;
        background: #eee;
        border-radius: 8px;
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
      font-weight: 500;
      line-height: 14px;
      color: #ffffff;
    }
  }
}
/* footer */
.first ::v-deep .el-dialog__footer {
  height: 55px;
}

.first ::v-deep .el-dialog__footer .footer {
  position: absolute;
  right: 55px;
}
/* 事件上报 */
.unique ::v-deep .el-dialog__header {
  border-bottom: 2px solid #6fe9cf94;
}
.unique ::v-deep .el-dialog__body {
  border: 0 !important;
}

.unique ::v-deep .el-dialog__footer .footer {
  position: absolute;
  right: -55px;
}

.reported {
  .title {
    display: inline-block;
    margin-bottom: 35px;
    font-size: 13px;
    font-weight: 500;
    line-height: 3px;
    color: #ffffff;
  }
  .main {
    display: flex;
    align-items: center;
    p {
      margin-right: 10px;
      font-size: 13px;
      font-weight: 500;
      color: #ffffff;
      transform: translateY(7px);
    }
  }
}

.scene {
  .top {
    margin-bottom: 35px;
    .title {
      transform: translateY(-13px);
    }
  }

  .title {
    margin-right: 10px;
    font-size: 13px;
    font-weight: 500;
    color: #ffffff;
  }
  .top,
  .bottom {
    display: flex;
    align-items: center;
  }
}

::v-deep .el-dialog:not(.is-fullscreen) {
  margin-top: 4vh !important;
}

.unique::v-deep .el-dialog:not(.is-fullscreen) {
  margin-top: 22vh !important;
}
</style>
