<template>
  <div class="app-container main" style="height: 100%">
    <el-row :gutter="24" style="height: 100%">
      <el-col :span="5" :xs="24">
        <div
          class="head-container"
          style="height: 48px; display: flex; justify-content: center"
        >
          <h2>组织机构</h2>
        </div>
        <div class="tree-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          >
            <template class="custom-tree-node" slot-scope="{ data }">
              <span
                @dblclick="handleDblclick(data)"
                :class="['not_select', { active: data.id == orgId }]"
              >
                {{ data.label }}
              </span>
            </template>
          </el-tree>
        </div>
      </el-col>

      <el-col :span="19" :xs="24" style="height: 100%">
        <main class="map-container">
          <StationMap
            @openValve="openValve"
            @changeOrgId="changeOrgId"
            ref="stationMap"
          />
        </main>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { treeselect } from "@/api/system/dept";
import StationMap from "./AMap/stationMap";
import { mapGetters, mapMutations, mapState } from 'vuex';
export default {
  name: "mapPage",
  components: { StationMap },
  data() {
    return {
      valve: true,
      orgId: null,
      deptName: null,
      deptOptions: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  computed: {
    ...mapState('operation', ['deptId']),
    ...mapGetters(['info'])
  },
  watch: {
    // 根据名称筛选组织树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
    // vuex deptId
    deptId(val) {
      this.orgId = val;
    },
  },
  created() {
    this.deptOptions = this.info.deptPermission
    this.orgId = this.deptId;
    console.log(this.info);
  },
  methods: {
    ...mapMutations('operation', ['SET_ORGID']),
    // 节点单击事件
    handleNodeClick(data) {
      if (!this.valve) return
      this.SET_ORGID(data.id)
      if (data.type !== "1") {
        this.$refs.stationMap.$data.org_Id2 = data.id;
        this.$refs.stationMap.$data.isPreview = true;
        this.$bus.$emit("refreshVideo", data.id);
      } else if (data.type == "1") {
        this.orgId = data.id;
        this.$refs.stationMap.$data.isPreview = false;
      }
    },
    // 节点双击事件
    handleDblclick(data) {
      if (data.type !== "1") {
        this.$refs.stationMap.$data.org_Id2 = data.id
        this.$refs.stationMap.$data.visible = true
      }
    },
    /* 子组件地图点击，改变orgId */
    changeOrgId(orgId) {
      this.orgId = orgId;
    },
    openValve(val) {
      this.valve = val
    },
  },
};
</script>

<style lang="scss" scoped>
.tree-container {
  width: 100%;
  height: calc(100vh - 190px);
  overflow: auto;
}

.app-container {
  padding: 0;
  width: 100%;
  height: 100%;
  .map-container {
    width: 100%;
    height: 100%;
  }
}
::v-deep .el-tree-node__content {
  position: relative;
}
.app-tree-option {
  position: absolute;
  right: 0;
  top: 0px;
}

.app-tree-option {
  position: absolute;
  right: 0;
  top: 0px;
}

.main .row.option {
  margin-top: 2px;
  margin-bottom: 12px;
}

.el-tree {
  span {
    font-weight: 500;
    transition: all 500ms;
    &.not_select {
      -webkit-user-select: none;
      -moz-user-select: none;
      -o-user-select: none;
      user-select: none;
    }
    &.active {
      padding: 0 10px;
      color: #fff;
      background: #409eff;
      border-radius: 4px;
    }
  }
}

::v-deep .el-tree-node__content:hover {
  background-color: #0085b515 !important;
  border-radius: 4px;
}

/* el-tree获得焦点的背景颜色 */
::v-deep .el-tree-node:focus > .el-tree-node__content {
  background-color: transparent;
  border-radius: 4px;
}
</style>
