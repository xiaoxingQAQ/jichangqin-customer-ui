<template>
  <el-dialog
    title="人脸注册"
    :visible.sync="visible_2"
    width="30%"
    :before-close="handleCancel_2"
  >
    <div class="register">
      <div class="upload">
        <a-upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          list-type="picture-card"
          :file-list="[]"
          @preview="handlePreview"
          @change="handleChange"
        >
          <div v-if="[].length < 1">
            <a-icon type="plus" />
            <div style="font-weight: 500" class="ant-upload-text">上传图片</div>
          </div>
        </a-upload>
        <!-- <el-button type="primary">上传图片</el-button> -->
      </div>
      <div>
        <el-form
          :model="Form_1"
          :rules="FormRules_1"
          ref="Form_1"
          label-position="right"
          label-width="80px"
          class="Form_1"
        >
          <el-form-item label="姓名：" prop="name">
            <el-input size="small" v-model="Form_1.name"></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop="sex">
            <div class="select">
              <!-- 查询 -->
              <el-select
                @visible-change="onChange"
                size="small"
                v-model="Form_1.sex"
                placeholder="请选择"
              >
                <el-option label="男" value="nan"></el-option>
                <el-option label="女" value="nu"></el-option>
              </el-select>
              <div :class="['before', { change: isChange }]">
                <i class="iconfont icon-daosanjiaoxing"></i>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="籍贯：" prop="nativePlace">
            <div class="select">
              <!-- 查询 -->
              <el-select
                @visible-change="onChange"
                size="small"
                v-model="Form_1.sex"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <div :class="['before', { change: isChange }]">
                <i class="iconfont icon-daosanjiaoxing"></i>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="证件号码：" prop="IDNumber">
            <el-input size="small" t v-model="Form_1.IDNumber"></el-input>
          </el-form-item>
          <el-form-item label="地址：" prop="address">
            <el-input size="small" v-model="Form_1.address"></el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input
              size="small"
              type="textarea"
              v-model="Form_1.remark"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button style="margin-right: 130px" type="primary" @click="handleOk_2"
        >保 存</el-button
      >
      <el-button type="danger" @click="handleCancel_2">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible_2: {
      type: Boolean
    },
    list: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ], // 籍贯数据
      isChange: false,
      Form_1: {
        name: null,
        sex: null,
        nativePlace: null, // 籍贯
        IDNumber: null, // 证件号码
        address: null, // 地址
        remark: null // 备注
      },
      FormRules_1: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        sex: [{ required: true, message: "请输选择性别", trigger: "blur" }],
        nativePlace: [
          { required: true, message: "请输选择籍贯", trigger: "blur" }
        ],
        IDNumber: [
          { required: true, message: "请输入证件号码", trigger: "blur" }
        ],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        remark: [{ required: false, message: "请输入备注", trigger: "blur" }]
      }
    };
  },
  methods: {
    onChange() {
      this.isChange = !this.isChange;
    },
    handleCancel_2() {
      this.$emit("changeB");
    },
    // 处理·批量导入框·保存
    handleOk_2() { },

    // 处理预览
    async handlePreview(file) {
      this.AddDialogVisible = false;
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    // 处理状态 改变
    handleChange({ file, fileList }) {
      console.log(file);
      this.fileList = fileList;
      if (file.response) this.updateForm.attachmentID = file.response.data.id;
    }
  }
};
</script>

<style lang="scss" scoped>
// 人脸注册dislog
.register {
  width: 100%;
  height: 340px;
  display: flex;
  justify-content: space-around;
  .upload {
    display: flex;
    flex-direction: column;
    align-items: center;
    // ant upload 的大小
    ::v-deep .ant-upload {
      margin-bottom: 20px;
      width: 175px;
      height: 175px;
      border-radius: 8px;
    }
  }
  .select {
    position: relative;
  }
  .before {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 13px;
    left: 180px;
    width: 13px;
    height: 13px;

    transition: 0.5s;
    -moz-transition: -moz-transform 0.5s; /* Firefox 4 */
    -webkit-transition: -webkit-transform 0.5s; /* Safari and Chrome */
    -o-transition: -o-transform 0.5s; /* Opera */
    i {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }

  .change {
    -moz-transform: rotateZ(180deg);
    -webkit-transform: rotateZ(180deg);
    -o-transform: rotateZ(180deg);
    transform: rotateZ(180deg);
    filter: FlipV;
  }
}

/* Upload */
::v-deep .ant-upload.ant-upload-select-picture-card {
  background-color: transparent !important;
  border-color: #3bffcdff !important;
}

::v-deep .anticon svg,
.ant-upload-text {
  color: #fff !important;
}
::v-deep .el-dialog__footer {
  display: flex !important;
  justify-content: space-around !important;
}
</style>