<template>
  <div>
    <el-row type="flex" justify="space-between">
      <div>
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
            :disabled="loading ? true : tableData.length == 0"
            >导出</el-button
          >
        </excel-export>
      </div>
      <div>
        <el-input
          v-model="fromData.title"
          style="width: 140px"
          size="small"
          placeholder="请输入操作模块"
        ></el-input>
        <el-input
          v-model="fromData.operUserName"
          style="width: 140px; margin-left: 10px"
          size="small"
          placeholder="请输入操作人员"
        ></el-input>
        <el-date-picker
          style="width: 240px; margin-left: 10px"
          size="small"
          v-model="fromData.createTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        <el-button
          type="primary"
          style="margin-left: 10px"
          size="mini"
          @click="handleSearch"
          icon="el-icon-search"
          >查询</el-button
        >
        <el-button size="mini" icon="el-icon-refresh" @click="handleReset"
          >重置</el-button
        >
      </div>
    </el-row>
    <el-row style="margin-top: 15px">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        max-height="900px"
        style="width: 100%"
      >
        <el-table-column fixed type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="createTime" label="操作日期"> </el-table-column>
        <el-table-column prop="title" label="操作模块"> </el-table-column>
        <el-table-column prop="operIp" label="操作地址"> </el-table-column>
        <el-table-column prop="businessType" label="业务类型">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" plain>{{
              businessTypeList[scope.row.businessType]
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="operUserName" label="操作人员">
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end">
        <el-pagination
          style="display: flex; justify-content: center; margin-top: 10px"
          @current-change="handleCurrentChange"
          :current-page="tablePage.currentPage"
          :page-size="tablePage.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="tablePage.totalResult"
        >
        </el-pagination>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import { getOperationLog } from '@/api/device/operationLog'
import { ExcelExport } from 'pikaz-excel-js';
export default {
  components: {
    ExcelExport
  },
  data() {
    return {
      /* 导出的配置 */
      excelExport: {
        bookType: 'xlsx',
        filename: 'export',
        sheet: [],
      },
      // 遮罩层
      loading: false,
      fromData: {
        title: '', // 操作模块
        operUserName: '', // 操作人员
        status: '', // 状态
        createTime: [], // 时间
      },
      // 表格数据
      tableData: [],
      // 表格分页数据
      tablePage: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0,
      },
      businessTypeList: ["其他", "新增", "修改", "删除", "授权", "导出", "导入", "强退", "生成代码", "清空数据", '添加/修改'],
    }
  },
  created() {
    this.getOperationLog()
    this.getOperationLogAll()
  },
  methods: {
    // 表格分页 current
    handleCurrentChange(data) {
      this.tablePage.currentPage = data
      this.getOperationLog()
    },
    getOperationLogAll() {
      getOperationLog({
        title: this.fromData.title, // 系统模块
        operUserName: this.fromData.operUserName, // 操作人员
        status: this.fromData.status, // 状态
        startDate: this.fromData.createTime.length > 0 ? this.fromData.createTime[0] : '',
        endDate: this.fromData.createTime.length > 0 ? this.fromData.createTime[1] : '',
      }).then(res => {
        this.ExcelExport(res.rows)
      })
    },
    getOperationLog() {
      this.loading = true;
      console.log(this.fromData);
      getOperationLog({
        title: this.fromData.title, // 系统模块
        operUserName: this.fromData.operUserName, // 操作人员
        status: this.fromData.status, // 状态
        startDate: this.fromData.createTime.length > 0 ? this.fromData.createTime[0] : '',
        endDate: this.fromData.createTime.length > 0 ? this.fromData.createTime[1] : '',
        pageNum: this.tablePage.currentPage,
        pageSize: this.tablePage.pageSize
      }).then(res => {
        console.log(res)
        this.tableData = res.rows;
        this.tablePage.totalResult = + res.total;
        // this.ExcelExport(res.rows)
        this.loading = false;

      })
    },
    // 导出
    ExcelExport(data) {
      const title = '操作日志';
      let tableItems = [];
      this.excelExport.filename = title;
      data.length && data.forEach((item, index) => {
        tableItems.push({
          index: index + 1,
          title: item.title ? item.title : '暂无',
          operIp: item.operIp ? item.operIp : '暂无',
          businessType: item.businessType ? this.businessTypeList[item.businessType] : '暂无',
          operUserName: item.operUserName ? item.operUserName : '暂无',
          createTime: item.createTime ? item.createTime : '暂无',
        })
      })
      this.excelExport.sheet = [];
      this.excelExport.sheet.push({
        title,
        multiHeader: [[], ['序号', '操作模块', '操作地址', '业务类型', '操作人员', '操作日期']],
        table: [...tableItems],
        keys: ['index', 'title', 'operIp', 'businessType', 'operUserName', 'createTime'],
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
    // 搜索
    handleSearch() {
      this.getOperationLog()
    },
    // 重置
    handleReset() {
      this.fromData = {
        title: '', // 操作模块
        operUserName: '', // 操作人员
        status: '', // 状态
        createTime: [], // 时间
      }
      this.getOperationLog()
    }
  },
}
</script>

<style lang="scss" scoped>
.inputClass {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
}
::v-deep .el-pager li.active {
  background-color: #1890ff;
  color: #ffffff;
  min-width: 30px;
  border-radius: 2px;
}
.ml10 {
  margin-left: 10;
}
.header {
  line-height: 38px;
}
</style>
