<template>
  <div class="app-container main">
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <div class="row option">
          <div class="left">
            <el-button size="mini" type="danger" @click="goBack"
              ><i class="el-icon-back">返回</i></el-button
            >
            <el-button
              style="margin-right: 10px"
              size="mini"
              icon="el-icon-plus"
              type="primary"
              @click="addDialog"
              >人脸注册</el-button
            >
            <!-- <el-button style="margin-right: 10px" size="mini" type="warning"
              >导入</el-button
            > -->
            <excel-export
              :bookType="excelExport.bookType"
              :filename="excelExport.filename"
              :sheet="excelExport.sheet"
              :on-error="onError"
            >
              <el-button
                icon="el-icon-download"
                size="mini"
                type="success"
                :disabled="userList.length ? false : true"
                >导出</el-button
              >
            </excel-export>
          </div>
          <el-form
            ref="queryParams"
            class="right"
            :inline="true"
            :model="queryParams"
          >
            <el-form-item>
              <el-date-picker
                placeholder="注册时间"
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
              <el-input
                size="small"
                v-model="queryParams.name"
                placeholder="姓名"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-input
                size="small"
                v-model="queryParams.code"
                placeholder="编号"
              ></el-input>
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
          <el-table-column label="姓名" align="center" key="name" prop="name" />
          <el-table-column
            label="性别"
            align="center"
            key="genderStr"
            prop="genderStr"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="编号"
            align="center"
            key="code"
            prop="code"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="{ row }">
              <span style="fontweight: 500">
                {{ row.code ? row.code : '暂无' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="证件号码"
            align="center"
            key="idCard"
            prop="idCard"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="{ row }">
              <span style="fontweight: 500">
                {{ row.idCard ? row.idCard : '暂无' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="部门"
            align="center"
            key="dept"
            prop="dept"
            width="120"
          >
            <template slot-scope="{ row }">
              <span style="font-weight: 500">
                {{ setDepartment(departmentOptions, +row.department) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="职位"
            align="center"
            key="position"
            prop="position"
          >
            <template slot-scope="{ row }">
              <span style="fontweight: 500">
                {{
                  row.position === null ? '暂无' : positionList[row.position]
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="联系方式"
            align="center"
            key="mobile"
            prop="mobile"
          >
            <template slot-scope="{ row }">
              <span style="fontweight: 500">
                {{ row.mobile ? row.mobile : '暂无' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="人车绑定" align="center" key="carBind">
            <template slot-scope="{ row }">
              <span style="font-weight: 500">
                {{ row.carBind ? '是' : '否' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="车牌"
            align="center"
            key="carNum"
            prop="carNum"
          >
            <template slot-scope="{ row }">
              <span style="font-weight: 500">
                {{ row.carNum ? row.carNum : '暂无' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="入职时间"
            align="center"
            prop="createTime"
            width="160"
          >
            <template slot-scope="{ row }">
              <span style="fontweight: 500">{{
                row.createTime ? parseTime(row.createTime) : '暂无'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="人脸照片"
            align="center"
            key="facePhotoUrl"
            prop="facePhotoUrl"
          >
            <template slot-scope="{ row }">
              <img
                v-if="row.facePhotoUrl"
                style="width: 30px"
                :src="row.facePhotoUrl"
              />
              <span v-else style="fontweight: 500">暂无</span>
            </template>
          </el-table-column>
          <el-table-column label="车牌图片" align="center" key="carImgUrl">
            <template slot-scope="{ row }">
              <img
                v-if="row.carImgUrl"
                style="width: 30px"
                :src="row.carImgUrl"
              />
              <span v-else style="fontweight: 500">暂无</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:user:edit']"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:user:remove']"
                >注销</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="gerPersonList"
        />
      </el-col>
    </el-row>

    <!-- dialog -->

    <el-dialog
      :title="form.id ? '修改信息' : '人脸注册'"
      :visible.sync="visible"
      width="55%"
      :before-close="handleClose"
    >
      <el-form
        :model="form"
        status-icon
        :rules="formRules"
        ref="form"
        label-width="100px"
        class="form"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编号" prop="code">
              <el-input v-model="form.code" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="row2">
              <el-form-item label="性别" prop="genderStr">
                <el-select
                  v-model="form.genderStr"
                  placeholder="性别"
                  style="width: 100%"
                >
                  <el-option label="男" value="男"></el-option>
                  <el-option label="女" value="女"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="阈值" prop="threshold">
                <el-input
                  v-model="form.threshold"
                  style="width: 100%"
                ></el-input>
                <!-- <el-select
                  seize
                  v-model="form.threshold"
                  placeholder="阈值"
                  style="width: 100%"
                >
                  <el-option label="男" value="男"></el-option>
                  <el-option label="女" value="女"></el-option>
                </el-select> -->
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件号" prop="idCard">
              <el-input v-model="form.idCard" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门" prop="department">
              <el-cascader
                :disabled="true"
                style="width: 100%"
                collapse-tags
                placeholder="请选择部门"
                :clearable="true"
                :options="departmentOptions"
                :props="{
                  value: 'id',
                  label: 'label',
                  checkStrictly: true,
                  emitPath: false,
                }"
                :show-all-levels="false"
                v-model="form.department"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位" prop="position">
              <el-select
                seize
                v-model="form.position"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="it in options_position"
                  :key="it.value"
                  :label="it.label"
                  :value="it.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="mobile">
              <el-input v-model="form.mobile" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人车绑定" prop="carBind">
              <el-select
                v-model="form.carBind"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="入职时间" prop="date">
              <el-date-picker
                style="width: 100%"
                v-model="form.createTime"
                align="right"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车牌" prop="carNum">
              <el-input v-model="form.carNum" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="人脸录入" prop="facePhotoUrl">
              <el-upload
                class="avatar-uploader"
                style="margin-top: 10px"
                :action="uploadUrl"
                :headers="headers"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img
                  v-if="form.facePhotoUrl"
                  :src="form.facePhotoUrl"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车牌录入" prop="carImgUrl">
              <el-upload
                class="avatar-uploader"
                style="margin-top: 10px"
                :action="uploadUrl"
                :headers="headers"
                :show-file-list="false"
                :on-success="handleCarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img
                  v-if="form.carImgUrl"
                  :src="form.carImgUrl"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button type="danger" @click="handleClose">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listPersons, addPerson, deletePerson } from "@/api/device/person";
import { getToken } from "@/utils/auth";
import { mapGetters } from 'vuex';

import { ExcelExport } from 'pikaz-excel-js';

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

const pickerOptions = {
  disabledDate(time) {
    return time.getTime() > Date.now();
  },
  shortcuts: [{
    text: '今天',
    onClick(picker) {
      picker.$emit('pick', new Date());
    }
  }, {
    text: '昨天',
    onClick(picker) {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24);
      picker.$emit('pick', date);
    }
  }, {
    text: '一周前',
    onClick(picker) {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      picker.$emit('pick', date);
    }
  }]
};
export default {
  components: { Treeselect, ExcelExport },
  props: {
    orgId: Number,
  },
  data() {
    return {
      /* 导出的配置 */
      excelExport: {
        bookType: 'xlsx',
        filename: 'export',
        sheet: [],
      },

      uploadUrl: process.env.VUE_APP_BASE_API + '/file/upload/image',
      headers: { Authorization: "Bearer " + getToken() },
      archivesId: null, // 档案ID
      carList: [],
      // 部门树选项
      departmentOptions: [],
      visible: false,
      // 注册人脸
      title: null,
      pickerOptions: pickerOptions,
      form: {
        name: null, // 姓名
        code: null, // 编号
        genderStr: null, // 性别
        threshold: 85,
        facePhotoUrl: null, // 人脸录入照片
        idCard: null,
        department: null, // 部门
        position: null, // 职位
        mobile: null, // 联系方式
        carBind: null, // 人车绑定
        createTime: null, // 入职时间
        carNum: null, // 车牌号
        carImgUrl: null // 车牌录入照片
      },
      options_position: [
        {
          label: '店长',
          value: "0"
        },
        {
          label: '便利店主管',
          value: "1"
        },
        {
          label: '其他',
          value: "2"
        }
      ],
      formRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        genderStr: [
          { required: true, message: '请输入性别', trigger: 'blur' },
        ],
        threshold: [
          { required: true, message: '请输入阈值', trigger: 'blur' },
        ],
        idCard: [
          { required: false, message: '请选择管控区域', trigger: 'blur' },
        ],
        mobile: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          },
        ],
        carNum: [
          {
            pattern: /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$/,
            message: "请输入正确的车牌",
            trigger: "blur"
          },
        ],
      },
      // 模糊搜索
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        archivesId: null,
        name: null, // 姓名
        code: null, // 编号
        department: null,
        startDate: null,
        endDate: null
      },

      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
      // 显示搜索条件
      showSearch: true,
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 部门名称
      deptName: undefined,
      userList: [],
      // 日期范围
      dateRange: [],
      // 总条数
      total: 0,
      positionList: ['店长', '便利店主管', '其他']
    }
  },
  created() {
    this.departmentOptions = this.info.deptPermission;
    this.gerPersonList()
    console.log('departmentOptions', this.departmentOptions)
  },
  computed: {
    ...mapGetters(['info']),
  },
  watch: {
    dateRange(val) {
      console.log(val);
    }
  },
  methods: {
    /** 查询用户列表 */
    gerPersonList() {
      this.loading = true;

      const archivesId = JSON.parse(sessionStorage.getItem('archivesId'));

      this.archivesId = archivesId;
      this.queryParams.archivesId = archivesId;
      this.queryParams.startDate = this.dateRange && this.dateRange.length ? this.dateRange[0] : null;
      this.queryParams.endDate = this.dateRange && this.dateRange.length ? this.dateRange[1] : null;
      listPersons(this.queryParams).then(response => {
        console.log('response: ', response);
        this.userList = response.rows;
        this.total = parseInt(response.total);
        this.ExcelExport(response.rows)
        this.loading = false;
      }
      );
    },
    /* 设置导出数据 */
    ExcelExport(data) {
      const title = '人员信息';
      let tableItems = [];
      this.excelExport.filename = title;
      data.length && data.forEach((item, index) => {
        tableItems.push({
          index: index + 1,
          name: item.name ? item.name : '暂无',
          genderStr: item.genderStr ? item.genderStr : '暂无',
          code: item.code ? item.code : '暂无',
          idCard: item.idCard ? item.idCard : '暂无',
          dept: item.dept ? item.dept : '暂无',
          position: item.position === null ? '暂无' : positionList[item.position],
          mobile: item.mobile ? item.mobile : '暂无',
          carBind: item.carBind && item.carBind ? '是' : '否',
          carNum: item.carNum ? item.carNum : '暂无',
          createTime: item.createTime ? item.createTime : '暂无',
          facePhotoUrl: item.facePhotoUrl ? item.facePhotoUrl : '暂无',
          carImgUrl: item.carImgUrl ? item.carImgUrl : '暂无'
        })
      })
      this.excelExport.sheet.push({
        title,
        multiHeader: [[], ['序号', '姓名', '性别', '编号', '证件号码', '部门', '职位', '联系方式', '人车绑定', '车牌', '入职时间', '人脸照片', '车牌照片']],
        table: [...tableItems],
        keys: ['index', 'name', 'genderStr', 'code', 'idCard', 'dept', 'position', 'mobile', 'carBind', 'carNum', 'createTime', 'facePhotoUrl', 'carImgUrl'],
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
      console.log(err)
    },
    exportTable() {
      this.$refs.excelExport.pikaExportExcel()
    },
    /* 单击节点事件 */
    handleNodeClick(node, data) {
      this.queryParams.department = data.id;
      this.$refs.cascader.dropDownVisible = false
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.gerPersonList();
    },
    /* 重置搜索 */
    resetQuery() {
      this.dateRange = [];
      this.queryParams.name = null;
      this.queryParams.code = null;
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getTreeselect();
    },
    reset() {
      this.form = {
        name: undefined,
        code: undefined,
        genderStr: undefined, // 性别
        threshold: 85,
        facePhotoUrl: undefined,
        idCard: undefined,
        department: undefined, // 部门
        position: undefined, // 职责
        mobile: undefined, // 联系方式
        carBind: undefined, // 人车绑定
        createTime: undefined, // 入职时间
        carNum: undefined, // 车牌号
        carImgUrl: undefined
      };
      this.resetForm("form");
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row);
      row.department = parseInt(row.department)
      this.addDialog()
      Object.assign(this.form, row)
    },
    handleDelete(row) {
      this.$modal
        .confirm('是否确认注销人员名称为"' + row.name + '"的数据项？')
        .then(function () {
          return deletePerson({ ids: [row.id] })
        })
        .then(() => {
          this.gerPersonList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => { });

    },
    /* 设置部门 递归 */
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    goBack() {
      console.log(111);
      this.$emit('onSwitch')
    },

    // 人脸注册
    addDialog() {
      this.form.department = this.orgId
      this.visible = true
      this.title = '注册'
    },

    /* dialog */
    handleClose() {
      this.reset()
      this.visible = false
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.archivesId = this.archivesId;
          addPerson(this.form).then((res) => {
            if (res.code == 200) {
              this.form.id
                ? this.$notify.success('修改成功')
                : this.$notify.success('注册成功')

              this.handleClose()
              this.gerPersonList();
            } else {
              this.form.id
                ? this.$notify.success('修改失败')
                : this.$notify.success('注册失败')
            }
          });
        }
      });
    },
    handleAvatarSuccess(res, file) {
      console.log('res: ', res);
      if (res.code === 200) {
        this.form.facePhotoUrl = res.data.url;
      }
    },
    handleCarSuccess(res, file) {
      console.log('res: ', res);
      if (res.code === 200) {
        this.form.carImgUrl = res.data.url;
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isPG = (isJPG || isPNG)              //限制图片格式为jpg / png
      const isLt2M = file.size / 1024 / 1024 < 2;//限制图片大小
      if (!isPG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isPG && isLt2M
    },
  }

}

</script>

<style scoped>
.row2 {
  width: 100%;
  display: flex;
}
.row2::v-deep .el-form-item:last-child {
  margin-left: 0;
}

.row {
  display: flex;
  justify-content: space-between;
}
.row /deep/.el-input__inner {
  width: 160px;
}

.first {
  margin-right: 6%;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

::v-deep.app-container {
  padding: 0;
}
::v-deep.el-tree-node__content {
  position: relative;
}
.app-tree-option {
  position: absolute;
  right: 0;
  top: 0px;
}
.main .row.option {
  margin-bottom: 10px;
}
.avatar-uploader-icon {
  border-radius: 6px;
  border: 1px dashed #d9d9d9;
  font-size: 28px;
  color: #8c939d;
  width: 152px;
  height: 152px;
  line-height: 152px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
  border-radius: 6px;
  border: 1px dashed #d9d9d9;
}

.right::v-deep .el-form-item {
  margin-bottom: 0;
}

::v-deep .el-form-item {
  margin-bottom: 8px;
}

::v-deep .pagination-container {
  transform: translateY(-10px);
}

::v-deep .el-form-item__error {
  display: none;
}

::v-deep .excel-export {
  display: inline-block;
}
</style>
