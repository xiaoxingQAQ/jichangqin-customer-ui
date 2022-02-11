/* 智能抓拍页面 */
<template>
  <div class="app_container">
    <div class="row option">
      <div class="left">
        <el-button
          style="margin-right: 10px"
          size="mini"
          type="danger"
          :disabled="multiple"
          icon="el-icon-delete"
          @click="handleDelete"
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
      <el-form class="right" :inline="true">
        <el-form-item class="data-picker">
          <el-date-picker
            v-model="formData.dateRange"
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
            clearable
            collapse-tags
            placeholder="地点"
            :options="treeData"
            :props="{
              value: 'id',
              label: 'label',
              emitPath: false,
              multiple: true,
              clearable: true,
            }"
            :show-all-levels="false"
            v-model="formData.location"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="">
          <el-select
            v-model="formData.tackType"
            placeholder="抓拍类型"
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
        <el-form-item>
          <el-button
            icon="el-icon-search"
            size="mini"
            type="primary"
            @click="handleQuery"
            :loading="loading"
            >查询</el-button
          >
          <el-button
            :loading="loading"
            size="mini"
            icon="el-icon-refresh"
            @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <main>
      <div class="li" v-for="(item, index) in userList" :key="index">
        <div class="image2">
          <el-image
            @dblclick="hanDblclick(item)"
            :src="item.dataType ? item.faceUrl : item.snapUrl"
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
          <li style="justify-content: space-between">
            <div>
              <span>分类：</span>
              <b>{{ item.dataType ? item.type : item.carType }}</b>
            </div>
            <div>
              <el-checkbox
                v-model="item.checked"
                @change="(val) => handleCheckbox(val, item)"
              ></el-checkbox>
            </div>
          </li>
          <li>
            <span>{{ item.dataType ? '姓名：' : '地址：' }}</span>
            <b>{{
              item.dataType ? (item.name ? item.name : '无') : item.cameraName
            }}</b>
          </li>
          <li>
            <span>{{ item.dataType ? '性别：' : '号牌：' }}</span>
            <b>{{ item.dataType ? item.sex : item.color }}</b>
          </li>
          <li v-if="!item.dataType">
            <span>车牌：</span>
            <b>{{ item.licence }}</b>
          </li>
          <li>
            <span>地点：</span>
            <b>{{ item.petrolName }}</b>
          </li>
          <li>
            <span>{{ item.dataType ? '年龄类型：' : '型号：' }}</span>
            <b>{{ item.dataType ? item.ageType : item.styleName }}</b>
          </li>
          <li>
            <span>{{ item.dataType ? '地址：' : '颜色：' }}</span>
            <b>{{ item.dataType ? item.address : item.carColor }}</b>
          </li>
          <li>
            <span>时间：</span>
            <b>{{ item.createTime }}</b>
          </li>
        </ul>

        <div class="footer">
          <i
            v-for="(iconArr, index) in menuList"
            :key="index"
            style="cursor: pointer"
            :class="['iconfont', iconArr.icon]"
            :title="
              iconArr.icon === 'icon-tupian'
                ? '以图搜图'
                : iconArr.icon === 'icon-lingdang'
                ? '布控'
                : iconArr.icon === 'icon-xiazai1'
                ? '下载图片'
                : ''
            "
            @click="handleIconCilck(iconArr, item)"
          ></i>
        </div>
      </div>
    </main>

    <!-- 分页 -->
    <el-row style="margin-top: 15px" type="flex" justify="end">
      <el-pagination
        v-show="tablePage.totalResult > 0"
        style="display: flex; justify-content: center"
        @current-change="handleCurrentChange"
        :current-page="tablePage.currentPage"
        :page-size="tablePage.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="tablePage.totalResult"
      >
      </el-pagination>
    </el-row>

    <el-dialog
      title="图片预览"
      :visible="imageDialog"
      width="50%"
      :before-close="handleCancelImage"
      @opened="handleOpened"
    >
      <!-- <img style="width:100%;height:auto" :src="imageUrl"/> -->
      <div ref="divDom">
        <canvas
          id="myCanvas"
          ref="myCanvas"
          :width="this.canvasW"
          :height="this.canvasH"
          :style="imageClass()"
        >
        </canvas>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCarList, getFace, captureDelete, personDelete } from "@/api/alarm/alarm";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { ExcelExport } from 'pikaz-excel-js';

