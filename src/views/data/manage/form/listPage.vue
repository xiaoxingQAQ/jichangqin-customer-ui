<template>
  <div class="app_container">
    <div class="row">
      <div class="left">
        <el-button
          style="margin-right: 10px"
          size="mini"
          type="danger"
          :disabled="multiple"
          @click="handleDelete()"
          icon="el-icon-delete"
          >删除</el-button
        >
        <!-- list2 -->
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
            :disabled="loading ? true : list2.length == 0"
            >导出</el-button
          >
        </excel-export>
      </div>
      <el-form class="right" :inline="true">
        <el-form-item class="data-picker">
          <el-date-picker
            v-model="formData2.dateRange"
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
            v-model="formData2.tackType"
            placeholder="事件类型"
            size="small"
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
            v-model="formData2.place"
            clearable
            size="small"
            placeholder="请输入布控原因"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="formData2.deployType"
            clearable
            size="small"
            placeholder="请输入布控名称"
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
        </el-form-item>
      </el-form>
    </div>
    <div class="main_con">
      <el-row class="main" :gutter="20" style="margin-right: 0; display: flex">
        <div class="li" v-for="(item, index) in list2" :key="index">
          <header>
            <div style="margin-left: 10px" class="left">
              <span>相似度</span>
              <b>{{ item.similarity }}</b>
            </div>

            <div class="right">
              <i class="iconfont icon-wenjian_sousuo"></i>
            </div>
          </header>
          <main>
            <div class="left">
              <div class="title">抓拍信息</div>
              <div class="image">
                <el-image
                  @dblclick="hanDblclick2(item)"
                  :src="item.dataType ? item.faceUrl : item.carCapture"
                >
                  <div class="image-slot" slot="placeholder">
                    <div>加载中...</div>
                  </div>
                  <div slot="error" class="image-slot">
                    <div>加载中...</div>
                  </div>
                </el-image>
              </div>
              <ul>
                <!-- 时间 -->
                <li>
                  <span>{{ item.createTime }}</span>
                </li>
                <li>
                  <span>类型：</span>
                  <b>{{ item.dataType ? item.type : '' }}</b>
                </li>
                <li>
                  <span>{{ item.dataType ? '性别：' : '车牌：' }}</span>
                  <b>{{ item.dataType ? item.sex : item.licence }}</b>
                </li>
                <li>
                  <span>{{ item.dataType ? '年龄：' : '颜色：' }}</span>
                  <b>{{ item.dataType ? item.ageType : item.carColor }}</b>
                </li>
              </ul>
            </div>
            <div class="right">
              <div class="title">布控信息</div>
              <div class="image">
                <el-image
                  @dblclick="hanDblclick3(item)"
                  :src="item.dataType ? item.facePhotoUrl : item.carDeploy"
                >
                  <div class="image-slot" slot="placeholder">
                    <div>加载中...</div>
                  </div>
                  <div slot="error" class="image-slot">
                    <div>加载中...</div>
                  </div>
                </el-image>
              </div>
              <ul>
                <li>
                  <span>布控名称：</span>
                  <b>{{
                    item.dataType ? item.deployType : item.monitorCause
                  }}</b>
                </li>
                <li>
                  <span>布控原因：</span>
                  <b>{{
                    item.dataType ? item.deployName : item.monitorName
                  }}</b>
                </li>
                <li>
                  <span>备注：</span>
                  <b>{{ item.dataType ? item.remark : item.licenceDeploy }}</b>
                </li>
                <li>
                  <el-checkbox
                    v-model="item.checked"
                    @change="(val) => handleCheckbox(val, item)"
                    style="color: #fff"
                  ></el-checkbox>
                </li>
              </ul>
            </div>
          </main>
        </div>
      </el-row>
    </div>
    <el-pagination
      v-if="tablePage2.totalResult > 0"
      style="display: flex; justify-content: end"
      @current-change="handleCurrentChange2"
      :current-page="tablePage2.currentPage"
      :page-size="tablePage2.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="tablePage2.totalResult"
    >
    </el-pagination>

    <el-dialog
      style="text-align: center"
      title="图片预览"
      :visible="imageDialog2"
      width="45%"
      :before-close="handleCancelImage2"
    >
      <img style="width: 100%; height: auto" :src="imageUrl2" />
    </el-dialog>
  </div>
