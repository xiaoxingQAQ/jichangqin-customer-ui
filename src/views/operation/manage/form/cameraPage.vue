<template>
  <div class="app-container camera">
    <el-row class="camera" :gutter="20">
      <el-col class="camera" :span="24" :xs="24">
        <div class="row option">
          <div class="left">
            <el-button size="mini" type="danger" @click="goBack"
              ><i class="el-icon-back">&nbsp返回</i></el-button
            >
            <el-button
              icon="el-icon-plus"
              size="mini"
              type="primary"
              @click="handleAdd"
              >新增</el-button
            >
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="handleAdd"
              >删除</el-button
            >
            <!-- <el-button size="mini" type="success" @click="handleSync"
              >同步</el-button
            > -->
          </div>
          <el-form
            class="right"
            ref="queryForm"
            :inline="true"
            :model="queryParams"
          >
            <el-form-item>
              <el-input
                size="small"
                v-model="queryParams.address"
                placeholder="请输入设备IP"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-input
                size="small"
                v-model="queryParams.name"
                placeholder="请输入设备名称"
              ></el-input>
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
        </div>
      </el-col>
    </el-row>
    <el-row class="camera">
      <el-table
        v-loading="loading"
        :data="userList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <!--        <el-table-column-->
        <!--          label="编号"-->
        <!--          align="center"-->
        <!--          key="id"-->
        <!--          prop="id"-->
        <!--          v-if="columns[0].visible"-->
        <!--        />-->
        <el-table-column
          label="设备名称"
          align="center"
          key="name"
          prop="name"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="IP地址"
          align="center"
          key="address"
          prop="address"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="事件检测"
          key=""
          prop=""
          width="500"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{ row }">
            <el-tag
              style="margin-left: 5px"
              v-for="(item, index) in row.algorithmName"
              :key="index"
            >
              {{ item }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          key="status"
          v-if="columns[5].visible"
          width="50"
        >
          <template slot-scope="{ row }">
            <div :class="['status', row.status ? 'success' : 'danger']"></div>
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
          width="300"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="handleEdit(row)"
              >修改</el-button
            >
            <el-button size="mini" type="warning">联动</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button size="mini" type="success">布控</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加的对话框 -->
      <el-dialog
        :title="title"
        :visible.sync="visible"
        width="50%"
        :before-close="handleClose"
      >
        <el-form
          ref="form"
          :model="form"
          :rules="formRules"
          label-width="100px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="协议" prop="protocol">
                <el-select
                  style="width: 100%"
                  v-model="form.protocol"
                  placeholder="请选择协议"
                >
                  <el-option
                    v-for="item in protocolOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备IP" prop="address">
                <el-input
                  v-model="form.address"
                  placeholder="请输入设备IP"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="通道号" prop="snNum">
                <el-input
                  v-model.number="form.snNum"
                  placeholder="请输入通道号"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备名称" prop="name">
                <el-input
                  v-model="form.name"
                  placeholder="请输入设备名称"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户名" prop="userName">
                <el-input
                  style="width: 100%"
                  v-model="form.userName"
                  placeholder="请输入用户名"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="密码" prop="passWord">
                <el-input
                  show-password
                  type="password"
                  v-model="form.passWord"
                  placeholder="请输入密码"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="机构" prop="orgId">
                <el-cascader
                  :disabled="true"
                  class="camera"
                  ref="cascaderAder"
                  style="margin-left: 0.5%; width: 100%"
                  collapse-tags
                  placeholder="请选择机构"
                  :options="deptOptions"
                  :props="{
                    value: 'id',
                    label: 'label',
                    checkStrictly: true,
                    emitPath: false,
                  }"
                  :show-all-levels="false"
                  v-model="form.orgId"
                >
                  <template slot-scope="{ node, data }">
                    <i :class="data.icon"></i>&nbsp
                    <span
                      :class="{ active: form.orgId == data.id }"
                      @click="handleNodeClick(node, data)"
                      >{{ data.label }}</span
                    >
                  </template>
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :label="protocolStr ? protocolStr + '端口' : '端口'"
                prop="port"
              >
                <el-input
                  v-model.number="form.port"
                  :placeholder="
                    protocolStr
                      ? '请输入' + protocolStr + '的端口'
                      : '请输入端口'
                  "
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="open" label="主码流URL" prop="mainStreamUrl">
            <el-input v-model="form.mainStreamUrl"></el-input>
          </el-form-item>
          <el-form-item v-if="open" label="子码流URL" prop="subStreamUrl">
            <el-input v-model="form.subStreamUrl"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="primary" @click="handleOk">确 定</el-button>
          <el-button @click="handleClose" type="danger">关闭</el-button>
        </div>
      </el-dialog>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-row>
  </div>
</template>

