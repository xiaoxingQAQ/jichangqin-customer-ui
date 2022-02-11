<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-row :gutter="10" class="mb8">
          <el-form
            :inline="true"
            ref="form"
            :model="queryParams"
            label-width="80px"
          >
            <div class="left">
              <el-form-item>
                <el-select
                  size="small"
                  v-model="queryParams.type"
                  placeholder="选择报表类型"
                >
                  <el-option
                    v-for="item in option"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="right" style="transform: translate(-20px)">
              <main style="display: inline-block" v-if="getValue == 1">
                <el-form-item>
                  <el-date-picker
                    size="small"
                    v-model="dateRange"
                    type="daterange"
                    range-separator="至"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-cascader
                    ref="cascader"
                    size="small"
                    style="margin-left: 0.5%"
                    collapse-tags
                    placeholder="区域"
                    :options="treeData"
                    :props="{
                      value: 'id',
                      label: 'label',
                      checkStrictly: true,
                      emitPath: false,
                    }"
                    :show-all-levels="false"
                    v-model="queryParams.orgId"
                  >
                    <template slot-scope="{ node, data }">
                      <span
                        :class="{ active: queryParams.orgId == data.id }"
                        @click="handleNodeClick(data)"
                        >{{ data.label }}</span
                      >
                    </template>
                  </el-cascader>
                </el-form-item>
              </main>
              <main style="display: inline-block" v-else-if="getValue == 2">
                <el-form-item>
                  <el-date-picker
                    size="small"
                    v-model="week"
                    type="week"
                    :format="start + ' 至 ' + end"
                    placeholder="选择周"
                    :picker-options="onPicker"
                    @change="showDate"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-cascader
                    ref="cascader"
                    size="small"
                    style="margin-left: 0.5%"
                    collapse-tags
                    placeholder="区域"
                    :options="treeData"
                    :props="{
                      value: 'id',
                      label: 'label',
                      checkStrictly: true,
                      emitPath: false,
                    }"
                    :show-all-levels="false"
                    v-model="queryParams.orgId"
                  >
                    <template slot-scope="{ node, data }">
                      <span
                        :class="{ active: queryParams.orgId == data.id }"
                        @click="handleNodeClick(data)"
                        >{{ data.label }}</span
                      >
                    </template>
                  </el-cascader>
                </el-form-item>
              </main>
              <main
                style="display: inline-block; transform: translate(9.6px)"
                v-else-if="getValue == 3"
              >
                <el-form-item>
                  <el-date-picker
                    size="small"
                    v-model="month"
                    type="month"
                    @change="showDate"
                    :picker-options="pickerOptions"
                    placeholder="选择月"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-cascader
                    ref="cascader"
                    size="small"
                    style="margin-left: 0.5%"
                    collapse-tags
                    placeholder="区域"
                    :options="treeData"
                    :props="{
                      value: 'id',
                      label: 'label',
                      checkStrictly: true,
                      emitPath: false,
                    }"
                    :show-all-levels="false"
                    v-model="queryParams.orgId"
                  >
                    <template slot-scope="{ node, data }">
                      <span
                        :class="{ active: queryParams.orgId == data.id }"
                        @click="handleNodeClick(data)"
                        >{{ data.label }}</span
                      >
                    </template>
                  </el-cascader>
                </el-form-item>
                <el-form-item> </el-form-item>
              </main>
              <main style="display: inline-block" v-else-if="getValue == 4">
                <el-form-item>
                  <el-date-picker
                    size="small"
                    v-model="year"
                    type="year"
                    value-format="yyyy"
                    placeholder="选择年"
                    @change="showDate"
                    :picker-options="pickerOptions"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-cascader
                    ref="cascader"
                    size="small"
                    style="margin-left: 0.5%"
                    collapse-tags
                    placeholder="区域"
                    :options="treeData"
                    :props="{
                      value: 'id',
                      label: 'label',
                      checkStrictly: true,
                      emitPath: false,
                    }"
                    :show-all-levels="false"
                    v-model="queryParams.orgId"
                  >
                    <template slot-scope="{ node, data }">
                      <span
                        :class="{ active: queryParams.orgId == data.id }"
                        @click="handleNodeClick(data)"
                        >{{ data.label }}</span
                      >
                    </template>
                  </el-cascader>
                </el-form-item>
              </main>
            </div>
            <div class="search">
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="mini"
                  @click="handleQuery"
                  >查询</el-button
                >
              </el-form-item>
              <el-form-item class="last">
                <el-button
                  icon="el-icon-refresh"
                  size="mini"
                  @click="handleReset"
                  >重置</el-button
                >
              </el-form-item>
            </div>
          </el-form>
        </el-row>
        <main>
          <!-- 日报表 -->
          <el-table
            v-if="getValue == 1"
            v-loading="loading"
            :data="userList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column label="序号" type="index" align="center">
            </el-table-column>
            <!-- <el-table-column label="日期" align="center" key="date" prop="date">
              <template slot-scope="{ row }">
              </template>
            </el-table-column> -->
            <el-table-column
              label="油站名称"
              align="center"
              key="name"
              prop="name"
              :show-overflow-tooltip="true"
              width="130"
            >
            </el-table-column>
            <el-table-column
              label="当日客流(车/次)"
              align="center"
              key="allCount"
              prop="allCount"
              :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
              label="VIP会员"
              align="center"
              key="custVip"
              prop="custVip"
              :show-overflow-tooltip="true"
              width="100"
            >
            </el-table-column>
            <el-table-column
              label="周边客户"
              align="center"
              key="custPeriphery"
              prop="custPeriphery"
              width="120"
            >
            </el-table-column>
            <el-table-column
              label="潜在客户"
              align="center"
              key="custPotential"
              prop="custPotential"
            >
            </el-table-column>
            <el-table-column
              label="过路客户"
              align="center"
              key="custCrossing"
              prop="custCrossing"
            ></el-table-column>
            <el-table-column
              label="早班客流"
              align="center"
              key="zaoban"
              prop="zaoban"
            ></el-table-column>
            <el-table-column
              label="中班客流"
              align="center"
              key="zhongban"
              prop="zhongban"
            ></el-table-column>
            <el-table-column
              label="晚班客流"
              align="center"
              key="wanban"
              prop="wanban"
            ></el-table-column>
          </el-table>
          <!-- 周报表 -->
          <el-table
            v-else-if="getValue == 2"
            v-loading="loading"
            :data="userList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column label="序号" type="index" align="center">
            </el-table-column>
            <!-- <el-table-column label="星期" align="center" key="date" prop="date">
            </el-table-column> -->
            <el-table-column
              label="油站名称"
              align="center"
              key="name"
              prop="name"
              :show-overflow-tooltip="true"
              width="130"
            >
            </el-table-column>
            <el-table-column
              label="当日客流(车/次)"
              align="center"
              key="allCount"
              prop="allCount"
              :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
              label="VIP会员"
              align="center"
              key="custVip"
              prop="custVip"
              :show-overflow-tooltip="true"
              width="100"
            >
            </el-table-column>
            <el-table-column
              label="周边客户"
              align="center"
              key="custPeriphery"
              prop="custPeriphery"
              width="120"
            >
            </el-table-column>
            <el-table-column
              label="潜在客户"
              align="center"
              key="custPotential"
              prop="custPotential"
            >
            </el-table-column>
            <el-table-column
              label="过路客户"
              align="center"
              key="custCrossing"
              prop="custCrossing"
            ></el-table-column>
            <el-table-column
              label="早班客流"
              align="center"
              key="zaoban"
              prop="zaoban"
            ></el-table-column>
            <el-table-column
              label="中班客流"
              align="center"
              key="zhongban"
              prop="zhongban"
            ></el-table-column>
            <el-table-column
              label="晚班客流"
              align="center"
              key="wanban"
              prop="wanban"
            ></el-table-column>
          </el-table>
          <!-- 月报表 -->
          <el-table
            v-else-if="getValue == 3"
            v-loading="loading"
            :data="userList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column label="序号" type="index" align="center">
            </el-table-column>
            <!-- <el-table-column label="日期" align="center" key="date" prop="date">
            </el-table-column> -->
            <el-table-column
              label="油站名称"
              align="center"
              key="name"
              prop="name"
              :show-overflow-tooltip="true"
              width="130"
            >
            </el-table-column>
            <el-table-column
              label="当日客流(车/次)"
              align="center"
              key="allCount"
              prop="allCount"
              :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
              label="VIP会员"
              align="center"
              key="custVip"
              prop="custVip"
              :show-overflow-tooltip="true"
              width="100"
            >
            </el-table-column>
            <el-table-column
              label="周边客户"
              align="center"
              key="custPeriphery"
              prop="custPeriphery"
              width="120"
            >
            </el-table-column>
            <el-table-column
              label="潜在客户"
              align="center"
              key="custPotential"
              prop="custPotential"
            >
            </el-table-column>
            <el-table-column
              label="过路客户"
              align="center"
              key="custCrossing"
              prop="custCrossing"
            ></el-table-column>
            <el-table-column
              label="早班客流"
              align="center"
              key="zaoban"
              prop="zaoban"
            ></el-table-column>
            <el-table-column
              label="中班客流"
              align="center"
              key="zhongban"
              prop="zhongban"
            ></el-table-column>
            <el-table-column
              label="晚班客流"
              align="center"
              key="wanban"
              prop="wanban"
            ></el-table-column>
          </el-table>
          <!-- 年报表 -->
          <el-table
            v-else-if="getValue == 4"
            v-loading="loading"
            :data="userList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column label="序号" type="index" align="center">
            </el-table-column>
            <!-- <el-table-column label="年度" align="center" key="date" prop="date">
            </el-table-column> -->
            <el-table-column
              label="油站名称"
              align="center"
              key="name"
              prop="name"
              :show-overflow-tooltip="true"
              width="130"
            >
              <template slot-scope="{ row }">
                <span>{{ row.startTime + '~' + row.endTime }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="当日客流(车/次)"
              align="center"
              key="allCount"
              prop="allCount"
              :show-overflow-tooltip="true"
            >
            </el-table-column>
            <el-table-column
              label="VIP会员"
              align="center"
              key="custVip"
              prop="custVip"
              :show-overflow-tooltip="true"
              width="100"
            >
            </el-table-column>
            <el-table-column
              label="周边客户"
              align="center"
              key="custPeriphery"
              prop="custPeriphery"
              width="120"
            >
            </el-table-column>
            <el-table-column
              label="潜在客户"
              align="center"
              key="custPotential"
              prop="custPotential"
            >
            </el-table-column>
            <el-table-column
              label="过路客户"
              align="center"
              key="custCrossing"
              prop="custCrossing"
            ></el-table-column>
            <el-table-column
              label="早班客流"
              align="center"
              key="zaoban"
              prop="zaoban"
            ></el-table-column>
            <el-table-column
              label="中班客流"
              align="center"
              key="zhongban"
              prop="zhongban"
            ></el-table-column>
            <el-table-column
              label="晚班客流"
              align="center"
              key="wanban"
              prop="wanban"
            ></el-table-column>
          </el-table>
        </main>
        <!-- 暂时隐藏 -->
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { getPassengerList } from '@/api/device/passengers'

const option = [
  { value: 1, label: '日报表' },
  { value: 2, label: '周报表' },
  { value: 3, label: '月报表' },
  { value: 4, label: '年报表' }
];
export default {
  components: {},
  data() {
    return {
      start: null, // 起始时间
      end: null, // 结束时间
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      onPicker: {
        firstDayOfWeek: 1,
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      option: option,
      loading: false,

      // 非单个禁用
      single: true,
      // 表格数据
      userList: [],
      // 日期范围
      dateRange: [],
      // 总条数
      total: 0,
      // 查询参数
      week: null,
      month: null,
      year: null,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: 1,
        startDate: null,
        endDate: null,
        orgId: null,
      },
    };
  },
  computed: {
    ...mapGetters(['info']),
    getValue() {
      return this.queryParams.type
    },
  },
  watch: {
    "queryParams.type"(val) {
      this.loading = false;
      this.total = 0;
      this.queryParams.pageNum = 1;
      if (val) {
        this.handleReset()
      }
    },
  },
  created() {
    this.treeData = this.info.deptPermission;
    this.getList()
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.cancel()
      this.loading = true;
      switch (this.queryParams.type) {
        case 1:
          this.dateRange && this.dateRange.length
            ? this.queryParams.startDate = this.dateRange[0]
            : null;

          this.dateRange && this.dateRange.length
            ? this.queryParams.endDate = this.dateRange[1]
            : null;
          break;
      }

      console.log(this.queryParams);
      getPassengerList(this.queryParams).then((res) => {
        console.log('报表: ', res);
        this.userList = res.rows;
        this.total = parseInt(res.total);
        this.loading = false;
      });
    },

    /* 单击节点事件 */
    handleNodeClick(data) {
      this.queryParams.orgId = data.id;
      this.$refs.cascader.dropDownVisible = false
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /* 重置模糊查询 */
    handleReset() {
      this.dateRange = [];
      this.queryParams.week = null;
      this.queryParams.month = null;
      this.queryParams.year = null;
      this.queryParams.orgId = null;
      this.handleQuery()
    },
    handleSelectionChange() {
    },
    showDate(value) {
      let startTime, endTime, date, month, year, day;
      switch (this.queryParams.type) {
        case 2:
          startTime = this.dayjs(this.week).subtract(1, "day").$d;
          endTime = this.dayjs(startTime).add(6, "day").$d;
          this.start = this.splitDate(startTime);
          this.end = this.splitDate(endTime);

          this.queryParams.startDate = this.start;
          this.queryParams.endDate = this.end;
          break;
        case 3:
          date = new Date(value);
          month = (date.getMonth() + 1).toString().padStart(2, '0');
          year = date.getFullYear();
          startTime = year + '-' + month + '-01';
          day = new Date(year, month, 0);
          endTime = year + '-' + month + '-' + day.getDate();

          this.queryParams.startDate = startTime;
          this.queryParams.endDate = endTime;
          break;
        case 4:
          date = new Date(value);
          console.log('date: ', date);
          month = (date.getMonth() + 1).toString().padStart(2, '0');
          startTime = value + '-' + month + '-01';
          endTime = value + '-' + '12' + '-' + '31';
          this.queryParams.startDate = startTime;
          this.queryParams.endDate = endTime;
          break;
      }

    },
    splitDate(date) {
      return this.dayjs(date).format("YYYY-MM-DD");
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  justify-content: space-between;
  padding-right: 150px;
}

.search {
  position: absolute;
  right: 0;

  .el-form-item.last {
    position: relative;
    left: 0;
  }
}
</style>
