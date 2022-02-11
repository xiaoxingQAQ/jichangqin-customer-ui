<template>
  <div class="detail_row">
    <template v-if="typex == 'a'">
      <div>
        <span>姓名</span>
        <el-input v-model="input"></el-input>
      </div>
    </template>

    <template v-if="typex == 'a'">
      <div class="sex">
        <span>性别</span>
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

      <div class="native_place ">
        <span>籍贯</span>
        <el-input v-model="input"></el-input>
      </div>

      <div class="id_number">
        <span>证件号码</span>
        <el-input v-model="input"></el-input>
      </div>

      <div class="address">
        <span>地址</span></span>
        <el-input
          v-model="input"
          placeholder="模糊搜索"
        ></el-input>
      </div>
    </template>

    <template v-if="isShow">
      <div class="equally">
        <span>{{setLabel.label_1}}</span>
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
      <div class="equally">
        <span>{{setLabel.label_2}}</span>
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
      <div class="equally">
        <span>{{setLabel.label_3}}</span>
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
    </template>
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
    setLabel() {
      switch (this.typex) {
        case 'b':
          return {
            label_1: '车牌',
            label_2: '颜色',
            label_3: '款式',
          }
        case 'c':
          return {
            label_1: '帽子',
            label_2: '口罩',
            label_3: '上装颜色',
          }
      }
    },
    isShow() {
      if (this.typex === 'b' || this.typex === 'c') {
        return true
      } else {
        return false
      }
    }
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
.detail_row {
  display: flex;
  margin-bottom: 10px;
  div {
    display: flex;
    align-items: center;
    margin-right: 10px;

    span {
      margin-right: 8px;
      font-size: 17px;
      font-weight: 500;
      color: #ffffff;
    }

    ::v-deep .el-input__inner {
      width: 159px !important;
      height: 32px !important;
    }
  }
  > div:first-child {
    ::v-deep .el-input__inner {
      width: 89px !important;
      height: 32px !important;
    }
  }
  .sex {
    &::v-deep .el-input__inner {
      width: 89px !important;
      height: 32px !important;
    }
    .select {
      position: relative;
      .before {
        position: absolute;
        top: 5px;
        left: 65px;
        width: 18px;
        height: 18px;

        transition: 0.3s;
        -moz-transition: -moz-transform 0.5s; /* Firefox 4 */
        -webkit-transition: -webkit-transform 0.5s; /* Safari and Chrome */
        -o-transition: -o-transform 0.5s; /* Opera */
        i {
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
        }
      }
    }
  }
  .native_place,
  .address {
    &::v-deep .el-input__inner {
      width: 136px !important;
      height: 32px !important;
    }
  }
  .id_number {
    &::v-deep .el-input__inner {
      width: 214px !important;
      height: 32px !important;
    }
  }

  .equally {
    .select {
      position: relative;
      .before {
        position: absolute;
        top: 5px;
        left: 135px;
        width: 18px;
        height: 18px;

        transition: 0.3s;
        -moz-transition: -moz-transform 0.5s; /* Firefox 4 */
        -webkit-transition: -webkit-transform 0.5s; /* Safari and Chrome */
        -o-transition: -o-transform 0.5s; /* Opera */
        i {
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
        }
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
