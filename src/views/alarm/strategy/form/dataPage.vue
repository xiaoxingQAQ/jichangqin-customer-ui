<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5" style="float: left">
            <el-button
              size="mini"
              icon="el-icon-plus"
              type="primary"
              @click="handleAdd"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5" style="float: left">
            <el-popconfirm
              title="确定删除吗？"
              icon="el-icon-info"
              icon-color="red"
              @confirm="handleDelete('selection')"
            >
              <el-button
                slot="reference"
                size="mini"
                icon="el-icon-delete"
                type="danger"
                :disabled="multiple"
                >删除</el-button
              >
            </el-popconfirm>
          </el-col>
          <!-- <el-col :span="7" style="float: right;">
            <el-button size="mini" style="float: right;" type="primary" @click="handleLevel">警情等级</el-button>
          </el-col> -->
        </el-row>
        <!-- 改 loading=false -->
        <el-table
          v-loading="false"
          :data="userList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="50"
            align="center"
          ></el-table-column>
          <el-table-column label="序号" type="index" align="center">
          </el-table-column>
          <el-table-column label="预警类型" align="center" prop="dataType">
            <template v-slot="scope">
              <div>
                {{
                  scope.row.dataType == 1
                    ? '账号数据异常'
                    : scope.row.dataType == 2
                    ? '事件告警异常'
                    : ''
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="预警内容"
            align="center"
            prop="dataSubType"
            :show-overflow-tooltip="true"
          >
            <template #default="scope">
              <div>
                {{
                  scope.row.dataSubType == 1
                    ? '账号综合评分过低'
                    : scope.row.dataSubType == 2
                    ? '账号警情处置比例过低'
                    : scope.row.dataSubType == 3
                    ? '频繁触发 ' +
                      alarmNameArr[scope.row.algorithmId + ''] +
                      ' 告警'
                    : scope.row.dataSubType == 4
                    ? alarmNameArr[scope.row.algorithmId + ''] +
                      ' 告警高于历史平均值'
                    : scope.row.dataSubType == 5
                    ? alarmNameArr[scope.row.algorithmId + ''] +
                      ' 告警在 ' +
                      scope.row.startTime +
                      '-' +
                      scope.row.entTime +
                      ' 内告警高于历史平均值'
                    : scope.row.dataSubType == 6
                    ? alarmNameArr[scope.row.algorithmId + ''] +
                      ' 告警已超过当天预警上限值'
                    : ''
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="历史数据"
            align="center"
            prop="rangeData"
            :show-overflow-tooltip="true"
            width="150"
          >
            <template #default="scope">
              <div>
                {{
                  scope.row.rangeData == 1
                    ? '无'
                    : scope.row.rangeData == 2
                    ? '最近30天平均值'
                    : ''
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="取值范围"
            align="center"
            prop="rangeValue"
          >
            <template #default="scope">
              <div>
                {{
                  scope.row.rangeValue == 1
                    ? '一个小时内'
                    : scope.row.rangeValue == 2
                    ? '当天数据'
                    : scope.row.rangeValue == 3
                    ? '当月数据'
                    : ''
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="预警线标准"
            align="center"
            prop="warningValue"
          >
            <template #default="scope">
              <div>
                {{
                  scope.row.warningType == 1
                    ? '低于' + scope.row.warningValue + scope.row.warningUnit
                    : scope.row.warningType == 2
                    ? '高于' + scope.row.warningValue + scope.row.warningUnit
                    : ''
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="{ row }">
              <el-button
                size="mini"
                type="primary"
                @click="handleUpdate(row)"
                icon="el-icon-edit"
                style="margin-right: 10px"
                >编辑</el-button
              >
              <el-popconfirm
                @confirm="confirmEvent(row)"
                @cancel="cancelEvent"
                title="确认是否删除"
              >
                <template #reference>
                  <el-button icon="el-icon-delete" size="mini" type="danger"
                    >删除</el-button
                  >
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
    <UpdateForm @dataPageAdd="dataPageAdd" ref="updateForm2"></UpdateForm>
  </div>
</template>

<script>
import UpdateForm from "../components/dataPage/UpdateForm";
import { treeselect } from "@/api/system/dept";
import { getAlarmData, getAlarmSaves, getAlarmDeletes } from "@/api/alarm/alarm";
import { getAlgorithmList } from "@/api/device/algorithm";
export default {
  name: 'devicePage',
  components: {
    UpdateForm,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 部门树选项
      deptOptions: undefined,
      // 部门名称
      deptName: undefined,
      userList: [],
      // 日期范围
      dateRange: [],
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
      },
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `用户名称`, visible: true },
        { key: 2, label: `用户昵称`, visible: true },
        { key: 3, label: `部门`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `状态`, visible: true },
        { key: 6, label: `创建时间`, visible: true }
      ],
      alarmNameArr: {}
    }
  },
  computed: {
    orgId() {
      return this.$store.getters.info.user.orgId;
    },
  },
  methods: {
    // 获取告警名称
    getAlgorithmList() {
      getAlgorithmList({ orgId: this.orgId }).then((res) => {
        res.data.forEach(it => {
          this.alarmNameArr[it.id] = it.name
        })
      });
      console.log(this.alarmNameArr)
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      getAlarmData(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.userList = response.rows;
        this.total = parseInt(response.total);
        this.loading = false;
      }
      );
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.getList();
    },
    /** 警情等级 */
    handleLevel() {
      this.$refs.levelForm.handleCreate();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$refs.updateForm2.handleCreate();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$refs.updateForm2.handleUpdate(row);
    },
    /** 删除按钮操作 */
    handleDelete() {
      // 多选
      getAlarmDeletes({
        ids: [...this.ids]
      }).then(res => {
        console.log(res)
        this.$notify({
          title: "Success",
          message: "多选删除成功",
          type: "success",
          duration: 2000,
        });
        this.getList()
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 删除 确认
    confirmEvent(row) {
      getAlarmDeletes({
        ids: [row.id]
      }).then(res => {
        console.log(res)
        this.$notify({
          title: "Success",
          message: "单选删除成功",
          type: "success",
          duration: 2000,
        });
        this.getList()
      })
    },
    // 删除 取消
    cancelEvent() { },
    // 新增 修改
    dataPageAdd() {
      this.getList()
    }
  },
  created() {
    this.getList();
    this.getAlgorithmList()
  }
}
</script>

<style scoped>
::v-deep.app-container {
  padding: 0;
}
::v-deep.el-tree-node__content {
  position: relative;
}
.app-tree-option {
  position: absolute;
  right: 0;
  top: 0px;
}
</style>
