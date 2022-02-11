<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--      <el-col :span="5" :xs="24">-->
      <!--        <div class="head-container">-->
      <!--          <el-input-->
      <!--            v-model="deptName"-->
      <!--            placeholder="请输入部门名称"-->
      <!--            clearable-->
      <!--            size="small"-->
      <!--            prefix-icon="el-icon-search"-->
      <!--            style="margin-bottom: 16px"-->
      <!--          />-->
      <!--        </div>-->
      <!--        <div class="head-container">-->
      <!--          <el-tree-->
      <!--            :data="deptOptions"-->
      <!--            :props="defaultProps"-->
      <!--            :expand-on-click-node="false"-->
      <!--            :filter-node-method="filterNode"-->
      <!--            ref="tree"-->
      <!--            default-expand-all-->
      <!--            @node-click="handleNodeClick"-->
      <!--          >-->
      <!--            {{deptOptions}}-->
      <!--            <span class="custom-tree-node" slot-scope="{ node, data }">-->
      <!--              <span>{{ node.label }}</span>-->
      <!--              <span class="app-tree-option">-->
      <!--                <el-button-->
      <!--                  type="text"-->
      <!--                  size="mini"-->
      <!--                  @click="() => append(data)">-->
      <!--                  添加-->
      <!--                </el-button>-->
      <!--                <el-button-->
      <!--                  type="text"-->
      <!--                  size="mini"-->
      <!--                  @click="() => remove(node, data)">-->
      <!--                  删除-->
      <!--                </el-button>-->
      <!--              </span>-->
      <!--            </span>-->
      <!--          </el-tree>-->
      <!--        </div>-->
      <!--      </el-col>-->
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="用户名称" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入用户名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input
              v-model="queryParams.phonenumber"
              placeholder="请输入手机号码"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="用户状态"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in dict.type.sys_normal_disable"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >查询</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:user:add']"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:user:edit']"
              >修改</el-button
            >
          </el-col>
          <!--          <el-col :span="1.5">-->
          <!--            <el-button-->
          <!--              type="danger"-->
          <!--              plain-->
          <!--              icon="el-icon-delete"-->
          <!--              size="mini"-->
          <!--              :disabled="multiple"-->
          <!--              @click="handleDelete"-->
          <!--              v-hasPermi="['system:user:remove']"-->
          <!--            >删除</el-button>-->
          <!--          </el-col>-->
          <!--          <el-col :span="1.5">-->
          <!--            <el-button-->
          <!--              type="info"-->
          <!--              plain-->
          <!--              icon="el-icon-upload2"-->
          <!--              size="mini"-->
          <!--              @click="handleImport"-->
          <!--              v-hasPermi="['system:user:import']"-->
          <!--            >导入</el-button>-->
          <!--          </el-col>-->
          <!--          <el-col :span="1.5">-->
          <!--            <el-button-->
          <!--              type="warning"-->
          <!--              plain-->
          <!--              icon="el-icon-download"-->
          <!--              size="mini"-->
          <!--              @click="handleExport"-->
          <!--              v-hasPermi="['system:user:export']"-->
          <!--            >导出</el-button>-->
          <!--          </el-col>-->
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList"
            :columns="columns"
          ></right-toolbar>
        </el-row>

        <el-table
          v-loading="loading"
          :data="userList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            label="用户编号"
            align="center"
            key="userId"
            prop="userId"
            v-if="columns[0].visible"
          />
          <el-table-column
            label="用户名称"
            align="center"
            key="userName"
            prop="userName"
            v-if="columns[1].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="用户昵称"
            align="center"
            key="nickName"
            prop="nickName"
            v-if="columns[2].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="部门"
            align="center"
            key="deptName"
            prop="dept.deptName"
            v-if="columns[3].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="手机号码"
            align="center"
            key="phonenumber"
            prop="phonenumber"
            v-if="columns[4].visible"
            width="120"
          />
          <el-table-column
            label="状态"
            align="center"
            key="status"
            v-if="columns[5].visible"
          >
            <template slot-scope="scope">
              <!--              <el-switch-->
              <!--                v-model="scope.row.status"-->
              <!--                active-value="0"-->
              <!--                inactive-value="1"-->
              <!--                @change="handleStatusChange(scope.row)"-->
              <!--              ></el-switch>-->
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            align="center"
            prop="createTime"
            v-if="columns[6].visible"
            width="160"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <!--            <template slot-scope="scope" v-if="scope.row.userId !== 1">-->
            <!--              <el-button-->
            <!--                size="mini"-->
            <!--                type="text"-->
            <!--                icon="el-icon-edit"-->
            <!--                @click="handleUpdate(scope.row)"-->
            <!--                v-hasPermi="['system:user:edit']"-->
            <!--              >修改</el-button>-->
            <!--              <el-button-->
            <!--                size="mini"-->
            <!--                type="text"-->
            <!--                icon="el-icon-delete"-->
            <!--                @click="handleDelete(scope.row)"-->
            <!--                v-hasPermi="['system:user:remove']"-->
            <!--              >删除</el-button>-->
            <!--              <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)" v-hasPermi="['system:user:resetPwd', 'system:user:edit']">-->
            <!--                <span class="el-dropdown-link">-->
            <!--                  <i class="el-icon-d-arrow-right el-icon&#45;&#45;right"></i>更多-->
            <!--                </span>-->
            <!--                <el-dropdown-menu slot="dropdown">-->
            <!--                  <el-dropdown-item command="handleResetPwd" icon="el-icon-key"-->
            <!--                                    v-hasPermi="['system:user:resetPwd']">重置密码</el-dropdown-item>-->
            <!--                  <el-dropdown-item command="handleAuthRole" icon="el-icon-circle-check"-->
            <!--                                    v-hasPermi="['system:user:edit']">分配角色</el-dropdown-item>-->
            <!--                </el-dropdown-menu>-->
            <!--              </el-dropdown>-->
            <!--            </template>-->
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
  </div>
</template>

<script>
import { treeselect } from "@/api/system/dept";
export default {
  name: 'devicePage',
  dicts: ['sys_normal_disable', 'sys_user_sex'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
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
      userList: null,
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
    }
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.userList = response.rows;
        this.total = response.total;
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getTreeselect();
      getUser().then(response => {
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.open = true;
        this.title = "添加用户";
        this.form.password = this.initPassword;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      const userId = row.userId || this.ids;
      getUser(userId).then(response => {
        this.form = response.data;
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.form.postIds = response.postIds;
        this.form.roleIds = response.roleIds;
        this.open = true;
        this.title = "修改用户";
        this.form.password = "";
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    append(data) {
      // const newChild = { id: id++, label: 'testtest', children: [] };
      // if (!data.children) {
      //   this.$set(data, 'children', []);
      // }
      // data.children.push(newChild);
    },
    remove(node, data) {
      // const parent = node.parent;
      // const children = parent.data.children || parent.data;
      // const index = children.findIndex(d => d.id === data.id);
      // children.splice(index, 1);
    },
  },
  created() {
    // this.getList();
    this.getTreeselect();
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
/*.custom-tree-node {*/
/*  flex: 1;*/
/*  display: flex;*/
/*  align-items: center;*/
/*  justify-content: space-between;*/
/*  font-size: 14px;*/
/*  padding-right: 8px;*/
/*}*/
</style>
