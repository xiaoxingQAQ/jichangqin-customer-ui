<template>
  <div class="app-container main">
    <el-row :gutter="24">
      <!--组织数据-->
      <el-col :span="5" :xs="24">
        <div
          class="head-container"
          style="height: 48px; display: flex; justify-content: center"
        >
          <h2>组织机构</h2>
        </div>
        <div class="tree-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          >
            <template class="custom-tree-node" slot-scope="{ node, data }">
              <span :class="{ active: data.id == queryParams.deptId }">
                {{ data.label }}
              </span>
            </template>
          </el-tree>
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="19" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <div class="left">
            <el-form-item prop="userName">
              <el-input
                class="unique"
                v-model="queryParams.userName"
                placeholder="用户"
                clearable
                size="small"
                style="width: 240px"
                @keyup.enter.native="handleQuery"
              />
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
            <!-- <el-form-item prop="phonenumber">
              <el-input
                class="unique"
                v-model="queryParams.phonenumber"
                clearable
                placeholder="手机号码"
                size="small"
                style="width: 240px"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item prop="status">
              <el-select
                v-model="queryParams.status"
                clearable
                size="small"
                style="width: 240px"
                placeholder="状态"
              >
                <el-option
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item class="data-picker">
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
            </el-form-item> -->
          </div>
          <div class="right"></div>
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
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:user:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-upload2"
              size="mini"
              @click="handleImport"
              v-hasPermi="['system:user:import']"
              >导入</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['system:user:export']"
              >导出</el-button
            >
          </el-col>
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
            label="机构"
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
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
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
            <template slot-scope="scope" v-if="scope.row.userId !== 1">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:user:edit']"
                >修改</el-button
              >
              <!-- <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:user:remove']"
                >删除</el-button
              > -->
              <el-dropdown
                size="mini"
                @command="(command) => handleCommand(command, scope.row)"
                v-hasPermi="['system:user:resetPwd', 'system:user:edit']"
              >
                <span class="el-dropdown-link">
                  <i class="el-icon-d-arrow-right el-icon--right"></i>更多
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    command="handleResetPwd"
                    icon="el-icon-key"
                    v-hasPermi="['system:user:resetPwd']"
                    >重置密码</el-dropdown-item
                  >
                  <el-dropdown-item
                    command="handleAuthRole"
                    icon="el-icon-circle-check"
                    v-hasPermi="['system:user:edit']"
                    >分配角色</el-dropdown-item
                  >
                  <el-dropdown-item command="handlePower" icon="el-icon-view"
                    >分配权限</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          class="pagination"
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <DialogUser
      ref="DialogUser"
      :form="form"
      :title="title"
      :visible="visible"
      :deptOptions="deptOptions"
      :roleOptions="roleOptions"
      :deptId="queryParams.deptId"
      @close="handleClose"
      @ok="addUser"
    />
    <!-- <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item
              v-if="form.userId == undefined"
              label="用户名称"
              prop="userName"
            >
              <el-input
                v-model="form.userName"
                placeholder="请输入用户名称"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.userId == undefined"
              label="用户密码"
              prop="password"
            >
              <el-input
                v-model="form.password"
                placeholder="请输入用户密码"
                type="password"
                maxlength="20"
                show-password
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input
                v-model="form.nickName"
                placeholder="请输入用户昵称"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input
                v-model="form.phonenumber"
                placeholder="请输入手机号码"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input
                v-model="form.leader"
                placeholder="请输入负责人"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="roleId">
              <el-select v-model="form.roleId" placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="form.userId == undefined ? 24 : 12">
            <el-form-item style="width: 100%" label="用户类型" prop="type">
              <el-select
                style="width: 100%"
                v-model="form.type"
                placeholder="请选择用户类型"
              >
                <el-option
                  v-for="item in userTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="部门机构"
              prop="deptId"
              v-if="form.userId != undefined"
            >
              <treeselect
                v-model="form.deptId"
                :options="deptOptions"
                :show-count="true"
                placeholder="请选择机构"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog> -->

    <!-- 用户导入对话框 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" />
            是否更新已经存在的用户数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate"
            >下载模板</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限的Dialog -->
    <el-dialog
      title="分配权限"
      center
      :visible.sync="visiblePower"
      width="40%"
      :before-close="handleClosePower"
    >
      <el-tree
        class="tree-border"
        :data="treeData"
        show-checkbox
        default-expand-all
        ref="tree"
        node-key="id"
        empty-text="加载中，请稍候"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer">
        <el-button type="primary" @click="handleOkPower">保 存</el-button>

        <el-button @click="handleClosePower" type="danger">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  resetUserPwd,
  changeUserStatus,
  getTreeSelect,
  saveTreeSelect
} from "@/api/system/user";
import { getToken } from "@/utils/auth";
import { userTreeSelect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapGetters } from 'vuex';

