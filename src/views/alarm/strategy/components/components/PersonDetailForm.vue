<template>
  <el-dialog width="700px" :title="title" :visible.sync="dialogVisible">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="姓名" prop="userName">
            <el-input
              placeholder="请输入姓名"
              v-model="form.userName"
            ></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select
              v-model="form.sex"
              placeholder="请选择性别"
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
          <el-form-item label="部门" prop="depart">
            <el-input placeholder="请输入部门" v-model="form.depart"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="phonenumber">
            <el-input
              placeholder="请输入联系方式"
              v-model="form.phonenumber"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="编号" prop="serialNumber">
            <el-input
              v-model="form.serialNumber"
              placeholder="请输入编号"
            ></el-input>
          </el-form-item>
          <el-form-item label="证件号码" prop="IDCard">
            <el-input
              placeholder="请输入证件号码"
              v-model="form.IDCard"
            ></el-input>
          </el-form-item>
          <el-form-item label="职位" prop="position">
            <el-input
              placeholder="请输入职位"
              v-model="form.position"
            ></el-input>
          </el-form-item>
          <el-form-item label="人车绑定" prop="car">
            <el-select
              v-model="form.car"
              placeholder="请选择人车绑定"
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
        </el-col>
      </el-row>

      <el-form-item label="车牌" prop="plate">
        <el-input placeholder="请输入车牌" v-model="form.plate"></el-input>
      </el-form-item>
      <el-form-item label="入职时间" prop="goTime">
        <el-date-picker
          v-model="form.goTime"
          type="datetime"
          placeholder="选择入职时间"
        >
        </el-date-picker>
      </el-form-item>
       <el-form-item label="车牌" prop="photos">
        <upload></upload>
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
import Upload from "./Upload"
const options = [{ label: "男", value: 1 }, { label: "女", value: 0 }];
const options2 = [{ label: "是", value: 1 }, { label: "否", value: 0 }];

export default {
  components: {
    Upload
  },
  data() {
    return {
      title: "",
      dialogStatus: "",
      dialogVisible: false,
      form: {
        id: undefined,
        userName: "",
        sex: 1,
        depart: "",
        phonenumber: "",

        serialNumber: "",
        IDCard: "",
        position: "",
        car: 1,

        plate: "",
        goTime: '',
        photos: []
      },
      rules: {
        userName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
        ],
        sex: [
          {
            required: true,
            message: "请选择性别",
            trigger: "change",
          },
        ],
        depart: [
          {
            required: true,
            message: "请再次输入密码",
            trigger: "blur",
          },
        ],
        phonenumber: [
          {
            required: true,
            message: "请输入联系方式",
            trigger: "blur",
          },
        ],

        serialNumber: [
          {
            required: true,
            message: "请输入编号",
            trigger: "blur",
          },
        ],
        IDCard: [
          {
            required: true,
            message: "请输入证件号码",
            trigger: "blur",
          },
        ],
        position: [
          {
            required: true,
            message: "请输入职位",
            trigger: "blur",
          },
        ],
        car: [
          {
            required: true,
            message: "请选择人车绑定",
            trigger: "change",
          },
        ],

        plate: [
          {
            required: true,
            message: "请输入车牌",
            trigger: "blur",
          },
        ],
        goTime: [
          {
            required: true,
            message: "请选择入职时间",
            trigger: "change",
          },
        ],
        photos: [
           {
            required: true,
            message: "请上传人脸录入",
            trigger: "change",
          },
        ]
      },
      options: options,
      options2: options2
    };
  },
  methods: {
    resetForm() {
      this.form = {
       id: undefined,
        userName: "",
        sex: 1,
        depart: "",
        phonenumber: "",
        serialNumber: "",
        IDCard: "",
        position: "",
        car: 1,
        plate: "",
        goTime: '',
        photos: []
      };
    },
    handleCreate(title) {
      this.resetForm();
      this.title = title || "新建";
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
          this.form.author = "vue-element-admin";
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
      this.form.deptName = this.form.dept.deptName;
      this.form.depart = this.form.dept.depart;
      this.form.checkPass = this.form.password;
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
</style>
