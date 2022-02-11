<template>
  <div class="app_container main">
    <div class="row option">
      <div class="left">
        <el-button
          size="mini"
          type="danger"
          :disabled="multiple"
          @click="handleDelete"
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
            icon="el-icon-download"
            type="success"
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
          <el-select
            v-model="queryParams.eventCode"
            placeholder="事件类型"
            clearable
            size="small"
            style="width: 140px"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <div class="cascader">
            <el-cascader
              collapse-tags
              size="small"
              placeholder="地点"
              :clearable="true"
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
            ></el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="" class="last">
          <el-select
            v-model="queryParams.handleStatus"
            clearable
            placeholder="状态"
            size="small"
            style="width: 140px"
          >
            <el-option
              v-for="item in options3"
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
            >查询</el-button
          >
          <el-button size="mini" icon="el-icon-refresh" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <main class="main_con">
      <ul>
        <li v-for="(item, index) in userList" :key="index">
          <el-image
            @dblclick="handlePreview(item.eventSnapPic)"
            @error="handleErr(item, item.eventSnapPic, 5)"
            class="image"
            :src="item.eventSnapPic"
          >
            <div class="image-slot" slot="placeholder">
              <div>加载中...</div>
            </div>
            <div slot="error" class="image-slot">
              <div>加载中...</div>
            </div>
          </el-image>
          <div class="main">
            <div class="top">
              <div class="left">
                <span class="first"
                  >{{ item.cameraName }} {{ item.address }}</span
                >
                <span class="last">{{ item.createTime }}</span>
              </div>
              <div class="right">
                <el-checkbox
                  v-model="item.checked"
                  @change="(val) => handleChange(val, item)"
                ></el-checkbox>
              </div>
            </div>
            <div class="bottom">
              <el-button size="mini" :type="setType_1(item)" plain>{{
                setType_1_a(item)
              }}</el-button>
              <el-button
                size="mini"
                :type="statusType(item)"
                @click="showDialog(item)"
                >{{ handleStatus(item) }}</el-button
              >
            </div>
          </div>
        </li>
      </ul>
    </main>
    <pagination
      style="margin-top: 15px"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
      class="pagination"
    />

    <!-- dialog -->
    <el-dialog title="预览" :visible.sync="visiblePreview" width="70%">
      <div>
        <img style="width: 100%" :src="imageUrl" />
      </div>
    </el-dialog>
    <DialogA
      :isHome="false"
      @cancel="handleCancel"
      @refreshList="getList"
      :visible="visible_a"
      :cur_data="cur_data"
    />
    <DialogB @cancel="handleCancel" :visible="visible_b" :cur_data="cur_data" />
    <DialogC @cancel="handleCancel" :visible="visible_c" :cur_data="cur_data" />
    <DialogD @cancel="handleCancel" :visible="visible_d" :cur_data="cur_data" />
  </div>
</template>

<script>
import DialogA from '../components/analyseDialog/DialogA'
import DialogB from '../components/analyseDialog/DialogA'
import DialogC from '../components/analyseDialog/DialogA'
import DialogD from '../components/analyseDialog/DialogA'
import { ExcelExport } from 'pikaz-excel-js';

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";


import { getAlgorithmList } from "@/api/device/algorithm";
import { getWarningList, delWarningList } from "@/api/data/alarmManage";
import { mapGetters } from "vuex";
const options3 = [
  { value: "未处理", label: "未处理" },
  { value: '现场处理', label: "现场处理" },
  { value: '事件上报', label: "事件上报" },
];

