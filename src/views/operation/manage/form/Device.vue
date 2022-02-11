<template>
  <div class="app-container main">
    <el-row :gutter="24">
      <el-col :span="5" v-show="!isShow">
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
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          >
            <template class="custom-tree-node" slot-scope="{ data }">
              <span :class="{ active: data.id == orgId }">
                {{ data.label }}
              </span>
            </template>
          </el-tree>
        </div>
      </el-col>

      <!--用户数据-->
      <el-col :span="19" :class="{ max: isShow }">
        <device-page
          @onChange="onChange(arguments)"
          v-show="!isShow"
          :orgId="orgId"
        />
        <camera-page
          ref="cameraPage"
          @onChange="onChange(arguments)"
          v-show="isShow"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { treeselect } from "@/api/system/dept";
import { listCamera } from '@/api/device/camera'

import devicePage from './devicePage'
import cameraPage from './cameraPage'
import { mapGetters, mapMutations, mapState } from 'vuex';
export default {
  name: 'videoPage',
  components: {
    devicePage,
    cameraPage
  },
  data() {
    return {
      orgId: null,
      serverId: '',
      isShow: false,
      // 遮罩层
      loading: true,
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 部门树选项
      deptOptions: undefined,
      // 部门名称
      deptName: undefined
    }
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
    deptId(val) {
      this.orgId = val;
    },
  },
  created() {
    this.orgId = this.deptId;
    this.deptOptions = this.info.deptPermission
  },
  methods: {
    ...mapMutations('operation', ['SET_ORGID']),
    onChange(arg) {
      this.isShow = arg[1]
      this.serverId = arg[0] + ""
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      if (this.orgId == data.id) return
      this.SET_ORGID(data.id)
    },
  },
}
</script>

<style lang="scss" scoped>
.tree-container {
  width: 100%;
  height: calc(100vh - 190px);
  overflow: auto;
}

::v-deep .app-container {
  padding: 0;
  height: 100%;
}
::v-deep .el-tree-node__content {
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
::v-deep .el-form-item {
  margin-bottom: 8px;
}

::v-deep .el-form-item__error {
  display: none;
}

::v-deep .el-form-item--medium .el-form-item__content {
  height: 32px;
  line-height: 32px;
}

.el-tree {
  span {
    font-weight: 500;
    transition: all 500ms;
    &.active {
      padding: 0 10px;
      color: #fff;
      background: #409eff;
      border-radius: 4px;
    }
  }
}

.max {
  width: 100%;
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
