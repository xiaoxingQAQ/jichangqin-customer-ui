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
                type="danger"
                icon="el-icon-delete"
                :disabled="multiple"
                >删除</el-button
              >
            </el-popconfirm>
          </el-col>
          <el-col :span="7" style="float: right">
            <el-button
              size="mini"
              style="float: right"
              type="primary"
              @click="handleLevel"
              :loading="loadingLevel"
              >警情等级</el-button
            >
          </el-col>
        </el-row>
        <!-- 改 loading=false -->
        <el-table
          v-loading="false"
          :data="userList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center">
          </el-table-column>
          <el-table-column label="序号" type="index" align="center">
          </el-table-column>
          <el-table-column
            label="告警名称"
            align="center"
            key="name"
            prop="name"
          >
          </el-table-column>
          <el-table-column
            label="告警时段"
            align="center"
            key="time"
            prop="time"
            :show-overflow-tooltip="true"
            width="100"
          >
            <template slot-scope="{ row }">
              <span style="font-weight: 500">{{
                row.startTime + '~' + row.endTime
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="告警区域"
            align="center"
            key="eventSource"
            prop="stationName"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            label="告警等级定义"
            align="center"
            key="levelName"
            prop="levelName"
            :show-overflow-tooltip="true"
            width="120"
          >
          </el-table-column>
          <el-table-column
            label="处置要求"
            align="center"
            key="handle"
            prop="handle"
            width="120"
          >
            <template slot-scope="{ row }">
              <div>{{ row.handle ? '必须处理' : '无需处理' }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="推送要求"
            align="center"
            key="pushRequest"
            prop="pushRequest"
            width="130"
          >
            <template slot-scope="">
              <el-tag style="margin: 0 2px 2px 0" type="primary">集团</el-tag>

              <el-tag type="primary">油站</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="超时上报(秒)"
            align="center"
            key="timeoutLimit"
            prop="timeoutLimit"
          ></el-table-column>
          <el-table-column
            label="告警分类"
            align="center"
            key="categoryName"
            prop="categoryName"
          ></el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="{ row }">
              <el-button
                size="mini"
                type="primary"
                style="margin-right: 10px"
                @click="handleUpdate(row)"
                icon="el-icon-edit"
                >编辑</el-button
              >
              <el-popconfirm
                title="确定删除吗？"
                icon="el-icon-info"
                icon-color="red"
                @confirm="handleDelete(row)"
              >
                <el-button
                  icon="el-icon-delete"
                  slot="reference"
                  size="mini"
                  type="danger"
                  >删除</el-button
                >
              </el-popconfirm>
              <!-- <el-button icon="el-icon-delete" size="mini" type="danger" @click="handleDelete(row)"
                >删除</el-button
              > -->
            </template></el-table-column
          >
        </el-table>
      </el-col>
    </el-row>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <LevelForm
      @reloadList="handleFilter"
      @openLoading="loadingLevel = true"
      @closeLoading="loadingLevel = false"
      ref="levelForm"
    ></LevelForm>
    <UpdateForm
      @immediateAlarmAdd="immediateAlarmAdd"
      ref="updateForm"
    ></UpdateForm>
  </div>
</template> 
          </el-table-column>
        </el-table>
        
      </el-col>
    </el-row>

   
  </div>
</template>

<script>
import { getImmediateAlarmList, delStrategy } from "@/api/alarm/alarm";
import LevelForm from "../components/devicePage/LevelForm";
import UpdateForm from "../components/devicePage/UpdateForm";
export default {
  name: "ImmediateAlarm",
  components: {
    LevelForm,
    UpdateForm,
  },
  data() {
    return {
      loadingLevel: false,
      // 遮罩层
      loading: true,
      // 非单个禁用
      ids: [],
      single: true,
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 部门树选项
      deptOptions: undefined,
      // 部门名称
      deptName: undefined,
      userList: [],
      alarmLevelList: [],
      // 日期范围
      dateRange: [],
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  methods: {
    handleFilter() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      getImmediateAlarmList(
        this.addDateRange2(this.queryParams, this.dateRange)
      ).then((response) => {
        console.log("即时告警response: ", response);

        this.userList = response.rows;
        this.total = parseInt(response.total);
        this.loading = false;
      });
    },
    immediateAlarmAdd() {
      this.getList()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    /** 警情等级 */
    handleLevel() {
      this.$refs.levelForm.getAlarmLevelList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$refs.updateForm.handleCreate2();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$refs.updateForm.handleUpdate(row);
    },
    /** 删除按钮操作 */
    handleDelete(val) {
      if (val === "selection") {
        // 多选
        delStrategy({ ids: this.ids }).then((res) => {
          this.$message.success(res.msg);
          this.getList();
        });
      } else {
        delStrategy({ ids: [val.id] }).then((res) => {
          this.$message.success(res.msg);
          this.getList();
        });
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
  },
  created() {
    this.getList();
  },
};
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