import { mapGetters } from "vuex";
export default {
  components: {
    Treeselect,
    ExcelExport
  },
  computed: {
    ...mapGetters(["info"]),
  },
  data() {
    return {
      /* 导出的配置 */
      excelExport: {
        bookType: 'xlsx',
        filename: 'export',
        sheet: [],
      },
      loading: false,
      canvasW: "",
      canvasH: "",
      ratioW: null,
      ratioH: null,
      rect: [],
      menuList: [
        { title: '', icon: 'icon-tupian' },
        { title: '', icon: 'icon-lingdang' },
        { title: '', icon: 'icon-xiazai1' },
      ],
      formData: {
        dateRange: [],
        location: [],
        tackType: "车辆",
      },
      // 地点数据
      treeData: [],
      // 抓拍显示数据
      userList: [],
      multiple: true,
      // 查询参数
      tablePage: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0,
      },
      // 抓拍类型
      options: [
        {
          label: "人脸",
          value: "人脸",
        },
        {
          label: "车辆",
          value: "车辆",
        },
      ],
      imageDialog: false,
      imageUrl: "",
      checkedList2: [],
    };
  },
  mounted() {
    const width = document.body.clientWidth;
    console.log(width);
    this.canvasW = (width / 2).toFixed() - 40;
    this.ratioW = (8192 / this.canvasW).toFixed(3);
    this.ratioH = (this.ratioW * 2).toFixed(3);
    this.canvasH = (8192 / this.ratioH).toFixed();
    window.addEventListener("resize", this.resizeHandler);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeHandler);
  },
  created() {
    this.treeData = this.info.deptPermission;
    this.getCarList();
  },
  methods: {
    // 多选 选中的数据
    handleCheckbox(val, item) {
      item.checked = val;
      this.checkedList2 = [];
      this.userList.map((it) => {
        if (it.checked) this.checkedList2.unshift(it.id);
      });
      console.log(this.checkedList2);
      this.multiple = !this.checkedList2.length;
    },
    // 删除
    handleDelete() {
      console.log(this.checkedList2)
      const data = {
        ids: this.checkedList2,
      };
      if (this.formData.tackType === "车辆") {
        captureDelete(data).then((res) => {
          if (res.code == 200) {
            this.$notify.success("删除成功");
            this.getCarList();
          } else {
            this.$notify.success("删除失败");
          }
        })
      } else {
        personDelete(data).then(res => {
          if (res.code == 200) {
            this.$notify.success("删除成功");
            this.getFace();
          } else {
            this.$notify.success("删除失败");
          }
        })
      }
    },
    // 导出初始化
    ExcelExport(data) {
      let title;
      this.formData.tackType == '车辆' ? title = '智能抓拍--车辆' : title = '智能抓拍--人脸';
      let tableItems = [];
      let multiHeaderCar = [[], ['序号', '分类', '地址', '号牌', '车牌', '地点', '型号', '颜色', '时间']];
      let multiHeaderFace = [[], ['序号', '分类', '姓名', '性别', '地点', '年龄类型', '地址', '时间']];
      let keysCar = ['index', 'carType', 'cameraName', 'color', 'licence', 'petrolName', 'styleName', 'carColor', 'createTime'];
      let keysFace = ['index', 'type', 'cameraName', 'sex', 'petrolName', 'ageType', 'address', 'createTime'];
      let keys, multiHeader;
      if (this.formData.tackType == '车辆') {
        multiHeader = multiHeaderCar;
        keys = keysCar;
      } else {
        multiHeader = multiHeaderFace;
        keys = keysFace;
      }
      this.excelExport.filename = title;

      if (this.formData.tackType == '车辆') {
        data.length && data.forEach((item, index) => {
          tableItems.push({
            index: index + 1,
            carType: item.carType ? item.carType : '无',
            cameraName: item.cameraName ? item.cameraName : '无',
            color: item.color ? item.color : '无',
            licence: item.licence ? item.licence : '无',
            petrolName: item.petrolName ? item.petrolName : '无',
            styleName: item.styleName ? item.styleName : '无',
            carColor: item.carColor ? item.carColor : '无',
            createTime: item.createTime ? item.createTime : '无'
          })
        })
      } else {
        data.length && data.forEach((item, index) => {
          tableItems.push({
            index: index + 1,
            type: item.type ? item.type : '无',
            cameraName: item.cameraName ? item.cameraName : '无',
            sex: item.sex ? item.sex : '无',
            petrolName: item.petrolName ? item.petrolName : '无',
            ageType: item.ageType ? item.ageType : '无',
            address: item.address ? item.address : '无',
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
    // 浏览器窗口发生改变触发
    resizeHandler() {
      this.imageDialog = false;
      const width = document.body.clientWidth;
      this.canvasW = (width / 2).toFixed() - 40;
      this.ratioW = (8192 / this.canvasW).toFixed(3);
      this.ratioH = (this.ratioW * 2).toFixed(3);
      this.canvasH = (8192 / this.ratioH).toFixed();
    },
    // 加油站下拉框不可选的节点
    my_normalizer(node) {
      return {
        id: node.id,
        label: node.label,
        children: node.children,
        isDisabled: node.type == "1" ? true : false,
      };
    },
    // 分页查询
    handleCurrentChange(data) {
      this.tablePage.currentPage = data;
      if (this.formData.tackType === "车辆") {
        this.getCarList();
      } else {
        this.getFace();
      }
    },
    // 查询
    handleQuery() {
      this.checkedList2 = [];
      this.tablePage.currentPage = 1;
      if (this.formData.tackType === "车辆") {
        this.getCarList();
      } else {
        this.getFace();
      }
    },
    // 重置
    resetQuery() {
      this.tablePage.currentPage = 1;
      this.formData.location = []
      this.formData.tackType = "车辆";
      this.formData.dateRange = []
      this.getCarList();
    },
    // 获取人脸抓拍数据 导出
    getFaceAll(data) {
      getFace({
        startDate: data.startDate,
        endDate: data.endDate,
        orgId: data.orgId,
      }).then(res => {
        this.ExcelExport(res.rows)
      })
    },
    // 获取人脸抓拍数据
    getFace() {
      this.loading = true;
      let str;
      if (this.formData.location.length) {
        str = this.formData.location.join(",");
      }
      const queryParams = {
        startDate: this.formData.dateRange ? this.formData.dateRange[0] : "",
        endDate: this.formData.dateRange ? this.formData.dateRange[1] : "",
        pageNum: this.tablePage.currentPage,
        pageSize: this.tablePage.pageSize,
        orgId: str,
      }
      getFace(queryParams).then(res => {
        console.log('获取人脸抓拍数据: ', res);
        if (res.code === 200) {
          this.userList = [];
          this.tablePage.totalResult = parseInt(res.total);
          res.rows.forEach((item) => {
            item.dataType = "face";
            item.checked = false;
          });
          this.userList = res.rows;
          this.ExcelExport(res.rows)
          this.loading = false;
          // this.getFaceAll(queryParams)
        }
      });
    },
    // 获取车辆抓拍数据 导出
    getCarListAll(data) {
      getCarList({
        startDate: data.startDate,
        endDate: data.endDate,
        orgId: data.orgId,
      }).then(res => {
        this.ExcelExport(res.rows);
      })
    },
    /* 获取车辆抓拍数据 */
    getCarList() {
      this.loading = true;
      let str;
      if (this.formData.location && this.formData.location.length) {
        str = this.formData.location.join(",");
      }
      const queryParams = {
        startDate: this.formData.dateRange ? this.formData.dateRange[0] : null,
        endDate: this.formData.dateRange ? this.formData.dateRange[1] : null,
        pageNum: this.tablePage.currentPage,
        pageSize: this.tablePage.pageSize,
        orgId: str,
      };
      getCarList(queryParams).then((res) => {
        console.log("获取车辆抓拍数据: ", res);
        if (res.code === 200) {
          this.userList = [];
          this.tablePage.totalResult = parseInt(res.total);
          res.rows.forEach((item) => {
            item.dataType = null;
            item.checked = false;
            item.color = item.color ? item.color : "无法确认";
          });
          this.userList = res.rows;
          this.loading = false;
          this.ExcelExport(res.rows);
          // this.getCarListAll(queryParams)
        }
      });
    },
    // 双击图片放大
    hanDblclick(data) {
      this.imageDialog = true;
      this.imageUrl = data.dataType ? data.faceUrl : data.snapUrl;
      this.rect = data.rect;
    },
    handleCancelImage() {
      this.imageDialog = false;
      this.imageUrl = "";
      const canvas = this.$refs.myCanvas;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // this.canvasW = ''
      // this.canvasH = ''
      // this.ratioW = null
      // this.ratioH = null
    },
    // canvas
    imageClass() {
      return {
        "background-image": "url(" + this.imageUrl + ")",
        "background-size": "100% 100%",
      };
    },
    handleOpened() {
      if (this.rect !== null) {
        const rectArr = JSON.parse(this.rect).map((it, index) => {
          if (index === 0) {
            return +(it / this.ratioW).toFixed(1);
          }
          if (index === 1) {
            return +(it / this.ratioH).toFixed(1);
          }
          if (index === 2) {
            return +(it / this.ratioW).toFixed(1);
          }
          if (index === 3) {
            return +(it / this.ratioH).toFixed(1);
          }
        });
        const canvas = this.$refs.myCanvas;
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.rect(rectArr[0], rectArr[1], rectArr[2], rectArr[3]);
        ctx.stroke();
      }
    },
    // 点击icon事件
    handleIconCilck(iconArr, data) {
      if (iconArr.icon === "icon-xiazai1") {
        // 下载图片
        if (this.formData.tackType === '车辆') {
          if (data.snapUrl) {
            this.downloadByBlob(data.snapUrl, data.createTime)
          } else {
            this.$notify.warning('当前并没有图片可以下载')
          }
        } else {
          if (data.faceUrl) {
            this.downloadByBlob(data.faceUrl, data.createTime)
          } else {
            this.$notify.warning('当前并没有图片可以下载')
          }
        }
      } else if (iconArr.icon === "icon-tupian") {
        this.$notify.warning('当前功能还在开发中')
      } else {
        this.$notify.warning('当前功能还在开发中')
      }
    },
    downloadByBlob(url, name) {
      let image = new Image();
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
      image.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, image.width, image.height);
        canvas.toBlob(blob => {
          let url = URL.createObjectURL(blob);
          this.download(url, name);
          // 用完释放URL对象
          URL.revokeObjectURL(url);
        });
      };
    },
    download(href, name) {
      let eleLink = document.createElement("a");
      eleLink.download = name;
      eleLink.href = href;
      eleLink.click();
      eleLink.remove();
    }
  },
};
</script>

<style lang="scss" scoped>
.app_container {
  height: 100%;
}
main {
  overflow-x: auto;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .li {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 16px 22px;
    margin: 5px;
    width: calc(calc(100% / 5) - 10px);
    // height: 320px;
    background-color: rgba(86, 117, 219, 0.849);
    border-radius: 8px;
    // 图片
    .image2 {
      margin-bottom: -8px;
      width: 100%;
      .image-slot {
        display: flex;
        justify-content: center;
        align-items: center;
        aspect-ratio: 16 / 9;
        min-height: 120px;
        background: #eee;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 500;
        color: #19adca;
      }
      .el-image {
        aspect-ratio: 16 / 9;
        border-radius: 8px;
      }
    }

    ul {
      padding-top: 10px;
      display: flex;
      flex-direction: column;
      width: 100%;
      li {
        white-space: nowrap;
        display: flex;
        width: 100%;
        span,
        b {
          font-size: 13px;
          font-weight: 500;
          line-height: 24px;
          color: #ffffff;
        }

        b {
          color: #eee;
        }
      }
    }

    .footer {
      display: flex;
      i {
        width: 17px;
        height: 17px;
        line-height: 17px;
        text-align: center;
        font-size: 20px;
        color: #ffffff;
        cursor: pointer;
      }

      i:nth-child(1),
      i:nth-child(2),
      i:nth-child(3) {
        margin: 0 12px;
      }
    }
  }
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  margin-top: 1.5px;
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
  border-radius: 2px;
}
</style>