<script>
import { listCamera, syncCamera, saveCamera, deleteCamera } from "@/api/device/camera";
import { mapGetters } from 'vuex';
const protocolOption = [
  { value: 'Onvif', label: 'Onvif' },
  { value: 'RTSP', label: 'RTSP' },
  { value: 'RTMP', label: 'RTMP' },
];
export default {
  data() {
    return {
      open: false,
      protocolStr: null,
      form: {
        serverId: null, // 服务ID
        protocol: null, // 协议
        address: null, // 设备IP
        snNum: null, // 通道号
        name: null, // 摄像机名称
        userName: null,
        passWord: null,
        orgId: null,
        port: null, // RTSP端口
        mainStreamUrl: null, // 主码流
        subStreamUrl: null, // 子码流
      },
      formRules: {
        protocol: [
          { required: true, message: '协议不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '设备IP不能为空', trigger: 'blur' }
        ],
        snNum: [
          { required: true, message: '通道号不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '摄像机名称不能为空', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        passWord: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        orgId: [
          { required: true, message: '机构不能为空', trigger: 'blur' }
        ],
        port: [
          { required: true, message: 'RTSP端口不能为空', trigger: 'blur' }
        ],
        mainStreamUrl: [
          { required: true, message: '主码流不能为空', trigger: 'blur' }
        ],
        subStreamUrl: [
          { required: true, message: '子码流不能为空', trigger: 'blur' }
        ],
      },
      // 协议选项数据 
      protocolOption: protocolOption,
      // 添加设备
      title: null,
      visible: null,
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
      deptOptions: [],
      // 部门名称
      deptName: null,
      userList: [],
      // 日期范围
      dateRange: [],
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        orgId: null,
        serverId: null,
        pageNum: 1,
        pageSize: 10,

        address: null,
        name: null,
      },
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `用户名称`, visible: true },
        { key: 2, label: `用户昵称`, visible: true },
        { key: 3, label: `部门`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `状态`, visible: true },
        { key: 6, label: `创建时间`, visible: true },
      ],
    };
  },
  computed: {
    ...mapGetters(['info'])
  },
  watch: {
    serverId(val) {
      this.queryParams.serverId = val;
    },
    "form.protocol"(val) {
      switch (val) {
        case 'Onvif':
          this.open = false;
          this.protocolStr = 'Onvif';
          break;
        case 'RTSP':
          this.open = true;
          this.protocolStr = 'RTSP';
          break;
        case 'RTMP':
          this.open = true;
          this.protocolStr = 'RTMP';
          break;
        default:
          this.open = false;
          break;
      }
    }
  },
  created() {
    this.deptOptions = this.info.deptPermission
  },
  mounted() {
    this.$bus.$on("setId", (row) => {
      this.queryParams.serverId = row.id;
      this.queryParams.orgId = row.orgId;
      this.getList();
    });
  },
  methods: {
    goBack() {
      this.queryParams.address = null;
      this.queryParams.name = null;
      this.resetForm("queryForm");
      this.$emit("onChange", "", false);
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      listCamera(this.queryParams).then(response => {
        console.log('response: ', response);
        this.userList = response.rows;
        console.log('this.userList : ', this.userList);
        this.total = parseInt(response.total);
        this.loading = false;
      }
      );
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.visible = true;
      this.form.orgId = parseInt(this.queryParams.orgId);
      this.form.serverId = this.queryParams.serverId;
      this.title = '新增设备'
    },
    handleEdit(row) {
      this.form.id = row.id;
      this.form.protocol = row.protocol;
      this.form.address = row.address;
      this.form.snNum = row.snNum;
      this.form.name = row.name;
      this.form.userName = row.userName;
      this.form.passWord = row.passWord;
      this.form.orgId = parseInt(row.orgId);
      this.form.port = row.port;
      this.form.mainStreamUrl = row.mainStreamUrl;
      this.form.subStreamUrl = row.subStreamUrl;

      this.visible = true;
      this.title = '修改设备信息'
    },
    /* 重置表单 */
    reset() {
      this.form = {
        serverId: null,
        protocol: null, // 协议
        address: null, // 设备IP
        snNum: null, // 通道号
        name: null, // 摄像机名称
        userName: null,
        passWord: null,
        orgId: null,
        port: null, // RTSP端口
        mainStreamUrl: null, // 主码流
        subStreamUrl: null, // 子码流
      }
      this.$refs.form.resetFields()
    },
    handleClose() {
      this.reset()
      this.visible = false
    },
    handleOk() {
      this.$refs.form.validate(valid => {
        if (!valid) return

        if (!this.form.id) {
          saveCamera(this.form).then(res => {
            if (res.code == 200) {
              this.$notify.success('添加成功')
              this.handleClose()
              this.getList()
            } else {
              this.$notify.error('添加失败')
            }
          })
        } else {
          saveCamera(this.form).then(res => {
            if (res.code == 200) {
              this.$notify.success('修改成功')
              this.handleClose()
              this.getList()
            } else {
              this.$notify.error('修改失败')
            }
          })
        }
      })
    },
    /* 节点单击事件 */
    handleNodeClick(node, data) {
      this.form.orgId = data.id;
      this.$refs.cascaderAder.dropDownVisible = false
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.address = null;
      this.queryParams.name = null;
      this.handleQuery();
    },
    /* 处理同步 */
    handleSync() {
      const params = {
        serverId: this.queryParams.serverId
      }
      console.log('params', params);
      /* 发送请求 */
      syncCamera(params).then(res => {
        console.log('同步: ', res);
        if (res.code === 200) {
          this.$notify.success('同步成功')
          this.getList()
        } else {
          this.$notify.success('同步失败')
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
  },
};
</script>

<style lang="scss" scoped>
.status {
  margin-left: 3.5px;
  width: 26px;
  height: 26px;
  border-radius: 4px;
  &.success {
    background-color: #13ce66;
  }
  &.danger {
    background-color: #ff4949;
  }
}

.row {
  display: flex;
  justify-content: space-between;
}
/* 返回 */
.back i {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}
.back i:hover {
  color: #409eff;
}

.row {
  margin-bottom: 10px;
}

::v-deep .app-container {
  padding: 0;
}
::v-deep .el-tree-node__content {
  position: relative;
}

::v-deep .el-form-item {
  margin-bottom: 10px;
}
</style>
