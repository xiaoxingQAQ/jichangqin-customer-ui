<template>
  <el-dialog width="500px" :title="title" :visible.sync="dialogVisible">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="告警类型" prop="name">
        <el-select
          v-model="form.name"
          placeholder="请选择警情等级"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="告警时段" required>
        <el-col :span="11">
          <el-form-item prop="startTime">
            <el-time-select
              placeholder="起始时间"
              v-model="form.startTime"
              :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30',
              }"
              style="width: 100%"
            >
            </el-time-select>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="endTime">
            <el-time-select
              placeholder="结束时间"
              v-model="form.endTime"
              :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30',
                minTime: form.startTime,
              }"
              style="width: 100%"
            >
            </el-time-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="告警区域" prop="area">
        <el-select
          v-model="form.area"
          placeholder="请选择告警区域"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="警情等级" prop="grade">
        <el-select
          v-model="form.grade"
          placeholder="请选择警情等级"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in options3"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="处置要求" prop="require_1">
        <el-select
          v-model="form.require_1"
          placeholder="请选择处置要求"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in options4"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
       <el-form-item label="推送要求" prop="require_2">
        <el-select
          v-model="form.require_2"
          placeholder="请选择推送要求"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in options5"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
       <el-form-item label="超时上报" prop="reported">
        <el-select
          v-model="form.reported"
          placeholder="请选择超时上报"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in options6"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false"> 取 消 </el-button>
      <el-button
        type="primary"
        @click="dialogStatus === 'create' ? createData() : updateData()"
      >
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
const options = [{ label: "烟火检测", value: 1 }];
const options2 = [{ label: "油管区", value: 1 }];
const options3 = [{ label: "严重", value: 1 }];
const options4 = [{ label: "必须处理", value: 1 }];
const options5 = [{ label: "集团", value: 1 }];
const options6 = [{ label: "60", value: 1 }];
export default {
  data() {
    return {
      title: "",
      dialogStatus: "",
      dialogVisible: false,
      form: {
        id: undefined,
        name: "",
        startTime: "",
        endTime: "",
        area: "",
        grade: "",
        require_1: "",
        require_2: "",
        reported: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "请选择告警类型",
            trigger: "change",
          },
        ],
        startTime: [
          {
            required: true,
            message: "请选择开始时间",
            trigger: "change",
          },
        ],
        endTime: [
          {
            required: true,
            message: "请选择结束时间",
            trigger: "change",
          },
        ],
        area: [
          {
            required: true,
            message: "请选择告警区域",
            trigger: "change",
          },
        ],
        grade: [
          {
            required: true,
            message: "请选择警情等级",
            trigger: "change",
          },
        ],
        require_1: [
          {
            required: true,
            message: "请选择处置要求",
            trigger: "change",
          },
        ],
        require_2: [
          {
            required: true,
            message: "请选择推送要求",
            trigger: "change",
          },
        ],
        reported: [
          {
            required: true,
            message: "请选择超时上报",
            trigger: "change",
          },
        ],
      },
      options: options,
      options2: options2,
      options3: options3,
      options4: options4,
      options5: options5,
      options6: options6,
    };
  },
  methods: {
    resetForm() {
      this.form = {
        id: undefined,
        name: "",
        startTime: "",
        endTime: "",
        area: "",
        grade: "",
        require_1: "",
        require_2: "",
        reported: "",
      };
    },
    handleCreate(title) {
      this.resetForm();
      this.title = title || "新增";
      this.dialogStatus = "create";
      this.dialogVisible = true;
      this.$nextTick(() => {
        const form = this.$refs.form;
        form && form.clearValidate();
        // form && form.resetFields()
      });
    },
    createData() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.id = parseInt(Math.random() * 100) + 1024; // mock a id
          createArticle(this.form).then(() => {
            this.list.unshift(this.form);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Created Successfully",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleUpdate(row, title) {
      console.log(row);
      this.form = Object.assign({}, row); // copy obj
      this.title = title || "编辑";
      this.dialogStatus = "update";
      this.dialogVisible = true;
      const form = this.$refs.form;
      form && form.clearValidate();
    },
    updateData() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.form);
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.form.id);
            this.list.splice(index, 1, this.form);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Update Successfully",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
  },
};
</script>
<style scoped>
::v-deep label {
  font-weight: normal;
}
.dialog-footer {
  text-align: center;
}
.line {
  text-align: center;
}
</style>
