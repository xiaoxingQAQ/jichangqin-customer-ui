<template>
  <el-dialog
    width="460px"
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="警情等级" prop="level">
        <el-select
          v-model="form.levelId"
          placeholder="请选择警情等级"
          @change="handleLevelChange"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.num"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="一级" prop="one" v-if="oneLevel">
        <el-input
          v-model="form.one.name"
          @change="handleAlarm(form.one, 1)"
          placeholder="请输入一级名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="二级" prop="two" v-if="twoLevel">
        <el-input
          v-model="form.two.name"
          @change="handleAlarm(form.two, 2)"
          placeholder="请输入二级名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="三级" prop="three" v-if="threeLevel">
        <el-input
          v-model="form.three.name"
          @change="handleAlarm(form.three, 3)"
          placeholder="请输入三级名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="四级" prop="four" v-if="fourLevel">
        <el-input
          v-model="form.four.name"
          @change="handleAlarm(form.four, 4)"
          placeholder="请输入四级名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="五级" prop="five" v-if="fiveLevel">
        <el-input
          v-model="form.five.name"
          @change="handleAlarm(form.five, 5)"
          placeholder="请输入五级名称"
        ></el-input>
      </el-form-item>
      <div style="margin-left: 10px">
        <span style="font-weight: 500">注：</span>
        <span style="font-weight: 800">默认等级一级最高,依次降低</span>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleOk"> 确 定 </el-button>
      <el-button type="danger" @click="handleClose"> 关 闭 </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getAlarmLevelInfo, getAlarmLevelList } from "@/api/alarm/alarm";
import { updateCustumer } from "@/api/alarm/alarm";
export default {
  data() {
    return {
      level2: false,
      level3: false,
      level4: false,
      level5: false,
      title: "",
      dialogVisible: false,
      form: {
        level: null,
        one: {},
        two: {},
        three: {},
        four: {},
        five: {}
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
        four: [
          {
            required: true,
            message: "请输入四级警情",
            trigger: "blur",
          },
        ],
        five: [
          {
            required: true,
            message: "请输入五级警情",
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
      itemList: ['one', 'two', 'three', 'four', 'five']
    };
  },
  created() {
    this.orgId = this.$store.getters.info.user.orgId;
  },
  computed: {
    oneLevel() {
      switch (this.form.level) {
        case 1:
          return true
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
    // 输入等级时触发
    handleAlarm(item, level) {
      item.level = level
      item.orgId = this.$store.getters.info.user.orgId
    },
    handleLevelChange(val) {
      const that = this
      this.options.find((item) => {
        if (item.id === val) {
          that.form.level = item.num
        }
      });
    },
    /* 获取等级数据 */
    getAlarmLevelList() {
      this.$emit('openLoading')
      getAlarmLevelList({ orgId: this.orgId }).then((res) => {
        if (res.code == 200) {
          this.options = res.data
          console.log('res.data: ', res.data);
        }
        this.$emit('closeLoading')
        this.handleCreate()
      });
    },

    reset() {
      this.form = {
        level: null,
        one: {},
        two: {},
        three: {},
        four: {},
        five: {}
      };
      this.resetForm('form')
    },
    handleCreate(title) {
      const that = this
      this.title = title || "警情等级定义";
      this.dialogVisible = true;
      getAlarmLevelInfo({ orgId: this.$store.getters.info.user.orgId }).then(res => {
        that.form.levelId = res.data[0].levelId || '1460060300385476158'
        that.handleLevelChange(that.form.levelId)
        res.data.forEach(item => {
          if (item.level === '1') {
            that.form.one = {
              id: item.id,
              name: item.name,
              orgId: item.orgId,
              level: item.level
            }
          } else if (item.level === '2') {
            that.form.two = {
              id: item.id,
              name: item.name,
              orgId: item.orgId,
              level: item.level
            }
          } else if (item.level === '3') {
            that.form.three = {
              id: item.id,
              name: item.name,
              orgId: item.orgId,
              level: item.level
            }
          } else if (item.level === '4') {
            that.form.four = {
              id: item.id,
              name: item.name,
              orgId: item.orgId,
              level: item.level
            }
          } else if (item.level === '5') {
            that.form.five = {
              id: item.id,
              name: item.name,
              orgId: item.orgId,
              level: item.level
            }
          }
        })
        console.log(res)
      })
      this.$nextTick(() => {
        const form = this.$refs.form;
        form && form.clearValidate();
      });
    },
    handleClose() {
      this.reset()
      this.dialogVisible = false
    },
    handleOk() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let param = {}
          let list = []
          Object.keys(this.form).forEach(item => {
            if (this.itemList.includes(item)) {
              if (this.form[item].level <= this.form.level) {
                this.form[item].levelId = this.form.levelId
                this.form[item].status = 1
                list.push(this.form[item]);
              } else {
                this.form[item].levelId = this.form.levelId
                this.form[item].status = 2
                list.push(this.form[item]);
              }
            }
          })
          param.alarmLevelCustumerList = list
          updateCustumer(param).then((res) => {
            if (res.code == 200) {
              this.$emit('reloadList')
              this.$notify.success('设置成功')
              this.handleClose()
            } else {
              this.$notify.error('设置失败')
            }
          });
        }
      });
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
