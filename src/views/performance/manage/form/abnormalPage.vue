<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5" style="float: left">
            <el-button
              icon="el-icon-plus"
              size="mini"
              type="primary"
              @click="handleAdd"
              >新增标准</el-button
            >
          </el-col>
          <el-col :span="1.5" style="float: left">
            <el-button
              size="mini"
              type="danger"
              :disabled="selected"
              @click="handleDelete"
              icon="el-icon-delete"
              >删除</el-button
            >
          </el-col>
        </el-row>
        <el-table
          v-loading="loading"
          :data="userList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center">
          </el-table-column>
          <el-table-column label="序号" type="index" align="center" width="50">
          </el-table-column>
          <el-table-column
            label="考核分类"
            align="center"
            key="assess"
            prop="assess"
          >
          </el-table-column>
          <el-table-column
            label="考核内容"
            align="center"
            key="assessContent"
            prop="assessContent"
          >
          </el-table-column>
          <el-table-column
            label="评判标准"
            align="center"
            key="judge"
            prop="judge"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="扣分标准"
            align="center"
            key="deductMarks"
            prop="deductMarks"
            :show-overflow-tooltip="true"
            width="100"
          >
          </el-table-column>
          <el-table-column
            label="补救措施"
            align="center"
            key="remedy"
            prop="remedy"
            width="120"
          >
          </el-table-column>
          <el-table-column
            label="其他说明"
            align="center"
            key="remake"
            prop="remake"
          >
          </el-table-column>
          <el-table-column label="管理" align="center" width="180">
            <template slot-scope="{ row }">
              <el-button
                size="mini"
                icon="el-icon-edit"
                type="primary"
                @click="handleUpdate(row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete2(row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getStandard"
        />
      </el-col>
    </el-row>

    <!-- 新增标准的dialog -->
    <el-dialog
      :title="updateId ? '修改标准' : '新增标准'"
      :visible.sync="visible"
      width="50%"
      center
      :before-close="handleClose"
    >
      <el-form :model="form" :rules="formRules" ref="form" label-width="100px">
        <el-form-item label="考核分类" prop="assess">
          <el-select v-model="form.assess" placeholder="请选择分类">
            <el-option label="工作脱岗" value="工作脱岗"></el-option>
            <el-option label="安全工作" value="安全工作"></el-option>
            <el-option label="算法告警" value="算法告警"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考核内容" prop="assessContent">
          <el-select
            :disabled="disabled"
            v-model="form.assessContent"
            placeholder="请考核内容"
          >
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="评判标准" prop="judge">
          <el-select
            :disabled="disabled2"
            v-model="form.judge"
            placeholder="请选择评判标准"
          >
            <el-option
              v-for="item in option2"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :disabled="disabled" label="扣分标准" prop="deductMarks">
          <el-input-number
            :disabled="disabled2"
            style="width: 100%"
            v-model="form.deductMarks"
            :min="0"
            :max="10"
            label="label"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="补救措施" prop="remedy">
          <el-select
            :disabled="disabled3"
            v-model="form.remedy"
            placeholder="请选择补救措施"
          >
            <el-option
              v-for="item in option3"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="其他说明" prop="remake">
          <el-select
            :disabled="disabled4"
            v-model="form.remake"
            placeholder="请选择其他说明"
          >
            <el-option
              v-for="item in option4"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleOk">确 定</el-button>
        <el-button type="danger" @click="handleClose">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getStandard, addStandard, delStandard } from "@/api/device/performance";
import { getAlgorithmList } from '@/api/device/algorithm';
import { mapGetters } from 'vuex';

