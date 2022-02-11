/* 任务管理页 */
<template>
  <div class="app_container">
    <div class="row option">
      <div class="left">
        <el-button
          size="mini"
          type="danger"
          style="margin-right: 10px"
          :disabled="multiple"
          @click="handleDelete()"
          icon="el-icon-delete"
          >删除</el-button
        >
        <excel-export
          :bookType="excelExport.bookType"
          :filename="excelExport.filename"
          :sheet="excelExport.sheet"
          :on-error="onError"
        >
          <el-button
            size="mini"
            type="success"
            icon="el-icon-download"
            :disabled="loading ? true : userList.length == 0"
            >导出</el-button
          >
        </excel-export>
      </div>
      <el-form
        ref="queryForm"
        class="right"
        :inline="true"
        :model="queryParams"
      >
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
        </el-form-item>

        <el-form-item label="">
          <el-cascader
            size="small"
            ref="cascaderAder"
            style="margin-left: 0.5%"
            collapse-tags
            placeholder="地点"
            clearable
            :options="treeData"
            :props="{
              value: 'id',
              label: 'label',
              emitPath: false,
              multiple: true,
              clearable: true,
            }"
            :show-all-levels="false"
            v-model="queryOrgId"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item>
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
        </el-form-item>
      </el-form>
    </div>

    <main>
      <el-table
        v-loading="loading"
        :data="userList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column
          label="加油站名称"
          align="center"
          key="stationName"
          prop="stationName"
        />
        <el-table-column
          label="内容"
          align="center"
          key="context"
          prop="context"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          label="操作人"
          align="center"
          key="createByName"
          prop="createByName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="时间"
          align="center"
          key="createTime"
          prop="createTime"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="管理"
          align="center"
          width="160"
          class-name="small-padding fixed-width"
        >
          <template #default="{ row }">
            <el-button
              size="small"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        class="pagination"
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getTaskList"
      />
    </main>
  </div>
</template>

<script>
import { getTaskList, delTaskList } from "@/api/data/task";
import { mapGetters } from 'vuex';

import { ExcelExport } from 'pikaz-excel-js';
export default {
  components: { ExcelExport },
  data() {
    return {
      /* 导出的配置 */
      excelExport: {
        bookType: 'xlsx',
        filename: 'export',
        sheet: [],
      },
      // 选中的ids
      ids: [],
      // 选中
      multiple: true,
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
      treeData: undefined,
      // 部门名称
      deptName: undefined,
      userList: [],
      // 日期范围
      dateRange: [],
      // 总条数
      total: 1,
      // 查询参数
      queryOrgId: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        startDate: null,
        endDate: null,
        orgId: null,
      },
    };
  },
  computed: {
    ...mapGetters(['info'])
  },
  created() {
    this.treeData = this.info.deptPermission;
    this.getTaskList();
  },
  methods: {
    /** 查询数据列表 */
    getTaskList(queryOrgId) {
      this.loading = true;
      this.queryParams.startDate = this.dateRange && this.dateRange.length ? this.dateRange[0] : null;
      this.queryParams.endDate = this.dateRange && this.dateRange.length ? this.dateRange[1] : null;
      this.queryParams.orgId = queryOrgId && queryOrgId.length ? queryOrgId.join(',') : null;

      getTaskList(this.queryParams).then(
        (response) => {
          this.userList = response.rows;
          this.total = parseInt(response.total);
          this.ExcelExport(response.rows)
          this.loading = false;
        }
      );
    },
    /* 处理删除 */
    handleDelete(id) {
      id ? this.ids = [id] : null;
      delTaskList({ ids: this.ids }).then(res => {
        this.$notify.success(res.msg)
        this.ids = []
        this.getTaskList()
      }, err => {
        this.$notify.error('删除失败')
      })
    },
    ExcelExport(data) {
      const title = '任务管理';
      let tableItems = [];
      this.excelExport.filename = title;
      data.length && data.forEach((item, index) => {
        tableItems.push({
          index: index + 1,
          stationName: item.stationName ? item.stationName : '暂无',
          context: item.context ? item.context : '暂无',
          createByName: item.createByName ? item.createByName : '暂无',
          createTime: item.createTime ? item.createTime : '暂无',
        })
      })
      this.excelExport.sheet = [];
      this.excelExport.sheet.push({
        title,
        multiHeader: [[], ['序号', '加油站名称', '内容', '操作人', '时间']],
        table: [...tableItems],
        keys: ['index', 'stationName', 'context', 'createByName', 'createTime'],
        merges: ['A2:C2'],
        sheetName: title,
        // colWidth: [16, 16, 16, 20],
        globalStyle: {
          font: {
            color: { rgb: "000" },
          }
        },
        cellStyle: [
          {
            cell: 'A1',
            font: {
              name: '宋体',
              sz: 14,
              color: { rgb: "ffffff" },
              bold: true
            },
            fill: {
              fgColor: { rgb: "808080" },
            }
          }
        ]
      })
    },
    onError(err) {
      console.error(err);
      this.$message.error(err)
    },
    exportTable() {
      this.$refs.excelExport.pikaExportExcel()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.loading = true;
      let queryOrgId = this.$refs.cascaderAder.getCheckedNodes()
      queryOrgId = queryOrgId.map(item => {
        return item.value
      })
      this.queryParams.pageNum = 1;
      this.getTaskList(queryOrgId);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.$refs.cascaderAder.$refs.panel.clearCheckedNodes()
      this.dateRange = [];
      this.queryOrgId = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.multiple = !selection.length;
    },
  },
};
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 38.94px;
  margin-bottom: 10px;
}

::v-deep.el-form-item {
  margin-bottom: 0;
}
::v-deep.el-form--inline .el-form-item:last-child {
  margin-right: 0;
}
main {
  .el-table {
    span {
      color: #5676dbff;
    }
  }
}
</style>
