<template>
  <div class="devicePage_con">
    <div class="row">
      <div class="left">
        <el-button
          size="mini"
          icon="el-icon-plus"
          type="primary"
          @click="handleEdit"
          >新增</el-button
        >
        <el-button
          size="mini"
          type="danger"
          :disabled="multiple"
          @click="handleRemove"
          icon="el-icon-delete"
          >删除</el-button
        >
      </div>
      <!-- 暂时隐藏 -->
      <!-- <div class="right">
        <el-form :inline="true" :model="queryParams">
          <el-form-item>
            <el-input
              size="small"
              v-model="queryParams.address"
              placeholder="管控区域"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery"
              >查询</el-button
            >
            <el-button size="mini" icon="el-icon-refresh" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div> -->
    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column
        align="center"
        type="index"
        label="序号"
      ></el-table-column>
      <el-table-column
        prop="deviceName"
        label="算法服务器名称"
      ></el-table-column>
      <!-- <el-table-column align="center" prop="groupName" label="地区名称">
        </el-table-column>
        <el-table-column prop="areaName" label="站点名称/油库名称">
        </el-table-column> -->
      <el-table-column prop="deviceIp" label="设备IP" align="center">
      </el-table-column>
      <el-table-column prop="snNum" label="设备SN" align="center">
      </el-table-column>
      <el-table-column label="状态" width="50" align="center">
        <template slot-scope="{ row }">
          <div :class="['status', row.status ? 'success' : 'danger']"></div>
        </template>
      </el-table-column>
      <!-- <el-table-column
          align="center"
          prop="version"
          label="版本更新"
          width=""
        ></el-table-column> -->
      <el-table-column align="center" label="管理" width="170">
        <template slot-scope="scope">
          <div class="manage">
            <el-button plain size="mini">重启</el-button>
            <el-button
              class="blue"
              plain
              size="mini"
              @click="goSetting(scope.row)"
              >摄像机设置</el-button
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="80">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="handleEdit(scope.row)"
            >编辑</el-button
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

    <!-- dialog -->
    <el-dialog
      :title="titleModel"
      :visible.sync="visible"
      @close="handleCancel"
      width="50%"
    >
      <el-form :model="form" ref="form" :rules="formRules">
        <el-form-item
          prop="deviceName"
          label="算法服务器名称"
          placeholder="算法服务器名称"
          label-width="120px"
        >
          <el-input v-model="form.deviceName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          prop="grouping"
          label="地区名称"
          placeholder="请输入地区名称"
          label-width="120px"
        >
          <el-input v-model="form.grouping" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="orgId" label="站点/油库名称" label-width="120px">
          <treeselect
            v-model="form.orgId"
            :options="treeData"
            :show-count="true"
            :flat="true"
            placeholder="站点/油库名称"
            :normalizer="my_normalizer"
          />
        </el-form-item>
        <el-form-item
          prop="deviceIp"
          label="设备IP"
          placeholder="请输入设备IP"
          label-width="120px"
        >
          <el-input v-model="form.deviceIp" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          prop="snNum"
          label="设备SN"
          placeholder="请输入设备SN"
          label-width="120px"
        >
          <el-input v-model="form.snNum" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleManuallyOk">保 存</el-button>
        <el-button type="danger" @click="handleCancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TopRow from "@/components/Xiaomi/topRow/TopRow";
