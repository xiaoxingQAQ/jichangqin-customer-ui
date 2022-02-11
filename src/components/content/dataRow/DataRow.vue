<template>
  <div class="data_row">
    <div class="left">
      <div>
        <span>开始时间</span>
        <el-date-picker
          size="small"
          v-model="value_1"
          type="datetime"
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </div>

      <div>
        <span>结束时间</span>
        <el-date-picker
          size="small"
          v-model="value_2"
          type="datetime"
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </div>

      <div v-if="typex == 'd'" class="input">
        <span>姓名</span>
        <el-input v-model="input"></el-input>
      </div>
    </div>

    <div class="right">
      <div v-show="typex == 'a'">
        <span>事件类型</span>
        <div class="select">
          <el-select
            @visible-change="onChange"
            v-model="value"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <div :class="['before', { change: isChange }]">
            <i class="iconfont icon-daosanjiaoxing"></i>
          </div>
        </div>
      </div>

      <div>
        <span>{{ setLabel_1 }}</span>
        <div class="select">
          <el-select
            @visible-change="onChange"
            v-model="value"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <div :class="['before', { change: isChange }]">
            <i class="iconfont icon-daosanjiaoxing"></i>
          </div>
        </div>
      </div>

      <div class="unique">
        <span>{{ setLabel_2 }}</span>
        <div class="select">
          <el-select
            @visible-change="onChange"
            v-model="value"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <div :class="['before', { change: isChange }]">
            <i class="iconfont icon-daosanjiaoxing"></i>
          </div>
        </div>
        <el-button type="primary" size="mini">查询</el-button>
        <el-button icon="el-icon-download" size="mini" v-if="typex == 'd'"
          >导出</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    typex: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      input: '', // 姓名

      value_1: null, // 开始时间
      value_2: null, // 结束时间
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
  computed: {
    setLabel_1() {
      switch (this.typex) {
        case 'a':
          return '地点'
        case 'b':
          return '抓拍地址'
        case 'c':
          return '布控类型'
        case 'd':
          return '性别'
      }
    },
    setLabel_2() {
      switch (this.typex) {
        case 'a':
          return '状态'
        case 'b':
          return '抓拍类型'
        case 'c':
          return '布控名称'
        case 'd':
          return '归档'
      }
    },
  },
  methods: {
    // 选择框变化 触发
    onChange() {
      this.isChange = !this.isChange
    },
  },
}
</script>

<style lang="scss" scoped>
.data_row {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  // 左边
  .left {
    display: flex;
    div {
      display: flex;
      align-items: center;

      span {
        margin-right: 10px;
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        color: #ffffff;
      }
    }
    div:first-child {
      margin-right: 20px;
    }

    .input {
      margin-left: 10px;
      display: flex;
      span {
        text-align: center;
        width: 28px;
        height: 20px;
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        color: #ffffff;
      }

      ::v-deep .el-input__inner {
        width: 88px;
        height: 32px;
      }
    }
  }
  // 右边
  .right {
    display: flex;
    .select {
      position: relative;
      .before {
        position: absolute;
        top: 5px;
        left: 132px;
        width: 18px;
        height: 18px;

        transition: 0.5s;
        -moz-transition: -moz-transform 0.5s; /* Firefox 4 */
        -webkit-transition: -webkit-transform 0.5s; /* Safari and Chrome */
        -o-transition: -o-transform 0.5s; /* Opera */
        i {
          position: absolute;
          top: 0px;
          left: 1px;
          color: #fff;
        }
      }
    }

    div {
      display: flex;
      align-items: center;

      span {
        margin-right: 16px;
        font-size: 14px;
        font-weight: 500;
        color: #ffffff;
      }
    }

    div:nth-child(1),
    div:nth-child(2) {
      margin-right: 10px;
    }

    ::v-deep .el-input__inner {
      width: 159px !important;
      height: 32px !important;
    }

    .unique {
      ::v-deep .el-button--default {
        font-weight: 500 !important;
        color: #000;
        background-color: #84f7d1ff;
        border-color: #84f7d1ff;
      }

      ::v-deep .el-button--default:hover {
        color: #000;
        background-color: rgb(157, 243, 214);
      }
    }
  }
}

.change {
  -moz-transform: rotateZ(180deg);
  -webkit-transform: rotateZ(180deg);
  -o-transform: rotateZ(180deg);
  transform: rotateZ(180deg);
  filter: FlipV;
}

/* 选择框 */
::v-deep .el-input__inner {
  color: #fff !important;
  background: rgba(35, 63, 87, 0.65) !important;
  border: 1px solid #84ece4 !important;
}

::v-deep .el-icon-arrow-up:before {
  display: none !important;
}
</style>
