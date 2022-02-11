/* 研判告警 */
<template>
  <div class="app_container main">
    <div class="row option">
      <div class="left">
        <el-button
          size="mini"
          style="margin-right: 10px"
          type="danger"
          icon="el-icon-delete"
          :disabled="multiple"
          @click="handleDelete()"
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
            :disabled="loading ? true : tableData.length == 0"
            >导出</el-button
          >
        </excel-export>
      </div>
      <el-form class="right" :inline="true" :model="queryParams">
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
        <el-form-item>
          <el-select
            v-model="warningType"
            clearable
            placeholder="请选择预警类型"
            size="small"
          >
            <el-option
              v-for="item in options_warningType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            size="mini"
            type="primary"
            @click="handleQuery"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <main>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="80"></el-table-column>
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="orgId" label="预警区域">
          <template #default="scope">
            <div>
              {{ setDepartment(deptPermission, +scope.row.orgId) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="strategyName" label="预警类型">
          <template #default="scope">
            <div>
              {{
                scope.row.strategyName == 1
                  ? '账号数据异常'
                  : scope.row.strategyName == 2
                  ? '事件告警异常'
                  : '暂无'
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column width="300" prop="alarmMatter" label="预警内容">
          <template #default="scope">
            <div>
              {{
                scope.row.alarmMatter == 1
                  ? '账号综合评分过低'
                  : scope.row.alarmMatter == 2
                  ? '账号警情处置比例过低'
                  : scope.row.alarmMatter == 3
                  ? '频繁触发 ' + alarmNameArr[scope.row.algorithmId] + ' 告警'
                  : scope.row.alarmMatter == 4
                  ? alarmNameArr[scope.row.algorithmId] + ' 告警高于历史平均值'
                  : scope.row.alarmMatter == 5
                  ? alarmNameArr[scope.row.algorithmId] +
                    ' 告警在 ' +
                    scope.row.startTime +
                    '-' +
                    scope.row.entTime +
                    ' 内告警高于历史平均值'
                  : scope.row.alarmMatter == 6
                  ? alarmNameArr[scope.row.algorithmId] +
                    ' 告警已超过当天预警上限值'
                  : '暂无'
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="200"
          prop="updateTime"
          label="预警时间"
        ></el-table-column>
        <el-table-column prop="historicalData" label="历史数据">
          <template #default="scope">
            <div>
              {{
                scope.row.historicalData == 1
                  ? '无'
                  : scope.row.historicalData == 2
                  ? '最近30天平均值'
                  : '暂无'
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="valueRange" label="取值范围">
          <template #default="scope">
            <div>
              {{
                scope.row.valueRange == 1
                  ? '一个小时内'
                  : scope.row.valueRange == 2
                  ? '当天数据'
                  : scope.row.valueRange == 3
                  ? '当月数据'
                  : '暂无'
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="lineOf" label="预警线标准">
          <template #default="scope">
            <div>
              {{
                warningValueArr[scope.row.warningValue - 1] + scope.row.lineOf
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="currentData" label="当前数据"></el-table-column>
        <el-table-column
          prop="disposeResults"
          label="处理结果"
        ></el-table-column>
        <el-table-column
          prop="disposeDetails"
          label="处理详情"
        ></el-table-column>
        <el-table-column prop="principal" label="负责人"></el-table-column>
      </el-table>
    </main>
    <div style="margin-top: 15px">
      <el-pagination
        style="display: flex; justify-content: end"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pageNum"
        :page-size="queryParams.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getJudgedSelect, getJudgedDelete, getAlgorithmList } from "@/api/alarm/alarm"
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
      /* 表格遮罩层 */
      loading: false,
      /* 选中的删除项 */
      dis: [],
      multiple: true,
      tableData: [],
      // 显示搜索条件
      total: 0,
      dateRange: [],
      warningType: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      options_warningType: [
        { label: '账号数据异常', value: 1 },
        { label: '事件告警异常', value: 2 }
      ],
      deptPermission: [],
      warningValueArr: ['低于', '高于'],
      alarmNameArr: []
    }
  },
  created() {
    this.deptPermission = this.$store.getters.info.deptPermission;
    this.getJudgedSelect()
    this.getAlgorithmList()
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
          this.alarmNameArr[it.id] = it.name;
        })
      });
    },
    // 查询
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getJudgedSelect()
    },
    // 重置
    resetQuery() {
      this.warningType = null;
      this.dateRange = null;
      this.getJudgedSelect()
    },
    getJudgedSelect() {
      const queryParams = {
        startDate: this.dateRange ? this.dateRange[0] : null,
        endDate: this.dateRange ? this.dateRange[1] : null,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
        strategyName: this.warningType
      }
      getJudgedSelect(queryParams).then(res => {
        this.tableData = res.rows
        this.ExcelExport(res.rows)
        this.total = parseInt(res.total)
      })
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.getJudgedSelect()
    },
    setDepartment(arr, id) {
      let _this = this
      for (let i = 0; i < arr.length; i++) {
        let str = arr[i]
        if (str.id === id) {
          return str.label
        } else {
          if (str.children && str.children.length > 0) {
            let res = _this.setDepartment(str.children, id)
            if (res) {
              return res
            }
          }
        }
      }
    },
    /* 处理删除 */
    handleDelete() {
      getJudgedDelete({ ids: this.ids }).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: "Success",
            message: "删除成功",
            type: "success",
            duration: 2000,
          });
          this.getJudgedSelect()
        }
      })
    },
    ExcelExport(data) {
      const title = '研判告警';
      let tableItems = [];
      this.excelExport.filename = title;
      data.length && data.forEach((item, index) => {
        tableItems.push({
          index: index + 1,
          orgId: this.setDepartment(this.deptPermission, item.orgId),
          strategyName: item.strategyName && item.strategyName == 1
            ? '账号数据异常'
            : item.strategyName == 2
              ? '事件告警异常'
              : '暂无',
          alarmMatter: item.alarmMatter && item.alarmMatter == 1
            ? '账号综合评分过低'
            : item.alarmMatter == 2
              ? '账号警情处置比例过低'
              : item.alarmMatter == 3
                ? '频繁触发 ' + this.alarmNameArr[item.algorithmId + ''] +
                ' 告警'
                : item.alarmMatter == 4
                  ? this.alarmNameArr[item.algorithmId + ''] +
                  ' 告警高于历史平均值'
                  : item.alarmMatter == 5
                    ? this.alarmNameArr[item.algorithmId + ''] +
                    ' 告警在 ' +
                    item.startTime + '-' + item.entTime +
                    ' 内告警高于历史平均值'
                    : item.alarmMatter == 6
                      ? (this.alarmNameArr[item.algorithmId + ''] + ' 告警已超过当天预警上限值') : '暂无',
          updateTime: item.updateTime ? item.updateTime : '暂无',
          historicalData: item.historicalData && item.historicalData == 1
            ? '无'
            : item.historicalData == 2
              ? '最近30天平均值'
              : '暂无',
          valueRange: item.valueRange && item.valueRange == 1
            ? '一个小时内'
            : item.valueRange == 2
              ? '当天数据'
              : item.valueRange == 3
                ? '当月数据'
                : '暂无',
          lineOf: item.lineOf ? this.warningValueArr[item.warningValue - 1] + item.lineOf : '暂无',
          currentData: item.currentData ? item.currentData : '暂无',
          disposeResults: item.disposeResults ? item.disposeResults : '暂无',
          disposeDetails: item.disposeDetails ? item.disposeDetails : '暂无',
          principal: item.principal ? item.principal : '暂无'
        })
      })
      this.excelExport.sheet = [];
      this.excelExport.sheet.push({
        title,
        multiHeader: [[], ['序号', '预警区域', '预警类型', '预警内容', '预警时间', '历史数据', '取值范围', '预警线标准', '当前数据', '处理结果', '处理详情', '负责人']],
        table: [...tableItems],
        keys: ['index', 'orgId', 'strategyName', 'alarmMatter', 'updateTime', 'historicalData', 'valueRange',
          'lineOf', 'currentData', 'disposeResults', 'disposeDetails', 'principal'],
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
    /* 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.multiple = !selection.length;
    },
  },
};
</script>

<style lang="scss" scoped>
.color {
  color: #5676dbff;
}

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