</template>

<script>
import { getSelectByFace, getSelectCar, getSelectByFaceDelete, getSelectCarDelete } from '@/api/alarm/alarm';

import { ExcelExport } from 'pikaz-excel-js';

export default {
  components: {
    ExcelExport
  },
  data() {
    return {
      loading: false,
      /* 导出的配置 */
      excelExport: {
        bookType: 'xlsx',
        filename: 'export',
        sheet: [],
      },
      menuList: [
        { title: "", icon: "icon-wenjian_sousuo" },
        { title: "", icon: "icon-tupian" },
        { title: "", icon: "icon-lingdang" },
        { title: "", icon: "icon-bianji" },
      ],
      // 名单布控显示数据
      list2: [],
      multiple: true,
      // 显示搜索条件
      formData2: {
        dateRange: [],
        tackType: '人脸',
        data_source: '',
        place: '',
        deployType: ''
      },
      // 查询参数
      tablePage2: {
        currentPage: 1,
        pageSize: 8,
        totalResult: 0,
      },
      options: [
        {
          label: '人脸',
          value: '人脸'
        },
        {
          label: '车辆',
          value: '车辆'
        },
      ],
      options2: [],
      options3: [],
      options4: [],
      imageDialog2: false,
      imageUrl2: '',
      checkedList2: []
    };
  },
  created() {
    this.getSelectByFace()
  },
  methods: {
    // 删除
    handleDelete() {
      const data = {
        ids: this.checkedList2,
      }
      if (this.formData2.tackType === '车辆') {
        getSelectCarDelete(data).then(res => {
          if (res.code == 200) {
            this.$notify.success("删除成功");
            this.getSelectCar();
          } else {
            this.$notify.success("删除失败");
          }
        })
      } else {
        getSelectByFaceDelete(data).then(res => {
          if (res.code == 200) {
            this.$notify.success("删除成功");
            this.getSelectByFace();
          } else {
            this.$notify.success("删除失败");
          }
        })
      }
    },
    ExcelExport(data) {
      let title;
      this.formData2.tackType == '车辆' ? title = '名单预警--车辆' : title = '名单预警--人脸';
      let tableItems = [];
      let multiHeaderCar = [[], ['序号', '相似度', '类型', '车牌', '颜色', '抓拍信息', '布控名称', '布控原因', '备注', '布控信息', '时间']];
      let multiHeaderFace = [[], ['序号', '相似度', '类型', '性别', '年龄类型', '抓拍信息', '布控名称', '布控原因', '备注', '布控信息', '时间']];
      let keysCar = ['index', 'similarity', 'type', 'licence', 'carColor', 'carCapture', 'monitorName', 'monitorCause', 'remark', 'carCapture', 'createTime'];
      let keysFace = ['index', 'similarity', 'type', 'sex', 'ageType', 'faceUrl', 'deployType', 'deployName', 'remark', 'facePhotoUrl', 'createTime'];
      let keys, multiHeader;
      if (this.formData2.tackType == '车辆') {
        multiHeader = multiHeaderCar;
        keys = keysCar;
      } else {
        multiHeader = multiHeaderFace;
        keys = keysFace;
      }
      this.excelExport.filename = title;

      if (this.formData2.tackType == '车辆') {
        data.length && data.forEach((item, index) => {
          tableItems.push({
            index: index + 1,
            similarity: item.similarity ? item.similarity : '无',
            type: item.type ? item.type : '无',
            licence: item.licence ? item.licence : '无',
            carColor: item.carColor ? item.carColor : '无',
            carCapture: item.carCapture ? item.carCapture : '无',
            monitorName: item.monitorName ? item.monitorName : '无',
            monitorCause: item.monitorCause ? item.monitorCause : '无',
            remark: item.remark ? item.remark : '无',
            carCapture: item.carCapture ? item.carCapture : '无',
            createTime: item.createTime ? item.createTime : '无'
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
    // 查询
    handleQuery() {
      this.tablePage2.currentPage = 1
      if (this.formData2.tackType === '车辆') {
        this.getSelectCar()
      } else {
        this.getSelectByFace()
      }
    },
    // 重置
    resetQuery() {
      this.tablePage2.currentPage = 1;
      this.formData2.dateRange = []
      this.formData2.tackType = '车辆';
      this.getSelectCar()
    },
    // 分页查询
    handleCurrentChange2(data) {
      this.tablePage2.currentPage = data
      if (this.formData2.tackType === '车辆') {
        this.getSelectCar()
      } else {
        this.getSelectByFace()
      }
    },
    // 获取人脸抓拍信息和布控信息
    getSelectByFace() {
      this.loading = true;
      const queryParams = {
        startDate: this.formData2.dateRange ? this.formData2.dateRange[0] : "",
        endDate: this.formData2.dateRange ? this.formData2.dateRange[1] : "",
        pageNum: this.tablePage2.currentPage,
        pageSize: this.tablePage2.pageSize
      }
      getSelectByFace(queryParams).then(res => {
        console.log('获取人脸抓拍数据: ', res);
        if (res.code === 200) {
          this.list2 = []
          this.tablePage2.totalResult = parseInt(res.total)
          res.rows.forEach(item => {
            item.dataType = 'face'
            item.checked = false
          })
          this.list2 = res.rows
          this.ExcelExport(res.rows)
          this.loading = false;
        }
      })
    },
    // 获取车辆拍信息和布控信息
    getSelectCar() {
      this.loading = true;
      const queryParams = {
        startDate: this.formData2.dateRange ? this.formData2.dateRange[0] : "",
        endDate: this.formData2.dateRange ? this.formData2.dateRange[1] : "",
        pageNum: this.tablePage2.currentPage,
        pageSize: this.tablePage2.pageSize
      }
      getSelectCar(queryParams).then(res => {
        console.log('获取人脸抓拍数据: ', res);
        if (res.code === 200) {
          this.list2 = []
          this.tablePage2.totalResult = parseInt(res.total)
          res.rows.forEach(item => {
            item.dataType = null,
              item.checked = false
          })
          this.list2 = res.rows
          this.ExcelExport(res.rows)
          this.loading = false;
        }
      })
    },
    // 双击抓拍信息图片
    hanDblclick2(data) {
      this.imageDialog2 = true
      if (this.formData2.tackType === '车辆') {
        this.imageUrl2 = data.carCapture
      } else {
        this.imageUrl2 = data.faceUrl
      }
    },
    // 双击 布控信息图片
    hanDblclick3(data) {
      this.imageDialog2 = true
      if (this.formData2.tackType === '车辆') {
        this.imageUrl2 = data.carDeploy
      } else {
        this.imageUrl2 = data.facePhotoUrl
      }
    },
    handleCancelImage2() {
      this.imageDialog2 = false
    }
  },
};
</script>

<style lang="scss" scoped>
.app_container {
  height: 100%;
}
::v-deep .el-dialog__body {
  padding: 0 !important;
}
.main_con {
  width: 100%;
  .main {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .li {
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      padding: 16px 0;
      margin: 5px;
      width: calc(calc(100% / 4) - 10px);
      overflow: auto;
      // height: 320px;
      background-color: rgba(86, 117, 219, 0.849);
      border-radius: 8px;
      header {
        display: flex;
        justify-content: start;
        width: 100%;
      }
      main {
        overflow-x: auto;
        display: flex;
        justify-content: space-around;
        width: 100%;
        ul {
          li {
            margin-top: 20px;
          }
        }
      }
      .image {
        margin-bottom: 12px;
        width: 90px;
        height: 90px;
        .image-slot {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 90px;
          aspect-ratio: 1 / 1;
          background: #eee;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          color: #19adca;
        }
        .el-image {
          // width: 100%;
          // height: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 8px;
        }
      }
    }
  }
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
::v-deep .el-pager li.active {
  background-color: #1890ff;
  color: #ffffff;
  min-width: 30px;
  border-radius: 4px;
}
</style>
