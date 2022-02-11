<template>
  <el-dialog
    width="640px"
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    @open="handleOpen"
  >
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="机构名称" prop="orgId">
        <treeselect
          v-model="form.orgId"
          :options="deptOptions"
          :show-count="true"
          :flat="true"
          :default-expand-level="2"
          placeholder="选择机构名称"
        />
      </el-form-item>
      <el-form-item label="告警名称" prop="algorithmId">
        <el-select
          v-model="form.algorithmId"
          placeholder="请选择告警名称"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="告警类型" prop="categoryId">
        <el-select
          v-model="form.categoryId"
          placeholder="请选择告警类型"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in options7"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="告警周期">
        <el-select
          v-model="form.week"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="全部"
          style="width: 100%"
        >
          <el-option
            v-for="item in options8"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="告警时段">
        <el-col :span="11">
          <el-form-item prop="startTime">
            <el-time-select
              placeholder="00:00"
              v-model="form.startTime"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '24:00',
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
              placeholder="24:00"
              v-model="form.endTime"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '24:00',
                minTime: form.startTime,
              }"
              style="width: 100%"
            >
            </el-time-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="告警区域" prop="region">
        <el-select
          v-model="form.region"
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
      <el-form-item label="警情等级" prop="levelId">
        <el-select
          v-model="form.levelId"
          placeholder="请选择警情等级"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in options3"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="处置要求" prop="handle">
        <el-select
          v-model="form.handle"
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
      <el-form-item label="推送要求" prop="pushRequest">
        <el-select
          v-model="form.pushRequest"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择推送要求"
          style="width: 100%"
        >
          <el-option
            v-for="item in options5"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="超时上报" prop="reported">
        <el-input v-model="form.timeoutLimit" placeholder="时间(秒)"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="dialogStatus === 'create' ? createData() : updateData()"
      >
        确 定
      </el-button>
      <el-button type="danger" @click="handleClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
