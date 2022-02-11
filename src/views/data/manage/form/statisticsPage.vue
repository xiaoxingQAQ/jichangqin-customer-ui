/* 数据统计页 */
<template>
  <div class="app_container main">
    <div class="row option">
      <div class="left">
        <el-button
          size="mini"
          type="danger"
          :disabled="multiple"
          @click="handleDelete('multiple')"
          icon="el-icon-delete"
          >删除</el-button
        >
        <el-button
          size="mini"
          type="success"
          icon="el-icon-download"
          :disabled="multiple"
          >导出</el-button
        >
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
        <el-form-item label="">
          <el-select
            v-model="queryParams.data_type"
            placeholder="数据类型"
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
        <el-form-item label="">
          <el-select
            v-model="queryParams.data_source"
            placeholder="数据源"
            size="small"
            style="width: 140px"
          >
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <!-- <span class="title">事件类型</span> -->
          <el-select
            v-model="queryParams.event_type"
            placeholder="事件类型"
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
        <el-form-item label="">
          <el-input
            v-model="queryParams.place"
            clearable
            size="small"
            placeholder="请输入地点"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="">
          <el-select
            v-model="queryParams.codeStatus"
            placeholder="状态"
            size="small"
            style="width: 140px"
          >
            <el-option
              v-for="item in options4"
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
          label="数据类型"
          align="center"
          key="userId"
          prop="data_type"
          v-if="columns[0].visible"
          width="80"
        />
        <el-table-column
          label="数据源"
          align="center"
          key="userName"
          prop="data_source"
          v-if="columns[1].visible"
          :show-overflow-tooltip="true"
          width="140"
        />
        <el-table-column
          label="事件类型"
          align="center"
          key="nickName"
          prop="event_type"
          v-if="columns[2].visible"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="时间"
          align="center"
          key="deptName"
          prop="date"
          v-if="columns[3].visible"
          :show-overflow-tooltip="true"
          width="150"
        />
        <el-table-column
          label="地点"
          align="center"
          key="phonenumber"
          prop="place"
          v-if="columns[4].visible"
          width="80"
        />
        <el-table-column
          label="现场截屏"
          align="center"
          key="status"
          prop="screen_shot"
          v-if="columns[5].visible"
        >
          <template slot-scope="{ row }">
            <el-image
              :src="row.screen_shot.url"
              :preview-src-list="row.screen_shot.srcList"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          label="现场录像"
          align="center"
          prop="video"
          v-if="columns[6].visible"
        >
          <template slot-scope="scope">
            <span>视频</span>
          </template>
        </el-table-column>

        <el-table-column
          label="抓拍照片"
          align="center"
          prop="photo"
          class-name="small-padding fixed-width"
        >
        </el-table-column>

        <el-table-column
          label="对比照片"
          align="center"
          prop="compare_photo"
          class-name="small-padding fixed-width"
        >
        </el-table-column>

        <el-table-column label="目标信息" align="center">
          <el-table-column
            label="姓名"
            align="center"
            prop="name"
            width="60"
            class-name="small-padding fixed-width"
          >
          </el-table-column>
          <el-table-column
            label="编号"
            align="center"
            prop="number"
            width="60"
            class-name="small-padding fixed-width"
          >
          </el-table-column>
        </el-table-column>

        <el-table-column
          label="责任人"
          align="center"
          prop="person_charge "
          width="70"
          class-name="small-padding fixed-width"
        >
        </el-table-column>

        <el-table-column
          label="处理结果"
          align="center"
          prop="result"
          width="90"
          class-name="small-padding fixed-width"
        >
        </el-table-column>

        <el-table-column
          label="管理"
          align="center"
          prop="manage"
          width="140"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <el-button
              icon="el-icon-edit"
              size="small"
              type="primary"
              @click="handleUpdate(row)"
              >修改</el-button
            >
            <el-button
              size="small"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </main>

    <footer>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
        class="pagination"
      />
    </footer>
    <UpdateForm ref="updateForm"></UpdateForm>
  </div>
</template>

<script>
import UpdateForm from "../components/statisticsPage/UpdateForm";
const options = [{ label: "安全生产", value: 1 }];
const options2 = [{ label: "1号安全监测服务器", value: 1 }];
const options3 = [{ label: "烟火检测", value: 1 }];
const options4 = [{ label: "安全生产", value: 1 }];

export default {
  components: {
    UpdateForm,
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 非单个禁用
      single: true,
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 部门树选项
      deptOptions: undefined,
      // 部门名称
      deptName: undefined,
      userList: [
        {
          data_type: "安全生产",
          data_source: "1号安全监测服务器",
          event_type: "烟火检测",
          date: "2020-04-07 18：20：40",
          place: "北京",
          screen_shot: {
            url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
            srcList: [
              "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
              "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg",
            ],
          },
          video: "",
          photo: "",
          compare_photo: "",
          name: "张三",
          number: "10000",
          person_charge: "张三",
          result: "警情上报",
          manage: "",
        },
      ],
      // 日期范围
      dateRange: [],
      // 总条数
      total: 1,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,

        startTime: null,
        endTime: null,
        data_type: undefined,
        data_source: undefined,
        event_type: undefined,
        place: undefined,
        codeStatus: undefined,
      },
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `用户名称`, visible: true },
        { key: 2, label: `用户昵称`, visible: true },
        { key: 3, label: `部门`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `状态`, visible: true },
        { key: 6, label: `创建时间`, visible: true },
      ],

      options: options,
      options2: options2,
      options3: options3,
      options4: options4,
    };
  },
  created() {
    // this.getList();
    // this.getTreeselect();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUser(this.addDateRange2(this.queryParams, this.dateRange)).then(
        (response) => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,

        startTime: null,
        endTime: null,
        data_type: undefined,
        data_source: undefined,
        event_type: undefined,
        place: undefined,
        codeStatus: undefined,
      };
      this.handleQuery();
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getTreeselect();
      getUser().then((response) => {
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.open = true;
        this.title = "添加用户";
        this.form.password = this.initPassword;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$refs.updateForm.handleUpdate(row);
    },
    /** 删除按钮操作 */
    handleDelete(val) {
      if (val === "multiple") {
        // 多选
        this.$notify({
          title: "Success",
          message: "多选删除",
          type: "success",
          duration: 2000,
        });
      } else {
        this.$notify({
          title: "Success",
          message: "单选删除",
          type: "success",
          duration: 2000,
        });
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    append(data) { },
    remove(node, data) { },
  },
};
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