import DialogUser from "@/views/operation/manage/dialog/DialogUser";

export default {
  name: "User",
  dicts: ["sys_normal_disable", "sys_user_sex"],
  components: { DialogUser },
  data() {
    return {
      detail: {
        userId: null
      },
      visible: false,
      // 分配权限
      visiblePower: false,
      // 权限 树形控件
      treeData: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 组织树选项
      deptOptions: [],
      // options: [],
      // 是否显示弹出层
      open: false,
      // 组织名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      orgId: null,
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined,
      },
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `用户名称`, visible: true },
        { key: 2, label: `用户昵称`, visible: true },
        { key: 3, label: `集团`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `状态`, visible: true },
        { key: 6, label: `创建时间`, visible: true },
      ],
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "用户名称长度必须介于 2 和 20 之间",
            trigger: "blur",
          },
        ],
        deptId: [
          { required: true, message: "所属组织不能为空", trigger: "blur" },
        ],
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" },
          {
            min: 5,
            max: 20,
            message: "用户密码长度必须介于 5 和 20 之间",
            trigger: "blur",
          },
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(['info']),
  },
  watch: {
    // 根据名称筛选组织树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getList();
    this.getTreeselect();
    this.queryParams.orgId = this.info.user.deptId;
    this.orgId = this.info.user.deptId;

    this.getConfigKey("sys.user.initPassword").then((response) => {
      this.initPassword = response.msg;
    });
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },

    // /** 查询组织下拉树结构 */
    getTreeselect() {
      userTreeSelect().then((response) => {
        this.deptOptions = response.data;
        this.queryParams.deptId = this.deptOptions[0].id;
      });
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
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$modal
        .confirm('确认要"' + text + '""' + row.userName + '"用户吗？')
        .then(function () {
          return changeUserStatus(row.userId, row.status);
        })
        .then(() => {
          this.$modal.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        deptId: undefined,
        orgId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: [],
      };
      this.resetForm("form");
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        case "handleAuthRole":
          this.handleAuthRole(row);
          break;
        case "handlePower":
          this.handlePower(row)
          break;
        default:
          break;
      }
    },
    // 处理关闭新增dialog
    handleClose() {
      this.visible = false;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getTreeselect();
      const params = { type: 20 };
      getUser(null, params).then((response) => {
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.visible = true;
        this.title = "添加用户";
        this.form.password = '';
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      const userId = row.userId || this.ids;
      const params = { type: 20 };
      console.log("this.ids: ", this.ids);
      getUser(userId, params).then((response) => {
        this.form = response.data;
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.form.postIds = response.postIds;
        this.form.roleId = response.roleIds[0];;
        this.visible = true;
        this.title = "修改用户";
        this.form.password = "";
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        inputPattern: /^.{5,20}$/,
        inputErrorMessage: "用户密码长度必须介于 5 和 20 之间",
      })
        .then(({ value }) => {
          resetUserPwd(row.userId, value).then((response) => {
            this.$modal.msgSuccess("修改成功，新密码是：" + value);
          });
        })
        .catch(() => { });
    },
    /** 分配角色操作 */
    handleAuthRole: function (row) {
      const userId = row.userId;
      this.$router.push("/system/user-auth/role/" + userId);
    },
    /** 分配权限操作 */
    handlePower(row) {
      const orgId = row.deptId.toString();
      const userId = row.userId;
      this.detail.userId = userId;
      const params = {
        orgId
      }
      getTreeSelect(params, userId).then(res => {
        console.log('权限查看', res);
        if (res.code == 200) {
          this.treeData = res.depts
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(res.checkedKeys)
          })
        }
        this.visiblePower = true
      })

    },
    /* 保存分配权限 */
    handleOkPower() {
      const orgIds = this.$refs.tree.getCheckedKeys()
      const userId = this.detail.userId;
      const data = {
        userId,
        orgIds,
      }
      saveTreeSelect(data).then(res => {
        console.log('修改权限: ', res);
        if (res.code === 200) {
          this.$notify.success('修改成功')
          this.handleClosePower();
        } else {
          this.$notify.error('修改失败')
        }
      })
    },
    /* 关闭 */
    handleClosePower() {
      this.visiblePower = false
    },
    /* 筛选id */
    setDepartment(arr, id) {
      let obj = null;
      arr.forEach(item => {
        if (item.id == id) return obj = item;
        if (item.children && item.children.length > 0) {
          item.children.forEach(item2 => {
            if (item2.id == id) return obj = item;
            if (item2.children && item2.children.length > 0) {
              item2.children.forEach(item3 => {
                if (item3.id == id) return obj = item;
              });
            }
          });
        }
      });
      return obj;
    },
    /** 提交按钮 */
    addUser(form) {
      this.$refs.DialogUser.$data.loading = true;
      let data = {};
      data.nickName = form.nickName;
      data.phonenumber = form.phonenumber ? form.phonenumber : null;
      data.userName = form.userName ? form.userName : null;
      data.password = form.password ? form.password : null;
      data.leader = form.leader ? form.leader : null;
      data.roleIds = form.roleId ? form.roleId : null;
      data.deptId = form.deptId ? form.deptId : null;

      data.deptId = this.form.userId ? data.deptId : this.deptId;
      data.orgId = this.orgId;
      data.type = form.type ? form.type : null;
      console.log("data: ", data);
      if (!this.form.userId) {
        addUser(data).then((res) => {
          if (res.code == 200) {
            this.$notify.success('添加成功')
            this.visible_1 = false;
            /* 获取用户列表 */
            this.getList();
          } else {
            this.$notify.error('添加失败')
          }
          this.$refs.DialogUser.$data.loading = false;
        });
      } else {
        data.userId = this.form.userId;
        updateUser(data).then((res) => {
          if (res.code == 200) {
            this.$notify.success('修改成功')
            this.visible_1 = false;
            /* 获取用户列表 */
            this.getList();
          } else {
            this.$notify.error('修改失败')
          }
          this.$refs.DialogUser.$data.loading = false;
        });
      }
    },
    submitForm: function () {
      console.log(this.form);
      console.log(this.deptOptions);
      const deptId = this.form.deptId;
      this.form.orgId = this.setDepartment(this.deptOptions, deptId).id

      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.userId != undefined) {
            updateUser(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUser(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      this.$modal
        .confirm('是否确认删除用户编号为"' + userIds + '"的数据项？')
        .then(function () {
          return delUser(userIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/user/export",
        {
          ...this.queryParams,
        },
        `user_${new Date().getTime()}.xlsx`
      );
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download(
        "system/user/importTemplate",
        {
          ...this.queryParams,
        },
        `user_${new Date().getTime()}.xlsx`
      );
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  background-color: #fff !important;
  height: calc(100vh - 72px);
  overflow: auto;
}

.tree-container {
  width: 100%;
  height: calc(100vh - 140px);
  overflow: auto;
}

.el-tree {
  span {
    font-weight: 500;
    transition: all 500ms;
    &.active {
      padding: 0 10px;
      color: #fff;
      background: #409eff;

      border-radius: 4px;
    }
  }
}

::v-deep .el-tree-node__content:hover {
  background-color: #0085b515 !important;
  border-radius: 4px;
}
/* el-tree获得焦点的背景颜色 */
::v-deep .el-tree-node:focus > .el-tree-node__content {
  background-color: transparent;
  border-radius: 4px;
}
</style>
