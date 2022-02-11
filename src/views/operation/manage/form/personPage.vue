<template>
  <div class="app-container main">
    <el-row :gutter="24" v-if="!isShow">
      <el-col :span="5" :xs="24">
        <div
          class="head-container"
          style="height: 48px; display: flex; justify-content: center"
        >
          <h2>组织机构</h2>
        </div>
        <div class="tree-container">
          <el-tree
            size="small"
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          >
            <template class="custom-tree-node" slot-scope="{ data }">
              <span :class="{ active: data.id == orgId }">
                {{ data.label }}
              </span>
            </template>
          </el-tree>
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="19" :xs="24">
        <el-row class="row option">
          <el-button
            icon="el-icon-plus"
            size="mini"
            type="primary"
            @click="addDialog"
            >新增</el-button
          >
          <el-button
            size="mini"
            type="danger"
            style="margin-right: 10px"
            @click="delRecord"
            :disabled="multiple"
            icon="el-icon-delete"
            >删除</el-button
          >
          <el-select
            style="margin-left: 1%"
            size="small"
            v-model="queryParams.archivesType"
            placeholder="档案类型"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-row>

        <el-table
          v-loading="loading"
          :data="userList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            type="index"
            label="序号"
            width="50"
          ></el-table-column>

          <el-table-column
            label="档案库名称"
            align="center"
            key="name"
            prop="name"
          />
          <el-table-column
            label="档案人数"
            align="center"
            key="personCount"
            prop="personCount"
            :show-overflow-tooltip="true"
          />

          <el-table-column
            label="创建时间"
            align="center"
            prop="updateTime"
            width="160"
          >
            <template #default:scope>
              <span>{{ scope.row.updateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="档案库类型"
            align="center"
            key="archivesType"
            prop="archivesType"
          >
            <template slot-scope="scope">
              <el-tag type="success">
                <span>{{
                  scope.row.archivesType == 1 ? '内部员工档案' : '客户档案'
                }}</span>
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="250"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleUpdate(scope.row)"
                icon="el-icon-edit"
                >编辑</el-button
              >

              <el-button
                size="mini"
                type="success"
                @click="handleLook(scope.row)"
                >查看</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
                icon="el-icon-delete"
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
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 人员详情页面 -->
    <person-detail-page
      ref="detail_page"
      :orgId="orgId"
      @onSwitch="handleSwitch"
      v-else
    ></person-detail-page>

    <!-- 新建档案 -->
    <el-dialog
      :title="title"
      center
      :visible.sync="visible"
      width="40%"
      :before-close="handleCancel"
    >
      <div class="select" style="margin-bottom: 10px; width: 100%">
        <span style="font-weight: 500; color: #000">档案类型：</span>
        <el-select
          style="width: 80%"
          v-model="form.archivesType"
          placeholder="档案类型"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="input" style="width: 100%">
        <span style="font-weight: 500; color: #000">档案名称：</span>
        <el-input
          style="width: 80%"
          v-model="form.name"
          placeholder="档案名称"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleOk">保 存</el-button>
        <el-button type="danger" @click="handleCancel">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listArchives, addRecord, delRecord } from '@/api/device/archives'
import personDetailPage from './personDetailPage'
import { mapState, mapGetters, mapMutations } from 'vuex';

const typeOptions = [
  { value: 1, label: '内部员工档案' },
  { value: 3, label: '客户档案' },
];
export default {
  name: 'personnelPage',
  components: {
    personDetailPage,
  },
  data() {
    return {
      orgId: null,
      /* dialog */
      title: null, // dialog标题
      visible: false,
      form: {
        id: undefined,
        name: '', // 档案名称
        archivesType: null, // 档案类型
        orgId: ''
      },
      isShow: false,
      archivesId: '',
      // 遮罩层
      loading: true,
      // 非多个 禁用
      multiple: true,
      // 非单个禁用
      single: true,
      // 选中的ids
      ids: null,
      // 显示搜索条件
      showSearch: true,
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 部门树选项
      deptOptions: [],
      // 部门名称
      deptName: undefined,
      userList: [],
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orgId: null,
        archivesType: 1, // 档案类型
      },
      typeOptions: typeOptions,
    }
  },
  created() {
    this.deptOptions = this.info.deptPermission;
    this.queryParams.orgId = this.$store.getters.info.user.orgId;
    this.orgId = this.deptId;
    this.getList();
  },
  watch: {
    // 根据名称筛选组织树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
    "queryParams.archivesType"(val) {
      this.getList()
    },
    // vuex deptId
    deptId(val) {
      this.orgId = val;
      this.queryParams.orgId = val;
      this.getList()
    },
  },
  computed: {
    ...mapGetters(['info']),
    ...mapState('operation', ['deptId'])
  },
  methods: {
    ...mapMutations('operation', ['SET_ORGID']),
    /* dialog */
    // 新建档案
    addDialog() {
      this.title = '新建档案'
      this.visible = true
    },
    // 处理关闭
    handleCancel() {
      this.form = {
        id: null,
        name: null, // 档案名称
        archivesType: null, // 档案类型
        orgId: null
      }
      this.visible = false
    },
    // 处理保存
    handleOk() {
      if (!this.form.archivesType) return this.$notify.info('档案类型不能为空')
      if (!this.form.name) return this.$notify.info('名称不能为空')
      const data = {
        id: this.form.id,
        name: this.form.name,
        archivesType: this.form.archivesType,
        orgId: this.orgId
      }
      // 请求
      addRecord(data).then(res => {
        if (res.code === 200) {
          this.$message.success('添加成功')
          this.getList()
        } else {
          this.$message.error('添加失败')
        }
        this.handleCancel()
      })
    },
    // 处理删除档案库
    delRecord() {
      // 发送请求
      delRecord({ ids: this.ids }).then(res => {
        if (res.code == 200) {
          this.$message.success('删除成功')
          this.getList()
        } else {
          this.$message.error('删除失败')
        }
        this.getList();
      })
    },
    // 处理查看
    handleLook(record) {
      this.isShow = true
      const archivesId = record.id
      sessionStorage.setItem('archivesId', JSON.stringify(archivesId))
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      listArchives(this.queryParams)
        .then(response => {
          console.log(response.rows);
          this.userList = response.rows;
          this.total = parseInt(response.total);
          this.loading = false;
        }
        );
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      if (this.orgId == data.id) return
      this.SET_ORGID(data.id)
      this.queryParams.orgId = data.id;
      this.getList();
    },

    /** 编辑按钮操作 */
    handleUpdate(row) {
      console.log(row);
      const archivesType = parseInt(row.archivesType)
      this.title = '编辑'
      this.visible = true
      this.form.name = row.name
      this.form.archivesType = archivesType;
      this.form.id = row.id
      this.form.orgId = row.orgId
    },
    /** 处理删除 */
    handleDelete(row) {
      delRecord({ ids: [row.id] }).then(res => {
        if (res.code == 200) {
          this.$message.success('删除成功')
          this.getList()
        } else {
          this.$message.error('删除失败')
        }
        this.getList();
      })
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    handleSwitch() {
      this.isShow = !this.isShow
    }
  },
}
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
}

.input {
  white-space: nowrap; /* 禁止自动换行 */
}
::v-deep .app-container {
  padding: 0;
  height: 100%;
}
::v-deep .el-tree-node__content {
  position: relative;
}
.app-tree-option {
  position: absolute;
  right: 0;
  top: 0;
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
