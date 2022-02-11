<template>
  <el-dialog width="500px" :title="title" :visible.sync="dialogVisible">
    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
      <el-form-item label="档案库名称" prop="name">
        <el-input placeholder="请输入档案库名称" v-model="form.name"></el-input>
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

export default {
  data() {
   
    return {
      title: "",
      dialogStatus: "",
      dialogVisible: false,
      form: {
        id: undefined,
        name: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetForm() {
      this.form = {
        id: undefined,
        name: "",
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
