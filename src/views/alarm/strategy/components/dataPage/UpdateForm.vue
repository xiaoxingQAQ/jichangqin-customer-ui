<template>
  <el-dialog
    width="650px"
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="dialogVisible"
  >
    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
      <el-form-item label="预警类型" prop="name">
        <el-select
          v-model="form.name"
          placeholder="请选择预警类型"
          clearable
          style="width: 100%"
          @change="changeName"
        >
          <el-option
            v-for="item in options_name"
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
          @change="changeArea"
        >
          <el-option
            v-for="item in form.name === 1 ? options_area : options_area2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="form.name === 2 && form.area"
        label="算法"
        prop="arithmetic"
      >
        <div style="display: flex">
          <span style="white-space: pre"> {{ front }} </span>
          <el-select
            v-model="form.arithmetic"
            placeholder="请选择算法"
            clearable
            style="width: 100%"
            @change="changeEventCode"
          >
            <el-option
              v-for="item in options_alarmName"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <span style="white-space: pre"> {{ medium }}</span>
          <el-time-select
            v-if="form.area === 5"
            placeholder="00:00"
            v-model="form.startTime"
            :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '24:00',
            }"
            style="width: 100%"
          >
          </el-time-select>
          <el-time-select
            v-if="form.area === 5"
            placeholder="24:00"
            v-model="form.entTime"
            :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '24:00',
              minTime: form.startTime,
            }"
            style="width: 100%"
          >
          </el-time-select>
          <span style="white-space: pre"> {{ back }} </span>
        </div>
      </el-form-item>
      <el-form-item label="历史数据" prop="grade">
        <!-- <el-input disabled style="width:100%" v-model="form.grade"> -->
        <!-- </el-input> -->
        <el-select
          v-model="form.grade"
          placeholder="请选择历史数据"
          clearable
          style="width: 100%"
          :disabled="disabledGrade"
          @change="changeGrade"
        >
          <el-option
            v-for="item in options_grade"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="取值范围" prop="require_1">
        <!-- <el-input disabled style="width:100%" v-model="form.require_1">
         </el-input> -->
        <el-select
          v-model="form.require_1"
          placeholder="请选择取值范围"
          clearable
          :disabled="disabledRequire_1"
          style="width: 100%"
        >
          <el-option
            v-for="item in options_require_1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="预警线标准" prop="require_2">
        <div style="display: flex">
          <el-input style="width: 100%" v-model="form.require_2">
            <template slot="prepend">{{ prepend }}</template>
            <template v-if="!disabledAppend" slot="append">{{
              append
            }}</template>
          </el-input>
          <el-select v-if="disabledAppend" v-model="append" placeholder="">
            <el-option
              v-for="item in options_append"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="dialogStatus === 'create' ? createData() : updateData()"
      >
        确 定
      </el-button>
      <el-button type="danger" @click="handleReset">关 闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getAlgorithmList } from "@/api/device/algorithm";
