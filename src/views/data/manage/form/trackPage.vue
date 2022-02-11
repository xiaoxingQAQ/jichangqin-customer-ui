/* 人车轨迹页面 */
<template>
  <div class="app_container">
    <div v-if="!reportKey">
      <el-row type="flex" justify="space-between">
        <el-col :span="6" style="box-sizing: border-box; padding: 5.5px 0 0 0">
          <el-button
            style="margin-right: 10px"
            size="mini"
            type="danger"
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
              :disabled="loading ? true : mainList.length == 0"
              icon="el-icon-download"
              >导出</el-button
            >
          </excel-export>
        </el-col>
        <el-col
          :span="18"
          style="
            display: flex;
            justify-content: end;
            box-sizing: border-box;
            padding: 5.5px 0 0 0;
          "
        >
          <el-form class="right" :inline="true">
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
              <el-select
                size="small"
                v-model="queryParams.data_type"
                placeholder="类型"
                style="width: 140px"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <!-- 暂时隐藏 -->
            <!-- <el-form-item label="">
              <el-input
                size="small"
                v-model="queryParams.name"
                placeholder="姓名"
                clearable
                style="width: 140px"
              />
            </el-form-item>
            <el-form-item label="">
              <el-input
                size="small"
                v-model="queryParams.data_source"
                placeholder="车牌"
                clearable
                style="width: 140px"
              />
            </el-form-item> -->

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
              <el-button
                :disabled="true"
                size="mini"
                type="primary"
                @click="getReportQuery"
                >报表查询</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <main class="image-main">
        <div class="li" v-for="(item, index) in mainList" :key="index">
          <header>
            <ul class="left">
              <li>
                <span>{{
                  queryParams.data_type === '1' ? '姓名：' : '车牌：'
                }}</span>
                <b>{{ item.deployName }}</b>
              </li>
              <li>
                <span>{{
                  queryParams.data_type === '1' ? '性别：' : '车主：'
                }}</span>
                <b>{{ item.deploySex }}</b>
              </li>
              <li>
                <span>归档：</span>
                <b>{{ item.petrolStationName }}</b>
              </li>
              <li>
                <span>日期：</span>
                <b>{{
                  queryParams.data_type === '1'
                    ? item.createTime
                    : item.deployTime
                }}</b>
              </li>
            </ul>
            <div class="right">
              <el-image
                @dblclick="hanDblclick3(item)"
                style="width: 100%; height: 100%"
                :src="item.deployUrl"
              >
                <div class="image-slot" slot="placeholder">
                  <div>加载中...</div>
                </div>
                <div slot="error" class="image-slot">
                  <div>加载中...</div>
                </div>
              </el-image>
            </div>
          </header>
          <p>轨迹路径</p>
          <main>
            <ul>
              <li v-for="(it, index) in item.deployList" :key="index">
                <span style="">{{ index + 1 }}</span>
                <span style="flex: 0.7; text-align: center">{{ it.time }}</span>
                <span style="flex: 1; text-align: start">{{
                  it.cameraName
                }}</span>
                <b style="text-align: end" @click="particularsCilck(it)"
                  >详情</b
                >
              </li>
            </ul>
          </main>
          <footer class="footer">
            <div>
              <el-checkbox
                v-model="item.checked"
                @change="(val) => handleCheckbox(val, item)"
                style="color: #fff"
              ></el-checkbox>
            </div>
            <div>
              <el-button size="mini" type="danger">正常</el-button>
              <el-button size="mini" type="success">待处理</el-button>
            </div>
          </footer>
        </div>
      </main>

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
    </div>
    <div v-if="reportKey">
      <el-row type="flex" justify="space-between">
        <div>
          <el-button size="mini" type="danger" @click="getBack"
            ><i class="el-icon-back">&nbsp返回</i></el-button
          >
          <excel-export
            :bookType="excelExport.bookType"
            :filename="excelExport.filename"
            :sheet="excelExport.sheet"
            :on-error="onError"
          >
            <el-button
              size="mini"
              icon="el-icon-download"
              type="success"
              :disabled="loading"
              >导出</el-button
            >
          </excel-export>
          <el-button type="danger" size="mini" :disabled="multiple"
            >删除</el-button
          >
        </div>
        <div>
          <el-date-picker
            size="small"
            type="datetime"
            placeholder="开始时间"
            v-model="startTime2"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="margin-left: 10px"
          >
          </el-date-picker>
          <el-date-picker
            size="small"
            type="datetime"
            placeholder="结束时间"
            v-model="endTime2"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="margin-left: 10px"
          >
          </el-date-picker>
          <el-button
            type="primary"
            style="margin-left: 10px"
            size="mini"
            icon="el-icon-search"
            @click="handleQuery2"
            >查询</el-button
          >
          <el-button
            icon="el-icon-refresh"
            style="margin-left: 10px"
            size="mini"
            @click="resetQuery2"
            >重置</el-button
          >
        </div>
      </el-row>
      <el-row style="margin-top: 15px">
        <el-table
          :lading="loading"
          :data="reportData"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column type="index" label="序号" width="50">
          </el-table-column>
          <el-table-column prop="rq" label="日期" width="150">
          </el-table-column>
          <el-table-column prop="yzmc" label="油站名称" width="150">
          </el-table-column>
          <el-table-column prop="cqyg" label="出勤员工" width="150">
          </el-table-column>
          <el-table-column prop="cqmd" label="出勤名单">
            <template slot-scope="scope">
              <div
                v-for="it in scope.row.cqmd"
                :key="it"
                style="display: inline-block"
              >
                <el-button
                  style="margin-left: 10px"
                  type="primary"
                  size="mini"
                  >{{ it }}</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row type="flex" justify="end">
        <el-pagination
          style="display: flex; justify-content: center; margin-top: 10px"
          @current-change="handleCurrentChange2"
          :current-page="tablePage2.currentPage"
          :page-size="tablePage2.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="tablePage2.totalResult"
        >
        </el-pagination>
      </el-row>
    </div>
    <el-dialog
      title="图片预览"
      :visible="imageDialog3"
      width="50%"
      :before-close="handleCancelImage3"
      @opened="handleOpened3"
    >
      <canvas
        id="myCanvas"
        ref="myCanvas"
        :width="this.canvasW"
        :height="this.canvasH"
        :style="imageClass()"
      >
      </canvas>
    </el-dialog>
  </div>
