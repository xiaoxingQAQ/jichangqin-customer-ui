<template>
  <el-dialog width="500px" :title="title" :visible.sync="dialogVisible">
    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
      <el-form-item label="预警类型" prop="name">
        <el-select
          v-model="form.name"
          placeholder="请选择预警类型"
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
      <el-form-item label="预警内容" prop="area">
        <el-select
          v-model="form.area"
          placeholder="请选择预警内容"
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
      <el-form-item label="历史数据" prop="grade">
        <el-select
          v-model="form.grade"
          placeholder="请选择历史数据"
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
      <el-form-item label="取值范围" prop="require_1">
        <el-select
          v-model="form.require_1"
          placeholder="请选择取值范围"
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
       <el-form-item label="预警线标准" prop="require_2">
        <el-select
          v-model="form.require_2"
          placeholder="请选择预警线标准"
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
const options2 = [{ label: "预警次数过高", value: 1 }];
const options3 = [{ label: "取最近30天平均值", value: 1 }];
const options4 = [{ label: "最近24小时/当天", value: 1 }];
const options5 = [{ label: "5次", value: 1 }];
export default {
  data() {
    return {
      title: "",
      dialogStatus: "",
      dialogVisible: false,
      form: {
        id: undefined,
        name: "",
        area: "",
        grade: "",
        require_1: "",
        require_2: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "请选择告警类型",
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
      },
      options: options,
      options2: options2,
      options3: options3,
      options4: options4,
      options5: options5,
    };
  },
  methods: {
    resetForm() {
      this.form = {
        id: undefined,
        name: "",
        area: "",
        grade: "",
        require_1: "",
        require_2: "",
      };
    },
    handleCreate(title) {
      this.resetForm();
      this.title = title || "新增策略";
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
      this.title = title || "编辑策略";
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
