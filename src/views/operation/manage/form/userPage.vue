<template>
  <div class="app-container main">
    <el-row :gutter="24">
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
            accordion
            default-expand-all
            @node-click="handleNodeClick"
          >
            <template class="custom-tree-node" slot-scope="{ node, data }">
              <span :class="{ active: data.id == deptId }">
                {{ data.label }}
              </span>
            </template>
          </el-tree>
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="19" :xs="24">
        <div class="row option">
          <div class="left">
            <el-button
              size="mini"
              icon="el-icon-plus"
              type="primary"
              @click="handleAdd"
              >新增</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="deUser"
              :disabled="multiple"
              icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              icon="el-icon-download"
              size="mini"
              type="success"
              @click="handleExport"
              >导出</el-button
            >
          </div>
          <div class="right">
            <div>
              <el-input
                size="small"
                v-model.trim="queryParams.userName"
                placeholder="用户"
              ></el-input>
            </div>
            <!-- <div>
              <el-input
                size="small"
                v-model.trim="queryParams.nickName"
                placeholder="用户昵称"
              ></el-input>
            </div> -->
            <el-button
              icon="el-icon-search"
              size="mini"
              type="primary"
              @click="handleQuery"
              >查询</el-button
            >
            <el-button size="mini" icon="el-icon-refresh" @click="resetQuery"
              >重置</el-button
            >
          </div>
        </div>

        <el-table
          v-loading="loading"
          :data="tableData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            type="index"
            label="序号"
            width="50"
          ></el-table-column>
          <el-table-column
            label="用户"
            align="center"
            key="userName"
            prop="userName"
          />
          <el-table-column
            label="部门机构"
            align="center"
            key="dept.deptName"
            prop="dept.deptName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="创建时间"
            align="center"
            prop="createTime"
            width="160"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="负责人"
            align="center"
            key="dept.leader"
            prop="dept.leader"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="联系方式"
            align="center"
            key="phonenumber"
            prop="phonenumber"
          />
          <el-table-column
            label="操作"
            align="center"
            width="260"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleUpdate(scope.row)"
                :loading="loadingUpdate"
                :icon="
                  info.user.userName !== scope.row.userName
                    ? 'el-icon-edit'
                    : 'el-icon-document'
                "
                >{{
                  info.user.userName !== scope.row.userName ? '修改' : '查看'
                }}</el-button
              >
              <el-button size="mini" type="danger" @click="editPaw(scope.row)"
                >重置密码</el-button
              >
              <el-button
                size="mini"
                type="success"
                @click="handleLook(scope.row)"
                :loading="loadingPower"
                >{{
                  info.user.userName !== scope.row.userName
                    ? '分配权限'
                    : '查看权限'
                }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :disabled="false"
          :page.sync="queryParams.pageNum"
          :page-sizes="[5]"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- dialog -->
    <!-- 修改密码得dialog -->
    <el-dialog
      title="修改密码"
      center
      :visible.sync="visible_a"
      width="40%"
      :before-close="handleCancelPwd"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editForm"
        label-width="80px"
        class="editForm"
      >
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            type="password"
            show-password
            v-model="editForm.newPassword"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="newPasswordAgain">
          <el-input
            type="password"
            show-password
            v-model="editForm.newPasswordAgain"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleOkPwd" :loading="loadingPwd"
          >保 存</el-button
        >
        <el-button type="danger" @click="handleCancelPwd">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 创建和编辑的dialog -->
    <DialogUser
      ref="DialogUser"
      :form="form"
      :title="title"
      :visible="visible_1"
      :deptOptions="deptOptions"
      :roleOptions="roleOptions"
      :deptId="queryParams.deptId"
      @close="handleClose_1"
      @ok="addUser"
    />

    <!-- 查看权限的Dialog -->
    <el-dialog
      :title="info.user.userName !== detail.userName ? '修改权限' : '查看权限'"
      center
      :visible.sync="visible_b"
      width="40%"
      :before-close="handleClose_b"
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
      <div slot="footer" v-if="info.user.userName !== detail.userName">
        <el-button type="primary" @click="handleOk_b">保 存</el-button>

        <el-button @click="handleClose_b" type="danger">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import DialogUser from "../dialog/DialogUser";

import {
  listUser,
  getUser,
  addUser,
  delUser,
  updateUser,
  resetUserPwd,
  getTreeSelect,
  saveTreeSelect
} from "@/api/system/user";
import { mapGetters, mapMutations, mapState } from 'vuex'
export default {
  name: "userPage",
  components: {
    DialogUser,
  },
  data() {
    return {
      detail: {
        userName: null,
        userId: null
      },
      /* 查看权限按钮 */
      loadingPower: false,
      checkedKeys: [], // 选中的keys
      /* 树形控件 */
      treeData: [],
      loadingPwd: false,
      loadingUpdate: false,
      /* 当前选中的id */
      // deptId: null,
      /* 根节点id */
      orgId: null,
      form: {
        nickName: null, // 昵称
        phonenumber: null, // 联系方式
        userName: null, // 用户名
        password: null, // 密码
        leader: null, // 负责人
        roleId: null,
        deptId: null, // 用户组
        type: null, // 用户类型

        encrypted: null, // 密保问题
        answer: null, // 答案
      },
      /* 选中的ids */
      ids: null,
      // 非多个 禁用
      multiple: true,
      /* 角色选项 */
      roleOptions: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      /* 新增修改用户的 Dialog */
      visible_1: false,
      title: null,
      /* 修改密码 */
      visible_a: false,
      /* 查看权限的 */
      visible_b: false,

      editForm: {
        userId: null,
        newPassword: null,
        newPasswordAgain: null,
      },
      editFormRules: {
        oldPassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
          { pattern: /^[a-z0-9A-Z]{8,20}$/, message: '用户密码长度必须介于 8 和 20 之间', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { pattern: /^[a-z0-9A-Z]{8,20}$/, message: '用户密码长度必须介于 8 和 20 之间', trigger: 'blur' }
        ],
        newPasswordAgain: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          { pattern: /^[a-z0-9A-Z]{8,20}$/, message: '用户密码长度必须介于 8 和 20 之间', trigger: 'blur' }
        ],
      },

      // 遮罩层
      loading: false,
      // 非单个禁用
      single: true,
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
      tableData: [],
      // 日期范围
      dateRange: [],
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orgId: null, // 根节点Id
        deptId: null, // 当前选中的机构id
        userName: null,
        nickName: null
      },
    };
  },
  computed: {
    ...mapGetters(['info']),
    ...mapState('operation', ['deptId'])
  },
  created() {
    this.deptOptions = this.info.deptPermission;
    this.queryParams.orgId = this.info.user.deptId;
    this.SET_ORGID(this.info.deptPermission[0].id)
    /* 根节点的id */
    this.orgId = this.info.user.deptId;
    this.getList();
  },
  watch: {
    // 根据名称筛选组织树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    ...mapMutations('operation', ['SET_ORGID']),
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          console.log("response: ", response);
          this.tableData = response.rows;
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
      this.queryParams.userName = null;
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
      console.log('单击节点事件', data);
      this.queryParams.userName = null;
      this.queryParams.nickName = null;
      if (this.deptId == data.id) return
      this.SET_ORGID(data.id)
      this.queryParams.deptId = data.id;
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      /* 获取角色数据 */
      const params = { type: 20 };
      getUser(null, params).then((res) => {
        console.log('获取角色数据: ', res);
        this.roleOptions = res.roles;
      });
      this.visible_1 = true;
      this.title = "新增用户";
      this.form = {};
    },
    // 点击确定 添加用户
    addUser(form) {
      this.$refs.DialogUser.$data.loading = true;
      let data = {};
      data.nickName = form.nickName;
      data.phonenumber = form.phonenumber ? form.phonenumber : null;
      data.userName = form.userName ? form.userName : null;
      data.password = form.password ? form.password : null;
      data.leader = form.leader ? form.leader : null;
      data.roleId = form.roleId ? form.roleId : null;
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
    // 删除User
    deUser() {
      console.log("this.multiple: ", this.multiple);
      this.ids = this.ids.join(",");
      // 发送请求
      delUser(this.ids).then((res) => {
        console.log("res: ", res);
        if (res.code == 200) {
          this.$message.success("删除成功");
        } else {
          this.$message.error("删除失败");
        }
        /* 获取用户列表 */
        this.getList();
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.$confirm('此操作将导出当前条件下所有数据而非选中数据', '是否确认导出?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.download(
          "/system/user/export",
          {
            ...this.queryParams,
          },
          `user_${new Date().getTime()}.xlsx`
        );
      }).catch(() => {

      })

    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log('row: ', row);
      this.loadingUpdate = true
      const userId = row.userId || this.ids;
      const params = { type: 20 };
      getUser(userId, params).then((res) => {
        console.log("获取用户信息: ", res);
        this.form = res.data;
        this.roleOptions = res.roles;
        this.form.roleId = res.roleIds[0];
        this.visible_1 = true;
        this.title = "修改用户";
        this.form.password = "";
        this.loadingUpdate = false
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);

      this.single = selection.length != 1;
      this.multiple = !selection.length;
      console.log(" this.multiple: ", this.multiple);
    },
    // 处理关闭新增dialog
    handleClose_1() {
      this.visible_1 = false;
    },

    /* 修改密码dialog */
    editPaw(row) {
      console.log(row);
      this.editForm.userId = row.userId
      this.visible_a = true;
    },
    handleCancelPwd() {
      this.$refs.editForm.resetFields();
      this.visible_a = false;
    },
    handleOkPwd() {
      const userId = this.editForm.userId;
      const newPassword = this.editForm.newPassword;
      const newPasswordAgain = this.editForm.newPasswordAgain;
      this.$refs.editForm.validate(valid => {
        if (!valid) return
        if (newPassword !== newPasswordAgain)
          return this.$notify.error('两次密码输入不一致')

        const data = {
          userId,
          password: newPassword
        }
        this.loadingPwd = true;
        // 发送请求
        resetUserPwd(data).then(res => {
          console.log('修改密码: ', res);
          if (res.code != 200) return this.$notify.error('修改失败')

          this.$notify.success('修改成功')
          this.loadingPwd = false;
          this.handleCancelPwd()
        })
      })
    },

    /* 查看权限的dialog */
    // 打开查看权限dialog
    handleLook(row) {
      this.loadingPower = true;
      console.log('row: ', row);
      this.detail.userId = row.userId;
      this.detail.userName = row.userName;
      const orgId = row.deptId.toString();
      const userId = row.userId;
      const params = {
        orgId
      }

      // 获取权限列表
      getTreeSelect(params, userId).then(res => {
        console.log('查看权限 ', res);
        if (res.code == 200) {
          this.treeData = res.depts
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(res.checkedKeys)
          })
        }
        this.loadingPower = false;
        this.visible_b = true;
      })

    },
    /* 查看权限关闭 */
    handleClose_b() {
      this.visible_b = false;
    },
    /* 查看权限保存 */
    handleOk_b() {
      console.log('this.$refs.tree.getCheckedKeys(): ', this.$refs.tree.getCheckedKeys());
      const orgIds = this.$refs.tree.getCheckedKeys()
      const userId = this.detail.userId;
      const data = {
        userId,
        orgIds,
      }
      saveTreeSelect(data).then(res => {
        console.log('修改权限: ', res);
        if (res.code === 200) {
          this.$notify.success('修改成功');
          this.handleClose_b()
        } else {
          this.$notify.error('修改失败')
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.tree-container {
  width: 100%;
  height: calc(100vh - 190px);
  overflow: auto;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.right {
  display: flex;
  align-items: center;
  white-space: nowrap;
}
.right ::v-deep .el-input__inner {
  width: 160px;
  height: 32px;
  line-height: 32px;
}
.right > div {
  display: flex;
  align-items: center;
  font-weight: 500;
}
.right > div span {
  margin-right: 5px;
}
.right > div:nth-child(1),
.right > div:nth-child(2) {
  margin-right: 10px;
}

::v-deep .app-container {
  padding: 0;
  height: 100%;
}
::v-deep .el-tree-node__content {
  position: relative;
}

::v-deep .fixed-width .el-button--mini {
  padding: 7px 10px;
  width: 71px;
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