</template>

<script>
import { getPersontrackSelect, getPersontrackDelete } from '@/api/alarm/alarm';
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
      // 遮罩层
      loading: false,
      ids: [],
      multiple: true,
      mainList: [],
      // 显示搜索条件
      showSearch: true,
      dateRange: [], // 人车轨迹 时间
      queryParams: {
        data_type: '2', //事件类型
        name: '', // 姓名
        data_source: '', // 车牌
        type: null, // 结构树
      },
      options: [
        {
          label: '人员',
          value: '1'
        },
        {
          label: '车辆',
          value: '2'
        },
        {
          label: '人车',
          value: '3'
        }
      ], //事件类型 数据
      // 人车轨迹 分页数据
      tablePage: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0,
      },
      imageDialog3: false,
      imageUrl3: '',

      // 报表查询参数
      reportKey: false,
      startTime2: '', // 开始时间
      endTime2: '', // 结束时间
      tablePage2: {
        currentPage: 1,
        pageSize: 5,
        totalResult: 0,
      },
      reportData: [
        {
          rq: '2021-12-09 18:36:49',
          yzmc: '京新加油站',
          cqyg: '2',
          cqmd: ['张三', '李四']
        }
      ],
      checkedList2: [], // 多选框选择的id
      canvasW: '',
      canvasH: '',
      ratioW: null,
      ratioH: null,
    };
  },

  created() {
    this.getPersontrackSelect()

    const width = document.body.clientWidth
    this.canvasW = (width / 2).toFixed() - 40
    this.ratioW = (8192 / this.canvasW).toFixed(3)
    this.ratioH = (this.ratioW * 2).toFixed(3)
    this.canvasH = (8192 / this.ratioH).toFixed()
    window.addEventListener('resize', this.resizeHandler)
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeHandler)
  },
  methods: {
    // 窗口变化时触发
    resizeHandler() {
      this.imageDialog3 = false
      const width = document.body.clientWidth
      this.canvasW = (width / 2).toFixed() - 40
      this.ratioW = (8192 / this.canvasW).toFixed(3)
      this.ratioH = (this.ratioW * 2).toFixed(3)
      this.canvasH = (8192 / this.ratioH).toFixed()
    },
    // 多选 选中的数据
    handleCheckbox(val, item) {
      item.checked = val;
      this.checkedList2 = [];
      this.mainList.map((it) => {
        if (it.checked) this.checkedList2.unshift(it.id);
      });
      console.log(this.checkedList2);
      this.multiple = !this.checkedList2.length;
    },
    getPersontrackSelect() {
      const queryParams = {
        startDate: this.dateRange[0],
        endDate: this.dateRange[1],
        pageNum: this.tablePage.currentPage,
        pageSize: this.tablePage.pageSize,
        type: this.queryParams.data_type
      }
      getPersontrackSelect(queryParams).then(res => {
        this.tablePage.totalResult = parseInt(res.total)
        res.rows.forEach((item) => {
          item.checked = false;
        });
        this.mainList = res.rows
        this.ExcelExport(res.rows)
      })
    },
    // 点击详情
    particularsCilck(data) {
      this.imageDialog3 = true
      this.imageUrl3 = data.eventSnapPic
      this.rect = data.rect
    },
    // 人车轨迹 查询
    handleQuery() {
      this.tablePage.currentPage = 1
      this.getPersontrackSelect()
    },
    // 重置
    resetQuery() {
      this.tablePage.currentPage = 1
      this.queryParams.data_type = '2';
      this.dateRange = [];
      this.getPersontrackSelect()
    },
    /* 报表查询 */
    // 查询
    handleQuery2() {
      this.tablePage2.currentPage = 1;
      // 重新请求
    },
    // 重置
    resetQuery2() {
      this.startTime2 = null;
      this.endTime2 = null;
      // 重新请求
      this.handleQuery2()
    },
    // 人车轨迹 分页
    handleCurrentChange(data) {
      this.tablePage.currentPage = data
      this.getPersontrackSelect()
    },
    // 人车轨迹 删除
    handleDelete() {
      /* let data;
      if (this.checkedList2.length > 1) {
        data = {
          ids: this.checkedList2
        }
      } else {
        data = {
          id: this.checkedList2[0]
        }
      }
      getPersontrackDelete(data).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.$notify.success("删除成功");
          this.getPersontrackSelect()
        }
      }) */
    },
    ExcelExport(data) {
      let title;
      if (this.queryParams.data_type == '1') {
        title = '人车轨迹--人员'
      } else if (this.queryParams.data_type == '2') {
        title = '人车轨迹--车辆'
      } else {
        title = '人车轨迹--人车'
      }
      let tableItems = [];
      let multiHeaderFace = [[], ['序号', '相似度', '类型', '性别', '年龄类型', '抓拍信息', '布控名称', '布控原因', '备注', '布控信息', '时间']];
      let multiHeaderCar = [[], ['序号', '车牌', '车主', '归档', '车型', '日期', '地址', '图片', '时间']];
      let multiHeaderManCar = [[], ['序号', '相似度', '类型', '性别', '年龄类型', '抓拍信息', '布控名称', '布控原因', '备注', '布控信息', '时间']];

      let keysFace = ['index', 'similarity', 'type', 'sex', 'ageType', 'faceUrl', 'deployType', 'deployName', 'remark', 'facePhotoUrl', 'createTime'];
      let keysCar = ['index', 'deployName', 'deploySex', 'petrolStationName', 'carName', 'deployTime', 'cameraName', 'eventSnapPic', 'time'];
      let keysManCar = ['index', 'similarity', 'type', 'sex', 'ageType', 'faceUrl', 'deployType', 'deployName', 'remark', 'facePhotoUrl', 'createTime'];

      let keys, multiHeader;
      if (this.queryParams.data_type == '1') {
        multiHeader = multiHeaderFace;
        keys = keysFace;
      } else if (this.queryParams.data_type == '2') {
        multiHeader = multiHeaderCar;
        keys = keysCar;
      } else {
        multiHeader = multiHeaderManCar;
        keys = keysManCar;
      }
      this.excelExport.filename = title;
      if (this.queryParams.data_type == '1') {
        data.length && data.forEach((item, index) => {
          tableItems.push({
            index: index + 1,
            similarity: item.similarity ? item.similarity : '无',
            type: item.type ? item.type : '无',
            licence: item.licence ? item.licence : '无',
            carName: item.carName ? item.carName : '无',
            deployTime: item.deployTime ? item.deployTime : '无',

            cameraName: item.deployList[0].cameraName ? item.deployList[0].cameraName : '无',
            eventSnapPic: item.deployList[0].eventSnapPic ? item.deployList[0].eventSnapPic : '无',
            time: item.deployList[0].time ? item.deployList[0].time : '无'
          })
        })
      } else if (this.queryParams.data_type == '2') {
        data.length && data.forEach((item, index) => {
          tableItems.push({
            index: index + 1,
            deployName: item.deployName ? item.deployName : '无',
            deploySex: item.deploySex ? item.deploySex : '无',
            petrolStationName: item.petrolStationName ? item.petrolStationName : '无',
            carName: item.carName ? item.carName : '无',
            deployTime: item.deployTime ? item.deployTime : '无',
            cameraName: item.deployList[0].cameraName ? item.deployList[0].cameraName : '无',
            eventSnapPic: item.deployList[0].eventSnapPic ? item.deployList[0].eventSnapPic : '无',
            time: item.deployList[0].time ? item.deployList[0].time : '无'
          })
        })
      } else {
        data.length && data.forEach((item, index) => {
          tableItems.push({
            index: index + 1,
            similarity: item.similarity ? item.similarity : '无',
            type: item.type ? item.type : '无',
            sex: item.sex ? item.sex : '无',
            ageType: item.ageType ? item.ageType : '无',
            faceUrl: item.faceUrl ? item.faceUrl : '无',
            deployType: item.deployType ? item.deployType : '无',
            deployName: item.deployName ? item.deployName : '无',
            remark: item.remark ? item.remark : '无',
            facePhotoUrl: item.facePhotoUrl ? item.facePhotoUrl : '无',
            createTime: item.createTime ? item.createTime : '无',
          })
        })
      }

      this.excelExport.sheet = [];
      this.excelExport.sheet.push({
        title,
        multiHeader,
        table: [...tableItems],
        keys,
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
      console.log(this.excelExport);
    },
    onError(err) {
      console.error(err);
      this.$message.error(err)
    },
    exportTable() {
      this.$refs.excelExport.pikaExportExcel()
    },
    // 点击报表查询
    getReportQuery() {
      this.reportKey = true
    },
    // 报表查询  返回
    getBack() {
      this.reportKey = false
    },
    // 报表查询 分页
    handleCurrentChange2() {

    },
    // 双击抓拍信息图片
    hanDblclick3(data) {
      this.imageDialog3 = true
      this.imageUrl3 = data.deployUrl
      this.rect = data.rect
    },
    handleCancelImage3() {
      this.imageDialog3 = false
      this.imageUrl3 = ''
      const canvas = this.$refs.myCanvas
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    },
    // canvas
    imageClass() {
      return {
        'background-image': 'url(' + this.imageUrl3 + ')',
        'background-size': '100% 100%',
      }
    },
    // 弹窗打开时的回调
    handleOpened3() {
      if (this.rect !== null) {
        const rectArr = JSON.parse(this.rect).map((it, index) => {
          if (index === 0) {
            return +(it / this.ratioW).toFixed(1)
          }
          if (index === 1) {
            return +(it / this.ratioH).toFixed(1)
          }
          if (index === 2) {
            return +(it / this.ratioW).toFixed(1)
          }
          if (index === 3) {
            return +(it / this.ratioH).toFixed(1)
          }
        })
        const canvas = this.$refs.myCanvas
        const ctx = canvas.getContext('2d')
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.rect(rectArr[0], rectArr[1], rectArr[2], rectArr[3]);
        ctx.stroke();
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
      this.multiple = !selection.length;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep ::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0 !important;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 0 !important;
  cursor: pointer;
}

.image-main {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  .li {
    display: flex;
    flex-direction: column;
    align-content: center;

    box-sizing: border-box;
    padding: 10px 10px;
    margin: 3px;
    width: calc((calc(100% / 5) - 6px));
    height: 327px;
    background-color: rgba(86, 117, 219, 0.849);
    border-radius: 8px;
    overflow: hidden;

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        li {
          margin-bottom: 5px;
        }
        li:last-child {
          margin: 0;
        }

        span,
        b {
          font-size: 12px;
          font-weight: 500;
          line-height: 14px;
          color: #ffffff;
        }
      }

      .right {
        width: 100px;
        height: 100px;

        .el-image,
        .image-slot {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100px;
          background: #eee;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          color: #19adca;
        }
      }
    }

    p {
      margin-bottom: 3px;
      font-size: 12px;
      font-weight: 500;
      line-height: 14px;
      color: #ffffff;
    }

    main {
      overflow: auto;
      height: 150px;
      ul {
        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
          span {
            font-size: 12px;
            font-weight: 500;
            line-height: 14px;
            color: #ffffff;
          }
          span:first-child {
            width: 14px;
          }
          b {
            font-size: 12px;
            font-weight: 500;
            line-height: 14px;
            color: #80ffe3;
            cursor: pointer;
          }
        }
        li:last-child {
          margin: 0;
        }
      }
    }

    .footer {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      .el-button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 56px;
        height: 23px;
        font-size: 12px;
        float: right;
      }
      .el-button:last-child {
        margin-right: 10px;
      }
    }
  }
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  box-sizing: border-box;
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
.inputClass {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  margin-right: 20px;
  span {
    font-size: 14px;
    margin-right: 10px;
    width: 70px;
  }
}
::v-deep .el-pager li.active {
  background-color: #1890ff;
  color: #ffffff;
  min-width: 30px;
  border-radius: 2px;
}
// ::v-deep .el-dialog__body {
//   padding: 0;
// }
</style>
