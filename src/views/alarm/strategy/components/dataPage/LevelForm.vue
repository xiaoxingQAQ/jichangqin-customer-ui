<template>
  <el-dialog width="500px" :title="title" :visible.sync="dialogVisible">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="警情等级" prop="level">
        <el-select
          v-model="form.level"
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
      <el-form-item label="名称定义" v-if="form.level"></el-form-item>
      <el-form-item label="一级" prop="one" v-if="twoLevel">
        <el-input v-model="form.one" placeholder="请输入一级名称"></el-input>
      </el-form-item>
      <el-form-item label="二级" prop="two" v-if="twoLevel">
        <el-input v-model="form.two" placeholder="请输入二级名称"></el-input>
      </el-form-item>
      <el-form-item label="三级" prop="three" v-if="threeLevel">
        <el-input placeholder="请输入三级名称" v-model="form.three"></el-input>
      </el-form-item>
      <el-form-item label="四级" prop="four" v-if="fourLevel">
        <el-input placeholder="请输入四级名称" v-model="form.four"></el-input>
      </el-form-item>
      <el-form-item label="五级" prop="five" v-if="fiveLevel">
        <el-input placeholder="请输入五级名称" v-model="form.five"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="dialogStatus === 'create' ? createData() : updateData()"
      >
        确 定
      </el-button>
      <el-button type="danger" @click="dialogVisible = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
// const options = [{ label: "1", value: 1 }];
import { getAlarmLevel, getAlarmLevelList } from "@/api/alarm/alarm";
export default {
  data() {
    return {
      level2: false,
      level3: false,
      level4: false,
      level5: false,
      title: "",
      dialogStatus: "",
      dialogVisible: false,
      form: {
        id: null,
        level: null,
        one: "",
        two: "",
        three: "",
        four: "",
        five: "",
      },
      rules: {
        level: [
          {
            required: true,
            message: "请选择警情等级",
            trigger: "change",
          },
        ],
        one: [
          {
            required: true,
            message: "请输入一级警情",
            trigger: "blur",
          },
        ],
        two: [
          {
            required: true,
            message: "请输入二级警情",
            trigger: "blur",
          },
        ],
        three: [
          {
            required: true,
            message: "请输入三级警情",
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
      },
      options: [
        { value: 2, label: 2 },
        { value: 3, label: 3 },
        { value: 4, label: 4 },
        { value: 5, label: 5 },
      ],
      orgId: "",
    };
  },
  created() {
    this.orgId = this.$store.getters.info.user.orgId;
    this.getAlarmLevelList();
  },
  computed: {
    twoLevel() {
      switch (this.form.level) {
        case 2:
          return true
        case 3:
          return true
        case 4:
          return true
        case 5:
          return true
      }
    },
    threeLevel() {
      switch (this.form.level) {
        case 3:
          return true
        case 4:
          return true
        case 5:
          return true
      }
    },
    fourLevel() {
      switch (this.form.level) {
        case 4:
          return true
        case 5:
          return true
      }
    },
    fiveLevel() {
      switch (this.form.level) {
        case 5:
          return true
      }
    },
  },
  methods: {
    getAlarmLevelList() {
      getAlarmLevelList({ orgId: this.orgId }).then((res) => {
        this.options = res.rows
      });
    },
    resetForm() {
      this.form = {
        id: null,
        level: null,
        one: "",
        two: "",
        three: "",
        four: "",
        five: "",
      };
    },
    handleCreate(title) {
      this.resetForm();
      this.title = title || "警情等级定义";
      this.dialogStatus = "create";
      this.dialogVisible = true;
      getAlarmLevel({ orgId: this.$store.getters.info.user.orgId }).then(res => {
      })


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
      this.form.three = this.form.dept.three;
      this.form.leader = this.form.dept.leader;
      this.form.two = this.form.one;
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
