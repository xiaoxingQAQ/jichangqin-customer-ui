<template>
  <header>
      <!-- 左侧 -->
      <div>
        <div>
          <img src="@/assets/images/home/map-gas-full.svg" alt="" />
        </div>
        <span>油站数据</span>
      </div>
      <!-- 右侧 -->
      <div>
        <!-- 查询 -->
        <el-select size="mini" @visible-change="onChange" v-model="value" placeholder="">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <div :class="['before', {change: isChange}]">
          <i class="iconfont icon-daosanjiaoxing"></i>
        </div>
        <el-button type="primary" size="mini" :loading="loading" @click="search">查询</el-button>
      </div>
    </header>
</template>

<script>
export default {
  data() {
    return {
      loading: false, // btn loading
      isChange: false, // true 旋转三角形
      value: null,
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }
      ],
    }
  },
  methods: {
    onChange() {
      this.isChange = !this.isChange
    },
    // 处理查询
    search() {
      if (!this.value) return this.$message.warning('请选择')
      this.loading = true

      this.$emit('onSearch', ) // 请求出结果后 发送
    },
  },
}
</script>

<style lang="scss" scoped>
// 头部
header {
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 25px;
  div:nth-child(1) {
    display: flex;
    align-items: center;
    div {
      margin-right: 16px;
      width: 20px;
      height: 20px;
      img {
        width: 100%;
      }
    }
    span {
      font-size: 14px;
      font-weight: 500;
      color: #ffffff;
    }
  }
  div:last-child {
    position: relative;
    display: flex;
    justify-content: space-between;

    .el-button {
      margin-left: 8px;
    }

    .before {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 9px;
      left: 74px;
      width: 13px;
      height: 13px;

      transition: 0.5s;
      -moz-transition: -moz-transform 0.5s; /* Firefox 4 */
      -webkit-transition: -webkit-transform 0.5s; /* Safari and Chrome */
      -o-transition: -o-transform 0.5s; /* Opera */
      i {
        color: #fff;
      }
    }

    .change {
      -moz-transform: rotateZ(180deg);
      -webkit-transform: rotateZ(180deg);
      -o-transform: rotateZ(180deg);
      transform: rotateZ(180deg);
      filter: FlipV;
    }
  }
}

::v-deep .el-input__inner {
  width: 100px !important;
  height: 32px;
  color: #fff;
  background: rgba(50, 55, 83, 0.226) !important;
  border: 1px solid #84ece4;
  opacity: 0.61;
}
</style>
