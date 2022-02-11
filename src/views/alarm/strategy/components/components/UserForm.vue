<template>
  <el-dialog width="500px" :title="title" :visible.sync="dialogVisible">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="用户名" prop="userName">
        <el-input placeholder="请输入用户名" v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          show-password
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          v-model="form.checkPass"
          show-password
          placeholder="请再次输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select
          v-model="form.role"
          placeholder="请选择角色"
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
      <el-form-item label="用户组" prop="deptName">
        <el-input placeholder="请输入用户组" v-model="form.deptName"></el-input>
      </el-form-item>
      <el-form-item label="负责人" prop="leader">
        <el-input placeholder="请输入负责人" v-model="form.leader"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="phonenumber">
        <el-input
          placeholder="请输入联系方式"
          v-model="form.phonenumber"
        ></el-input>
      </el-form-item>
      <el-form-item label="密保问题" prop="question">
        <el-select
          v-model="form.question"
          placeholder="请选择密保问题"
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
      <el-form-item label="密保答案" prop="answer">
        <el-input placeholder="请输入密保答案" v-model="form.answer"></el-input>
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
const options = [{ label: "管理用户", value: 1 }];

export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value) {
        if (this.form.checkPass !== "") {
          this.$refs.form.validateField("checkPass");
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value) {
        if (value !== this.form.password) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      }
    };
    return {
      title: "",
      dialogStatus: "",
      dialogVisible: false,
      form: {
        id: undefined,
        userName: "",
        password: "",
        checkPass: "",
        role: undefined,
        deptName: "",
        leader: "",
        phonenumber: "",
        question: undefined,
        answer: "",
      },
      rules: {
        userName: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            validator: validatePass,
            trigger: "blur",
          },
        ],
        checkPass: [
          {
            required: true,
            message: "请再次输入密码",
            trigger: "blur",
          },
          {
            validator: validatePass2,
            trigger: "blur",
          },
        ],
        role: [
          {
            required: true,
            message: "请选择角色",
            trigger: "change",
          },
        ],
        deptName: [
          {
            required: true,
            message: "请输入用户组",
            trigger: "blur",
          },
        ],
        leader: [
          {
            required: true,
            message: "请输入负责人",
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
        question: [
          {
            required: true,
            message: "请选择密保问题",
            trigger: "change",
          },
        ],
        answer: [
          {
            required: true,
            message: "请输入密保答案",
            trigger: "blur",
          },
        ],
      },
      options: options,
    };
  },
  methods: {
    resetForm() {
      this.form = {
        id: undefined,
        userName: "",
        password: "",
        checkPass: "",
        role: undefined,
        deptName: "",
        leader: "",
        phonenumber: "",
        question: undefined,
        answer: "",
      };
    },
    handleCreate(title) {
      this.resetForm();
      this.title = title || "新建";
      this.dialogStatus = 'create';
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
      this.form.leader = this.form.dept.leader;
      this.form.checkPass = this.form.password
      this.title = title || "编辑";
      this.dialogStatus = 'update'
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