export default {
  components: {
    Treeselect,
    DialogA,
    DialogB,
    DialogC,
    DialogD,
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
      cur_data: {},

      visible_a: false,
      visible_b: false,
      visible_c: false,
      visible_d: false,

      imageUrl: null, // 预览图片的url
      visiblePreview: false, // 预览图片
      /* 树形图 地点的数据 */
      treeData: [],
      list: [1, 2, 3, 4, 5],
      userList: [],

      multiple: true, // 是否选中
      checkedList: [], // 选中的数据
      // 显示搜索条件
      showSearch: true,
      total: 1,
      dateRange: [],
      // 查询参数
      queryOrgId: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,

        orgIds: null, // 地点id
        startDate: null,
        endDate: null,
        eventCode: null, // 事件类型
        handleStatus: null, // 状态
      },
      options: [],
      options2: [],

      options3: options3,
    };
  },
  created() {
    this.treeData = this.info.deptPermission;
    this.getList();
    this.getAlgorithmList();
  },
  computed: {
    ...mapGetters(["info"]),
    orgId() {
      return this.$store.getters.info.user.orgId;
    },
  },
  methods: {
    // 查询导出数据
    getListAll() {
      const params = {
        orgIds: this.queryParams.orgIds, // 地点id
        startDate: this.queryParams.startDate,
        endDate: this.queryParams.endDate,
        eventCode: this.queryParams.eventCode, // 事件类型
        handleStatus: this.queryParams.handleStatus, // 状态
      }
      getWarningList(params).then(res => {
        this.ExcelExport(res.rows)
      })
    },
    /** 智能分析列表 */
    getList() {
      this.loading = true;
      this.queryParams.orgIds = this.queryOrgId && this.queryOrgId.length ? this.queryParams.orgIds = this.queryOrgId.join(',') : null;
      this.queryParams.startDate = this.dateRange ? this.dateRange[0] : "",
      this.queryParams.endDate = this.dateRange ? this.dateRange[1] : "",
      getWarningList(this.queryParams).then((res) => {
        res.rows.forEach((item) => {
          item.checked = false;
        });
        this.userList = res.rows;
        this.total = parseInt(res.total);
        this.ExcelExport(res.rows)
        this.loading = false;
        // this.getListAll()
      });
    },
    /* 获取事件分类 */
    getAlgorithmList() {
      getAlgorithmList({ orgId: this.orgId }).then((res) => {
        console.log("请求算法事件列表: ", res);
        if (res.code === 200) {
          this.options = res.data;
        }
      });
    },

    /* 处理删除 */
    handleDelete() {
      /* checkedList */
      const data = {
        ids: this.checkedList,
      };
      console.log(data);
      delWarningList(data).then((res) => {
        if (res.code == 200) {
          this.$notify.success("删除成功");
          this.getList();
        } else {
          this.$notify.success("删除失败");
        }
      });
    },
    ExcelExport(data) {
      const title = '智能分析';
      let tableItems = [];
      this.excelExport.filename = title;
      data.length && data.forEach((item, index) => {
        tableItems.push({
          index: index + 1,
          stationName: item.stationName ? item.stationName : '暂无',
          cameraName: item.cameraName ? item.cameraName : '暂无',
          address: item.address ? item.address : '暂无',
          createTime: item.createTime ? item.createTime : '暂无',
          eventCode: this.setType_1_a(item),
          handleStatus: this.handleStatus(item),
          eventSnapPic: item.eventSnapPic ? item.eventSnapPic : '暂无',
        })
      })
      this.excelExport.sheet = [];
      this.excelExport.sheet.push({
        title,
        multiHeader: [[], ['序号', '机构', '地点', '摄像机IP地址', '时间', '事件类型', '处理状态', '图片']],
        table: [...tableItems],
        keys: ['index', 'stationName', 'cameraName', 'address', 'createTime', 'eventCode', 'handleStatus', 'eventSnapPic'],
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
      this.queryParams.pageNum = 1;
      this.getList();
    },
    reset() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        orgIds: [], // 地点id
        startDate: null,
        endDate: null,
        eventCode: null, // 事件类型
        handleStatus: null, // 状态
      }
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.reset()
      this.resetForm("queryForm");
      this.handleQuery();
    },

    // 多选 选中的数据
    handleChange(val, item) {
      console.log("item: ", item);
      item.checked = val;
      this.checkedList = [];
      this.userList.map((item2) => {
        if (item2.checked) this.checkedList.unshift(item2.id);
      });
      console.log(this.checkedList);
      this.multiple = !this.checkedList.length;
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    // 处理图片error
    handleErr(item, imgSrc, count) {
      return;
      if (count > 0) {
        // this.handleErr(item, imgSrc, count - 1)
        setTimeout(() => {
          item.eventSnapPic = imgSrc + `?t+${Math.random()}`;
        }, 500);
      }
    },
    handleCancel() {
      this.visible_a = false;
      this.visible_b = false;
      this.visible_c = false;
      this.visible_d = false;
    },
    handleOk() { },
    // 点击展示dialog
    showDialog(item) {
      console.log('智能分析:item ', item);
      this.cur_data = item;
      switch (item.eventCode) {
        case 'face_captured':
          this.visible_d = true;
          return '人脸抓拍';
        case 'fire':
          this.visible_a = true;
          return '烟火检测';
        case 'phone':
          this.visible_a = true;
          return '使用手机';
        case 'smoking':
          this.visible_a = true;
          return '吸烟检测';
        case 'extinguisher':
          this.visible_a = true;
          return '设备监控';
        case 'box':
          this.visible_a = true;
          return '物品占道';
        case 'car':
          this.visible_a = true;
          return '车辆占道';
        case 'vehicle':
          this.visible_a = true;
          return '车辆抓拍';
        case 'riding':
          this.visible_c = true;
          return '骑行抓拍';
        case 'personnel_sleepling_post':
          this.visible_b = true;
          return '人员睡岗';
        case 'service_leaving':
          this.visible_a = true;
          return '服务离岗';
        case 'job_leaving':
          this.visible_a = true;
          return '作业离岗';
        case 'supervisor_off_duty':
          this.visible_a = true;
          return '主管脱岗';
        case 'helmet_detection':
          this.visible_a = true;
          return '安全帽检测';
        case 'oil_unloading_and_off_duty':
          this.visible_a = true;
          return '卸油离岗';
        case 'smoke':
          this.visible_a = true;
          return '烟雾检测';
        case 'person_leave':
          this.visible_a = true;
          return '人员离岗';
        case 'person':
          this.visible_a = true;
          return '非法入侵';
        default:
          this.visible_a = true;
          return '其他类型';
      }
    },
    // 设置按钮类型
    setType_1(item) {
      switch (item.eventCode) {
        case "face_captured":
          return "primary";
        case "fire":
          return "danger";
        case "phone":
          return "info";
        case "smoking":
          return "warning";
        case "extinguisher":
          return "info";
        case "box":
          return "info";
        case "car":
          return "info";
        case "vehicle":
          return "primary";
        case "riding":
          return "primary";
        case "personnel_sleepling_post":
          return "warning";
        case "service_leaving":
          return "warning";
        case "job_leaving":
          return "warning";
        case "supervisor_off_duty":
          return "warning";
        case "helmet_detection":
          return "warning";
        case "oil_unloading_and_off_duty":
          return "warning";
        case "smoke":
          return "danger";
        case "person_leave":
          return "warning";
        case "person":
          return "danger";
        default:
          return "info";
      }
    },
    // 设置事件类型
    setType_1_a(item) {
      switch (item.eventCode) {
        case "face_captured":
          return "人脸抓拍";
        case "fire":
          return "烟火检测";
        case "phone":
          return "使用手机";
        case "smoking":
          return "吸烟检测";
        case "extinguisher":
          return "设备监控";
        case "box":
          return "物品占道";
        case "car":
          return "车辆占道";
        case "vehicle":
          return "车辆抓拍";
        case "riding":
          return "骑行抓拍";
        case "personnel_sleepling_post":
          return "人员睡岗";
        case "service_leaving":
          return "服务离岗";
        case "job_leaving":
          return "作业离岗";
        case "supervisor_off_duty":
          return "主管脱岗";
        case "helmet_detection":
          return "安全帽检测";
        case "oil_unloading_and_off_duty":
          return "卸油离岗";
        case "smoke":
          return "烟雾检测";
        case "person_leave":
          return "人员离岗";
        case "person":
          return "非法入侵";
        default:
          return "其他类型";
      }
    },
    // 设置处理状态
    handleStatus(item) {
      const handleStatus = item.handleStatus;
      const handleName = item.handleName;
      if (handleStatus == '1') {
        if (handleName) {
          return handleName;
        } else {
          return "已处理";
        }
      } else {
        return "待处理";
      }
    },
    // 设置处理后的按钮类型
    statusType(item) {
      const handleStatus = item.handleStatus;
      const handleOption = item.handleOption;
      if (handleStatus == '1') {
        return handleOption == "report" ? "primary" : "success";
      } else {
        return "danger";
      }
    },
    /* 处理图片预览 */
    handlePreview(url) {
      this.imageUrl = url;
      this.visiblePreview = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.main_con {
  width: 100%;
  border-radius: 4px;
}

main ul {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
main ul li {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin: 5px;
  width: calc(calc(100% / 5) - 10px);
  height: auto;
  border-radius: 8px;
  .image {
    aspect-ratio: 16 / 9;
    cursor: pointer;
  }

  .main {
    flex: 1;
    box-sizing: border-box;
    padding: 6px 10px;
    background-color: #cbe3ffff;
    border-radius: 0 0 8px 8px;
    .top {
      display: flex;
      justify-content: space-between;
      height: 50px;
      margin-bottom: 5px;

      .left {
        display: flex;
        flex-direction: column;

        .first {
          font-size: 12px;
          font-weight: 500;
          line-height: 23px;
          color: #000000;
        }

        .last {
          padding-left: 2px;
          font-size: 11px;
          font-weight: 600;
          line-height: 20px;
          color: #000000;
        }
      }
    }
    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
.el-form-item.last {
  margin-left: 205px;
}

.cascader {
  position: absolute;
  z-index: 9;
  width: 200px;
}

.image,
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 16 / 9;

  font-size: 17px;
  font-weight: 500;
  background-color: #eee;
  color: #19adca;

  border-radius: 8px 8px 0 0;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  margin-top: 1px;
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
.left::v-deep .el-button:first-child {
  margin-right: 10px;
}

.left::v-deep .el-button + .el-button {
  margin-top: 3px;
  margin-left: 0;
}
</style>