import { listAlgorithm } from "@/api/device/algorithm";
import { listBindServer, saveServer, delServer } from "@/api/device/server";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: {
    TopRow,
    Treeselect,
  },
  props: {
    orgId: {
      type: Number,
      default: null,
    }
  },
  data() {
    return {
      /* 替换 treeNode 中 title,value,key,children 字段为 treeData 中对应的字段	 */
      replaceFields: {
        children: "children",
        title: "label",
        key: "id",
        value: "id",
      },
      treeData: [],
      visible: false,
      titleModel: "",
      searchVisible: false,
      form: {
        id: "",
        deviceName: null,
        grouping: null, // 分组
        orgId: null, // 管控区域
        deviceIp: null,
        snNum: null,
      },
      formRules: {
        name: [{ required: true, message: "请输入设备名称", trigger: "blur" }],

        orgId: [{ required: true, message: "请选择管控区域", trigger: "blur" }],
        deviceIp: [
          { required: true, message: "请输入设备IP", trigger: "blur" },
        ],
        snNum: [{ required: true, message: "请输入设备SN", trigger: "blur" }],
      },
      tableData: [],
      searchData: [],
      total: 0,
      loading: false,
      /* 是否选中了 */
      multiple: true,
      /* 选中的ids */
      ids: [],
      searchParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        address: null,
        orgId: null,
      },
    };
  },
  watch: {
    orgId(val) {
      this.queryParams.orgId = val;
      this.getList();
    },
  },
  created() {
    this.getList();
    this.setTreeselect();
  },
  methods: {
    /* 获取服务器列表 */
    getList() {
      this.loading = true;
      listAlgorithm(this.queryParams).then((response) => {
        console.log('response: ', response);
        this.tableData = response.rows.slice(0, 1)
        this.total = this.tableData.length;
        this.loading = false;
      });
    },

    /** 设置部门下拉树结构 */
    setTreeselect() {
      this.treeData = this.$store.getters.deptPermissions;
    },
    /* 处理 添加/编辑 */
    handleEdit(record) {
      this.visible = true;
      if (record && record.id) {
        this.titleModel = "编辑";
        Object.assign(this.form, record);
      } else {
        this.titleModel = "添加";
      }
    },
    /* 处理删除 */
    handleRemove() {
      this.$confirm('此操作将永久删除该服务器, 请谨慎操作', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delServer(this.ids).then(res => {
          console.log('处理删除: ', res);
          if (res.code == 200) {
            this.$notify.success('删除成功')
          } else {
            this.$notify.error('删除失败')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      console.log('this.ids: ', this.ids);
    },
    handleSearchOpen() {
      this.searchVisible = true;
      this.searchList();
    },
    searchList() {
      listBindServer(this.searchQuery).then((res) => {
        this.searchData = res.rows;
        this.total = parseInt(res.total);
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /* 重置搜索 */
    resetQuery() {
      this.queryParams.address = null;
      this.handleQuery()
    },
    // vue treeselect 禁止选择某些节点
    my_normalizer(node) {
      return {
        id: node.id,
        label: node.label,
        children: node.children,
        isDisabled: node.type == "1" ? true : false,
      };
    },
    // 点击跳转摄像机设置
    goSetting(row) {
      console.log('row', row);
      this.$bus.$emit('setId', row)
      this.$emit("onChange", '', true);
    },
    /* 处理表格选中 */
    handleSelectionChange(val) {
      this.ids = val.map(item => item.id)
      console.log('this.ids: ', this.ids);
      this.multiple = !val.length;
    },

    // 处理新增dialog关闭
    handleCancel() {
      this.$refs.form.resetFields()
      this.visible = false;
      this.searchVisible = false;
    },
    /* 处理保存 */
    handleManuallyOk() {
      const that = this;
      this.$refs.from.validate((valid) => {
        if (valid) {
          const data = that.form;
          // 请求
          saveServer(data).then((res) => {
            if (res.code === 200) {
              this.$message.success("添加成功");
              this.getList();
            } else {
              this.$message.error("添加失败");
            }
            this.handleCancel();
          });
        }
      });
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
  align-items: center !important;
  justify-content: space-between;
  height: 32px;

  .left {
    display: flex;
    align-items: center;
  }
  .right {
    display: flex;
    align-items: center;
    white-space: nowrap;
  }
}

.devicePage_con {
  width: 100%;
  height: 100%;
}

.devicePage_con .main {
  width: 100%;
  background: #ffffff;
  border-radius: 11px;
}
.right {
  display: flex;
  align-items: center;
  white-space: nowrap;
}
.right .el-form-item:last-child {
  margin-right: 0;
}
.devicePage_con {
  .el-button {
    &.status {
      transform: translate(-5px);
    }
  }
  .manage {
    display: flex;
    .el-button--mini {
      padding: 7px 15px;
      font-size: 12px;
      border-radius: 3px;
      border: 1px solid #ff7c6dff;
      color: #ff7c6dff;
    }
    .el-button--mini:last-child {
      color: #4aa1ecff;
      border: 1px solid #4aa1ecff !important;
    }
  }
}

::v-deep .el-form el-form--inline {
  height: 32px;
}
</style>