const userList = [];
/* 考核内容 */
const option = [
  { value: 1, label: "店长脱岗", type: 1 },
  { value: 2, label: "便利店主管脱岗", type: 1 },
  { value: 3, label: "服务脱岗", type: 1 },
  { value: 4, label: "作业脱岗", type: 1 },
  { value: 5, label: "卸油离岗", type: 1 },
  { value: 6, label: "人员睡岗", type: 1 },

  { value: 7, label: "头盔检测", type: 2 },
  { value: 8, label: "服装检测", type: 2 },
  { value: 9, label: "车辆占道", type: 2 },
  { value: 10, label: "物品占道", type: 2 },
];
// 评判标准
const option2 = [
  { value: 1, label: "店长抓拍轨迹缺失", type: 1 },
  { value: 2, label: "便利店主管在店时长低于80%", type: 2 },
  { value: 3, label: "客户车辆加油期间长时间未能提供加油服务", type: 3 },
  { value: 4, label: "加油广场长时间没有工作人员在岗", type: 4 },
  { value: 5, label: "卸油期间工作人员离开卸油区", type: 5 },
  { value: 6, label: "夜间便利店工作人员睡岗", type: 6 },
  { value: 7, label: "指定管制区域不佩戴安全帽", type: 7 },
  { value: 8, label: "指定管制区域不穿专业服装", type: 8 },
  { value: 9, label: "车辆长时间停放在消防通道", type: 9 },
  { value: 10, label: "消防通道放有大件物品且长时间未搬走", type: 10 },

  { value: 11, label: "要求处置的警情当天未及时处置", type: 11 },
  { value: 12, label: "警情属实", type: 11 },
];
/* 补救措施 */
const option3 = [
  { value: 1, label: "立即离开管控区域", type: 7 },
  { value: 2, label: "立即离开管控区域", type: 8 },
  { value: 3, label: "及时处理", type: 9 },
  { value: 4, label: "及时处理", type: 10 },

  { value: 5, label: "及时处置", type: 11 },
  { value: 6, label: "处置并反馈详情", type: 12 },
];
/* 说明 */
const option4 = [
  { value: 1, label: "当天无再次警告自动加分", type: 9 },
  { value: 2, label: "当天无再次警告自动加分", type: 10 },

  { value: 3, label: "处置后自动加分", type: 11 },
  { value: 4, label: "扣除的分自动加回", type: 12 },
];
export default {
  components: {},
  data() {
    return {
      flag: false,
      loading: false,
      ids: [],
      /* 选中的 */
      selected: true,
      /* 扣分标准 */
      disabled: true,
      disabled2: true,
      disabled3: true,
      disabled4: true,
      option4: option4,
      option3: option3,
      option2: option2,
      option: option,

      option4Clone: option4,
      option3Clone: option3,
      option2Clone: option2,
      optionClone: option,

      visible: false, // 添加、修改标准的dialog
      userList: userList,
      form: {
        assess: null, // 考核分类
        assessContent: null, // 考核内容
        judge: null, // 评判标准

        deductMarks: null, // 扣分标准
        remedy: null, // 补救措施
        remake: null, // 其他说明
      },
      updateForm: {},
      updateId: null,
      formRules: {
        assess: [
          { required: true, message: "请选择分类", trigger: "blur" },
        ],
        assessContent: [
          { required: true, message: "请考核内容", trigger: "blur" },
        ],
        judge: [
          { required: true, message: "请选择评判标准", trigger: "blur" },
        ],
        deductMarks: [
          { required: true, message: "请输入扣分标准", trigger: "blur" },
        ],
        remedy: [
          { required: false, message: "请选择补救措施", trigger: "blur" },
        ],
        remake: [
          { required: false, message: "请输入其他说明", trigger: "blur" },
        ],
      },

      ids: [],
      single: false,
      multiple: true,
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        orgId: null,
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  computed: {
    ...mapGetters(['info']),
    orgId() {
      return this.info.user.orgId
    },
  },
  watch: {
    /* 监听 考核分类 */
    "form.assess"(val) {
      console.log("考核分类val: ", val);
      if (!this.flag) {
        this.form.assessContent = null; // 考核内容
        this.form.judge = null; // 评判标准
        this.form.deductMarks = null // 扣分标准
        this.form.remedy = null; // 补救措施
        this.form.remake = null; // 其他说明
      }

      val ? this.disabled = false : this.disabled = true;
      this.option = this.optionClone;
      this.option2 = this.option2Clone;
      this.option3 = this.option3Clone;
      switch (val) {
        case "工作脱岗":
          this.option = this.option.filter((item) => {
            return item.type == 1;
          });
          this.option2 = this.option2.filter((item) => {
            return item.type == 1;
          });
          this.option3 = this.option3.filter((item) => {
            return item.type == 1;
          });
          console.log("this.option", this.option);
          break;
        case "安全工作":
          console.log(this.option);

          this.option = this.option.filter((item) => {
            return item.type == 2;
          });
          this.option2 = this.option2.filter((item) => {
            return item.type == 2;
          });
          this.option3 = this.option3.filter((item) => {
            return item.type == 2;
          });
          break;
        case "算法告警":
          getAlgorithmList({ orgId: this.orgId }).then((res) => {
            res.data.forEach(item => {
              this.option.push({
                value: item.id,
                label: item.name,
                eventCode: item.code,
                type: 3
              });
              this.optionClone.push({
                value: item.id,
                label: item.name,
                eventCode: item.code,
                type: 3
              });
            })
          });
          this.option = this.option.filter((item) => {
            return item.type == 3;
          });
          this.option2 = this.option2.filter((item) => {
            return item.type == 3;
          });
          this.option3 = this.option3.filter((item) => {
            return item.type == 3;
          });
          break;
      }
    },
    /* 监听 考核内容 */
    "form.assessContent"(val) {
      console.log("考核内容val: ", val);
      val ? (this.disabled2 = false) : (this.disabled2 = true);
      console.log(this.updateId);
      if (!this.flag) {
        this.form.judge = null; // 评判标准
        this.form.deductMarks = null // 扣分标准
        this.form.remedy = null; // 补救措施
        this.form.remake = null; // 其他说明
      }

      this.option2 = [...this.option2Clone];
      this.option3 = [...this.option3Clone];
      this.option4 = [...this.option4Clone];
      if (this.form.assess === '算法告警') {
        this.option2 = this.option2.filter(item => {
          return item.type == 11
        })
      } else {
        switch (val) {
          case "店长脱岗":
            this.option2 = this.option2.filter(item => {
              return item.type == 1
            })
            this.option2.length ? this.form.judge = this.option2[0].label : [];
            break;
          case "便利店主管脱岗":
            this.option2 = this.option2.filter(item => {
              return item.type == 2
            })

            this.option2.length ? this.form.judge = this.option2[0].label : [];
            break;
          case "服务脱岗":
            this.option2 = this.option2.filter(item => {
              return item.type == 3
            })

            this.option2.length ? this.form.judge = this.option2[0].label : [];
            break;
          case "作业脱岗":
            this.option2 = this.option2.filter(item => {
              return item.type == 4
            })

            this.option2.length ? this.form.judge = this.option2[0].label : [];
            break;
          case "卸油离岗":
            this.option2 = this.option2.filter(item => {
              return item.type == 5
            })

            this.option2.length ? this.form.judge = this.option2[0].label : [];
            break;
          case "人员睡岗":
            this.option2 = this.option2.filter(item => {
              return item.type == 6
            })

            this.option2.length ? this.form.judge = this.option2[0].label : [];
            break;

          case "头盔检测":
            this.option2 = this.option2.filter(item => {
              return item.type == 7
            })

            this.option2.length ? this.form.judge = this.option2[0].label : [];
            break;
          case "服装检测":
            this.option2 = this.option2.filter(item => {
              return item.type == 8
            })

            this.option2.length ? this.form.judge = this.option2[0].label : [];
            break;
          case "车辆占道":
            this.option2 = this.option2.filter(item => {
              return item.type == 9
            })

            this.option2.length ? this.form.judge = this.option2[0].label : [];
            break;
          case "物品占道":
            this.option2 = this.option2.filter(item => {
              return item.type == 10
            })

            this.option2.length ? this.form.judge = this.option2[0].label : [];
            break;
        }
      }

    },
    /* 监听 评判标准 */
    "form.judge"(val) {
      this.setEmptyStatus()
      val ? this.disabled3 = false : this.disabled3 = true;
      if (!this.flag) {
        this.form.deductMarks = null // 扣分标准
        this.form.remedy = null; // 补救措施
        this.form.remake = null; // 其他说明
      }
      this.flag = this.flag ? false : this.flag;


      this.option3 = this.option3Clone;
      this.option4 = this.option4Clone;

      switch (val) {
        case '店长抓拍轨迹缺失':
          this.option3 = this.option3.filter(item => {
            return item.type == 1
          })
          this.option4 = this.option4.filter(item => {
            return item.type == 1
          })
          this.form.remedy = this.option3.length ? this.option3[0].label : null
          this.form.remake = this.option4.length ? this.option4[0].label : null;

          if (!this.updateId) {
            this.form.deductMarks = 1;
          }
          break;

        case '便利店主管在店时长低于80%':
          this.option3 = this.option3.filter(item => {
            return item.type == 2
          })
          this.option4 = this.option4.filter(item => {
            return item.type == 2
          })
          this.option3.length ? this.form.remedy = this.option3[0].label : [];
          this.option4.length ? this.form.remake = this.option4[0].label : [];

          if (!this.updateId) {
            this.form.deductMarks = 0.5;
          }
          break;
        case '客户车辆加油期间长时间未能提供加油服务':
          this.option3 = this.option3.filter(item => {
            return item.type == 3
          })
          this.option4 = this.option4.filter(item => {
            return item.type == 3
          })

          this.option3.length ? this.form.remedy = this.option3[0].label : [];
          this.option4.length ? this.form.remake = this.option4[0].label : [];

          if (!this.updateId) {
            this.form.deductMarks = 0.2;
          }
          break;
        case '加油广场长时间没有工作人员在岗':
          this.option3 = this.option3.filter(item => {
            return item.type == 4
          })
          this.option4 = this.option4.filter(item => {
            return item.type == 4
          })
          this.option3.length ? this.form.remedy = this.option3[0].label : [];
          this.option4.length ? this.form.remake = this.option4[0].label : [];

          if (!this.updateId) {
            this.form.deductMarks = 0.2;
          }
          break;
        case '卸油期间工作人员离开卸油区':
          this.option3 = this.option3.filter(item => {
            return item.type == 5
          })
          this.option4 = this.option4.filter(item => {
            return item.type == 5
          })
          this.option3.length ? this.form.remedy = this.option3[0].label : [];
          this.option4.length ? this.form.remake = this.option4[0].label : [];

          if (!this.updateId) {
            this.form.deductMarks = 1;
          }
          break;
        case '夜间便利店工作人员睡岗':
          this.option3 = this.option3.filter(item => {
            return item.type == 6
          })
          this.option4 = this.option4.filter(item => {
            return item.type == 6
          })
          this.option3.length ? this.form.remedy = this.option3[0].label : [];
          this.option4.length ? this.form.remake = this.option4[0].label : [];

          if (!this.updateId) {
            this.form.deductMarks = 0.2;
          }
          break;
        case '指定管制区域不佩戴安全帽':
          this.option3 = this.option3.filter(item => {
            return item.type == 7
          })
          this.option4 = this.option4.filter(item => {
            return item.type == 7
          })
          this.option3.length ? this.form.remedy = this.option3[0].label : [];
          this.option4.length ? this.form.remake = this.option4[0].label : [];

          if (!this.updateId) {
            this.form.deductMarks = 0.2;
          }
          break;
        case '指定管制区域不穿专业服装':
          this.option3 = this.option3.filter(item => {
            return item.type == 8
          })
          this.option4 = this.option4.filter(item => {
            return item.type == 8
          })
          this.option3.length ? this.form.remedy = this.option3[0].label : [];
          this.option4.length ? this.form.remake = this.option4[0].label : [];

          if (!this.updateId) {
            this.form.deductMarks = 0.2;
          }
          break;

        case '车辆长时间停放在消防通道':
          this.option3 = this.option3.filter(item => {
            return item.type == 9
          })
          this.option4 = this.option4.filter(item => {
            return item.type == 9
          })
          this.option3.length ? this.form.remedy = this.option3[0].label : [];
          this.option4.length ? this.form.remake = this.option4[0].label : [];

          if (!this.updateId) {
            this.form.deductMarks = 0.2;
          }
          break;
        case '消防通道放有大件物品且长时间未搬走':
          this.option3 = this.option3.filter(item => {
            return item.type == 10
          })
          this.option4 = this.option4.filter(item => {
            return item.type == 10
          })

          this.option3.length ? this.form.remedy = this.option3[0].label : [];
          this.option4.length ? this.form.remake = this.option4[0].label : [];
          if (!this.updateId) {
            this.form.deductMarks = 0.2;
          }
          break;
        case '要求处置的警情当天未及时处置':
          this.option3 = this.option3.filter(item => {
            return item.type == 11
          })
          this.option4 = this.option4.filter(item => {
            return item.type == 11
          })
          this.option3.length ? this.form.remedy = this.option3[0].label : [];
          this.option4.length ? this.form.remake = this.option4[0].label : [];

          if (!this.updateId) {
            this.form.deductMarks = 0.1;
          }
          break;
        case '警情属实':
          this.option3 = this.option3.filter(item => {
            return item.type == 12
          })
          this.option4 = this.option4.filter(item => {
            return item.type == 12
          })
          this.option3.length ? this.form.remedy = this.option3[0].label : [];
          this.option4.length ? this.form.remake = this.option4[0].label : [];

          if (!this.updateId) {
            this.form.deductMarks = 0.5;
          }
          break;
      }
      this.option3.push({ value: 0, label: "无", },)
      this.option4.push({ value: 0, label: "无", },)
    },
    /* 监听补救措施 */
    "form.remedy"(val) {
      val ? this.disabled4 = false : this.disabled4 = true;
      switch (val) {
        case '无':
          this.form.remake = null;
          this.disabled4 = true;
          break;
      }
    }
  },
  created() {
    this.queryParams.orgId = this.info.user.orgId
    this.getStandard();
  },
  methods: {
    /** 获取绩效标准列表 */
    getStandard() {
      this.loading = true;
      getStandard(this.queryParams).then(
        res => {
          this.userList = res.rows;
          this.total = parseInt(res.total);
          this.loading = false;
        }
      );
    },
    resetForm() {
      this.form = {
        assess: null, // 考核分类
        assessContent: null, // 考核内容
        judge: null, // 评判标准
        deductMarks: null, // 扣分标准
        remedy: null, // 补救措施
        remake: null, // 其他说明
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      console.log(this.form);
      this.visible = true;
    },
    handleOk() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        this.form.remedy = this.form.remedy ? this.form.remedy : '无';
        this.form.remake = this.form.remake ? this.form.remake : '无';

        this.form.orgId = this.orgId;

        switch (this.form.remake) {
          case '处置后自动加分':
            this.form.isHandle = 1;
            this.form.addScore = this.form.deductMarks;
            break;
          case '扣除的分自动加回':
            this.form.isHandle = 2;
            this.form.addScore = this.form.deductMarks;
            break;
        }
        if (this.form.remake == null || this.form.remake == '无') {
          this.form.isHandle = 0;
          this.form.addScore = 0;
        }

        if (this.form.assess == '算法告警') {
          let eventCode = null;
          eventCode = this.option.filter(item =>
            item.label == this.form.assessContent
          )[0].eventCode

          this.form.eventCode = eventCode
        }
        // 发送请求
        addStandard(this.form).then(res => {
          console.log('添加标准res: ', res);
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.getStandard();
            this.handleClose()
          } else {
            this.$message.success(res.msg)
          }
        })
      })
    },
    handleClose() {
      this.updateId = null;
      this.resetForm()
      this.visible = false;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.flag = true;
      this.updateId = row.id;
      this.form.id = row.id;
      this.form.assess = row.assess;
      this.form.assessContent = row.assessContent;
      this.form.judge = row.judge;
      this.form.deductMarks = parseFloat(row.deductMarks);
      this.form.remedy = row.remedy;
      this.form.remake = row.remake;

      console.log(this.form);
      this.visible = true;
    },
    /** 删除按钮操作 */
    handleDelete() {
      const data = {
        ids: this.ids
      }
      delStandard(data).then(res => {
        console.log('删除标准的res: ', res);
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.getStandard();
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    handleDelete2(row) {
      const data = {
        ids: [row.id]
      }
      delStandard(data).then(res => {
        console.log('删除标准的res: ', res);
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.getStandard();
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log('selection: ', selection);
      this.ids = selection.map(item => item.id);
      console.log('this.ids: ', this.ids);
      this.selected = !selection.length
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-select {
  width: 100%;
}
::v-deep .el-input__inner,
.el-input,
.el-input--medium {
  width: 100%;
}
::v-deep .app-container {
  padding: 0;
}
::v-deep .el-tree-node__content {
  position: relative;
}
.app-tree-option {
  position: absolute;
  right: 0;
  top: 0px;
}
</style>