const options2 = [{ label: "全部", value: 1 }];
const options4 = [
  { label: "必须处理", value: true },
  { label: "无须处理", value: false },
];
const options5 = [
  { label: "集团", value: 1 },
  { label: "油站", value: 2 },
];
const options6 = [{ label: "60", value: 1 }];
const options8 = [
  { value: "1", label: "周一" },
  { value: "2", label: "周二" },
  { value: "3", label: "周三" },
  { value: "4", label: "周四" },
  { value: "5", label: "周五" },
  { value: "6", label: "周六" },
  { value: "0", label: "周日" },
];
import { getAlgorithmList } from "@/api/device/algorithm";
import { getAlarmLevel, getAlarmType, saveAlarm } from "@/api/alarm/alarm";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapGetters } from 'vuex';
export default {
  components: { Treeselect },
  data() {
    return {
      /* 组织树数据 */
      deptOptions: [],
      title: "",
      dialogStatus: "",
      dialogVisible: false,
      form: {
        orgId: null,
        id: null,
        name: null,
        algorithmId: null,
        categoryId: null,
        categoryName: "",
        categoryCode: "",
        week: [],
        startTime: "",
        endTime: "",
        region: 1,
        levelId: "",
        levelName: "",
        level: "",
        handle: null,
        pushRequest: [1, 2],
        timeoutLimit: "",
      },
      rules: {
        orgId: [
          { required: true, message: '请选择机构', trigger: 'blur' }
        ],
        algorithmId: [
          {
            required: true,
            message: "请选择告警名称",
            trigger: "change",
          },
        ],
        categoryId: [
          {
            required: true,
            message: "请选择告警类型",
            trigger: "change",
          },
        ],
        // startTime: [
        //   {
        //     required: false,
        //     message: "请选择开始时间",
        //     trigger: "change",
        //   },
        // ],
        // endTime: [
        //   {
        //     required: false,
        //     message: "请选择结束时间",
        //     trigger: "change",
        //   },
        // ],
        region: [
          {
            required: false,
            message: "请选择告警区域",
            trigger: "change",
          },
        ],
        levelId: [
          {
            required: true,
            message: "请选择警情等级",
            trigger: "change",
          },
        ],
        handle: [
          {
            required: true,
            message: "请选择处置要求",
            trigger: "change",
          },
        ],
        pushRequest: [
          {
            required: true,
            message: "请选择推送要求",
            trigger: "change",
          },
        ],
        timeoutLimit: [
          {
            required: true,
            message: "请选择超时上报",
            trigger: "change",
          },
        ],
      },
      options: [],
      options2: options2,
      options3: [],
      options4: options4,
      options5: options5,
      options6: options6,
      options7: [],
      options8: options8,
    };
  },
  computed: {
    ...mapGetters(['info']),
    orgId() {
      return this.info.user.orgId;
    },
  },
  created() {
    this.deptOptions = this.info.deptPermission;
    this.form.orgId = this.deptOptions[0].id
    this.getAlgorithmList();
    this.getAlarmLevel();
    this.getAlarmType();
  },
  watch: {
    form: {
      handler(val) {
        console.log(val);
      },
      deep: true
    },
  },
  methods: {
    // 打开弹窗回调
    handleOpen() {
      this.getAlarmLevel();
    },
    getAlgorithmList() {
      getAlgorithmList({ orgId: this.orgId }).then((res) => {
        this.options = res.data;
      });
    },
    getAlarmLevel() {
      getAlarmLevel({ orgId: this.orgId }).then((res) => {
        this.options3 = res.data;
      });
    },
    getAlarmType() {
      getAlarmType({ orgId: this.orgId }).then((res) => {
        this.options7 = res.data;
      });
    },
    /* 禁用type为1的节点 */
    normalizer(node) {
      return {
        id: node.id,
        label: node.label,
        children: node.children,
        isDisabled: node.type == "1" ? true : false,
      };
    },
    resetForm() {
      this.form = {
        orgId: this.deptOptions[0].id,
        id: null,
        name: null,
        algorithmId: null,
        eventSource: "",
        categoryId: null,
        categoryName: "",
        categoryCode: "",
        week: [],
        startTime: "",
        endTime: "",
        region: 1,
        levelId: "",
        levelName: "",
        level: "",
        handle: null,
        pushRequest: [1, 2],
        timeoutLimit: "",
      };
    },
    handleClose() {
      this.resetForm();
      this.dialogVisible = false
    },
    handleCreate2(title) {
      console.log(this.form);
      this.title = title || "新增";
      this.dialogStatus = "create";
      this.dialogVisible = true;
      this.$nextTick(() => {
        const form = this.$refs.form;
        form && form.clearValidate();
        form && form.resetFields()
      });
      console.log(this.form);
      this.resetForm()
    },
    createData() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.filterForm();
          this.form.week = this.form.week ? this.form.week : '1,2,3,4,5,6,0'
          this.form.startTime = this.form.startTime ? this.form.startTime : '00:00'
          this.form.endTime = this.form.endTime ? this.form.endTime : '24:00'
          saveAlarm(this.form).then((res) => {
            this.dialogVisible = false;
            this.$notify({
              title: "Success",
              message: "添加成功",
              type: "success",
              duration: 2000,
            });
            // this.$parent.getList();
            this.resetForm();
            this.$emit('immediateAlarmAdd')
          });
        }
      });
    },
    handleUpdate(row, title) {
      console.log(row);
      row.region = 1
      row.pushRequest = [1, 2],
        this.form = Object.assign({}, row); // copy obj
      this.form.week = this.form.week ? this.form.week.split(",") : []
      this.title = title || "编辑";
      this.dialogStatus = "update";
      this.dialogVisible = true;
      const form = this.$refs.form;
      form && form.clearValidate();
    },
    updateData() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.filterForm();
          const formData = Object.assign({}, this.form);
          saveAlarm(formData).then((res) => {
            this.dialogVisible = false;
            this.$notify({
              title: "Success",
              message: "编辑成功",
              type: "success",
              duration: 2000,
            });
            // this.$parent.getList();
            this.resetForm();
            this.$emit('immediateAlarmAdd')
          });
        }
      });
    },
    filterForm() {
      this.options.map((option) => {
        if (this.form.algorithmId === option.id) {
          this.form.name = option.name;
          this.form.eventSource = option.code;
        }
      });
      this.options7.map((option) => {
        if (this.form.categoryId === option.id) {
          this.form.categoryName = option.name;
          this.form.categoryCode = option.value
        }
      });
      this.options3.map((option) => {
        if (this.form.levelId === option.id) {
          this.form.levelName = option.name;
          this.form.level = option.level;
        }
      });
      if (this.form.week) {
        this.form.week.length && (this.form.week = this.form.week.toString());
        !this.form.week.length && (this.form.week = "");
      }
      console.log("过滤后的form", this.form);
    },
    delayWork() {

    }
  },
};
</script>
<style lang="scss" scoped>
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