import { getAlarmSaves } from "@/api/alarm/alarm";
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      prepend: "",
      append: "",
      front: "",
      medium: "",
      back: "",
      title: "",
      dialogStatus: "",
      dialogVisible: false,
      disabledAppend: false,
      disabledGrade: false,
      disabledRequire_1: false,
      form: {
        id: "",
        name: "",
        area: "",
        grade: "",
        require_1: "",
        require_2: "",
        arithmetic: "",
        startTime: "",
        entTime: "",
        eventCode: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请选择预警类型",
            trigger: "change",
          },
        ],
        area: [
          {
            required: true,
            message: "请选择预警内容",
            trigger: "change",
          },
        ],
        grade: [
          {
            required: true,
            message: "请输入历史数据",
            trigger: "change",
          },
        ],
        require_1: [
          {
            required: true,
            message: "请输入取值范围",
            trigger: "change",
          },
        ],
        require_2: [
          {
            required: true,
            message: "请输入预警线标准",
            trigger: "change",
          },
        ],
        arithmetic: [
          {
            required: true,
            message: "请选择算法",
            trigger: "change",
          },
        ],
      },
      // 预警类型
      options_name: [
        { label: "账号数据异常", value: 1 },
        { label: "事件告警异常", value: 2 }
      ],
      options_alarmName: [], // 告警名称 算法
      // 历史数据
      options_grade: [
        { label: "无", value: 1 },
        { label: "最近30天平均值", value: 2 }
      ],
      // 取值范围
      options_require_1: [
        { label: "一个小时", value: '1' },
        { label: "当天数据", value: '2' },
        { label: "当月数据", value: '3' }
      ],
      // 账号数据异常
      options_area: [
        { label: "账号综合评分过低", value: 1 },
        { label: "账号警情处置比例过低", value: 2 },
      ],
      optionsA: ['账号综合评分过低', '账号警情处置比例过低'],

      // 事件告警异常
      options_area2: [
        { label: "频繁触发告警", value: 3 },
        { label: "告警高于历史平均值", value: 4 },
        { label: "告警在某时段内高于历史平均值", value: 5 },
        // { label: "告警已超过当天预警上限值", value: 6 },
      ],
      options_append: [
        { label: '次', value: '次' },
        { label: '%', value: '%' }
      ]
    };
  },
  computed: {
    ...mapGetters(['info']),
    orgId() {
      return this.$store.getters.info.user.orgId;
    },
  },
  created() {
    this.getAlgorithmList()
  },
  methods: {
    // 获取告警名称
    getAlgorithmList() {
      getAlgorithmList({ orgId: this.orgId }).then((res) => {
        this.options_alarmName = res.data;
      });
    },
    changeEventCode(val) {
      const obj = this.options_alarmName.filter(it => val == it.id)
      this.form.eventCode = obj[0].code
    },
    // 历史数据改变时触发
    changeGrade(data) {
      if (this.form.name == 1) {

      }
      if (this.form.name == 2) {
        if (data == 2) {
          this.disabledAppend = true
        } else {
          this.disabledAppend = false
          this.append = "次"
        }
      }
    },
    // 预警类型改变时触发
    changeName() {
      this.form.area = "",
        this.form.grade = "",
        this.form.require_1 = "",
        this.form.require_2 = "",
        this.form.arithmetic = "",
        this.form.startTime = "",
        this.form.entTime = ""
      this.form.eventCode = ""
      this.front = ""
      this.medium = ""
      this.back = ""
      this.disabledAppend = false
      this.disabledGrade = false
      this.disabledRequire_1 = false
    },
    // 预警内容改变触发
    changeArea(data) {
      if (this.form.name == 1) {
        if (data == 1) {
          this.form.grade = 1
          this.form.require_1 = '3'
          this.disabledGrade = true
          this.disabledRequire_1 = true
          this.prepend = "低于"
          this.append = "分"
        } else if (data == 2) {
          this.prepend = "低于"
          this.append = "%"
          this.disabledGrade = false
          this.disabledRequire_1 = false
          // 历史数据默认选择无 并禁用
          this.form.grade = 1;
          this.disabledGrade = true;
        }
      } else if (this.form.name == 2) {
        this.disabledGrade = false
        this.disabledRequire_1 = false
        // 先清空在赋值
        this.front = ""
        this.medium = ""
        this.back = ""
        if (data == 3) {
          this.prepend = "高于"
          this.append = "次"
          this.front = "频繁触发"
          this.back = "告警"
        } else if (data == 4) {
          this.prepend = "高于"
          this.append = "%"
          this.front = ""
          this.back = "告警高于历史平均值"
        } else if (data == 5) {
          this.prepend = "高于"
          this.append = "%"
          this.medium = "告警在"
          this.back = "告警高于历史平均值"
          this.disabledRequire_1 = true
          this.form.require_1 = '2'
        } else if (data == 6) {
          this.prepend = "高于"
          this.append = "次"
          this.back = "告警已超过当天预警上限值"
        }
      }
    },
    resetForm() {
      this.form = {
        id: "",
        name: "",
        area: "",
        grade: "",
        require_1: "",
        require_2: "",
        arithmetic: "",
        startTime: "",
        entTime: "",
        eventCode: ""
      };
      this.front = ""
      this.medium = ""
      this.back = ""
      this.append = ""
      this.disabledGrade = false
      this.disabledRequire_1 = false
      this.disabledAppend = false
    },
    handleReset() {
      this.dialogVisible = false
      this.resetForm()
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
          const params = {
            orgId: this.orgId,
            dataType: this.form.name, // 预警类型
            dataSubType: this.form.area, // 预警内容
            algorithmId: this.form.arithmetic, //算法
            startTime: this.form.startTime ? this.form.startTime : '00:00', // 起始时间
            entTime: this.form.entTime ? this.form.entTime : '24:00', // 结束时间
            rangeData: this.form.grade, // 历史数据
            rangeValue: this.form.require_1, // 取值范围
            warningType: this.prepend === "低于" ? 1 : 2,
            warningValue: this.form.require_2,
            warningUnit: this.append,
            eventCode: this.form.eventCode
          }
          getAlarmSaves(params).then(res => {
            console.log(res)
            this.dialogVisible = false;
            this.$notify({
              title: "Success",
              message: "添加成功",
              type: "success",
              duration: 2000,
            });
            this.resetForm();
            this.$emit('dataPageAdd')
          })
        }
      });
    },
    handleUpdate(row, title) {
      const objFrom = row;
      this.form = {
        id: row.id,
        name: row.dataType,
        area: row.dataSubType,
        grade: row.rangeData,
        require_1: row.rangeValue,
        require_2: row.warningValue,
        arithmetic: row.algorithmId,
        startTime: row.startTime,
        entTime: row.entTime,
        eventCode: row.eventCode
      }
      this.changeArea(this.form.area)
      this.title = title || "编辑策略";
      this.dialogStatus = "update";
      this.dialogVisible = true;
      const form = this.$refs.form;
      form && form.clearValidate();
    },
    updateData() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const params = {
            orgId: this.orgId,
            id: this.form.id,
            dataType: this.form.name, // 预警类型
            dataSubType: this.form.area, // 预警内容
            algorithmId: this.form.arithmetic, //算法
            startTime: this.form.startTime, // 起始时间
            entTime: this.form.entTime, // 结束时间
            rangeData: this.form.grade, // 历史数据
            rangeValue: this.form.require_1, // 取值范围
            warningType: this.prepend === "低于" ? 1 : 2,
            warningValue: this.form.require_2,
            warningUnit: this.append,
            eventCode: this.form.eventCode
          }
          getAlarmSaves(params).then(res => {
            console.log(res)
            this.dialogVisible = false;
            this.$notify({
              title: "Success",
              message: "修改成功",
              type: "success",
              duration: 2000,
            });
            this.$emit('dataPageAdd')
          })
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
