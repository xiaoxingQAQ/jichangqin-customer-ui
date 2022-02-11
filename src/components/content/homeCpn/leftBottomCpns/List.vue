<template>
  <div>
    <ul>
      <!-- 油站数据 -->
      <li v-for="item in list" @click="push">
        <div class="header">
          <div>京新加油站</div>
          <div>
            <span>综合评分</span>
            <span>85</span>
          </div>
        </div>
        <div class="main">
          <div class="left">
            <div class="li">
              <i></i>
              <span>今日告警</span>
              <b>25</b>
            </div>
            <div class="li">
              <i></i>
              <span>重大警情</span>
              <b>2</b>
            </div>
            <div class="li">
              <i></i>
              <span>警情处理</span>
              <b>100%</b>
            </div>
          </div>
          <div class="right"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  props: {
    list: {
      type: Array,
      default() {
        return [1, 2, 3, 4, 5, 6, 7, 8, 10]
      }
    }
  },
  data() {
    return {
    }
  },
  components: {
  },
  computed: {

  },
  watch: {
    list: {
      handler() {
        setTimeout(() => {
          this.$emit('refresh')
        }, 0);
      },
      deep: true
    }
  },
  methods: {
    push() {
      this.list.push(11)
    }
  },
}
</script>

<style lang="scss" scoped>
ul {
  width: 600px;
  li {
    box-sizing: border-box;
    margin-bottom: 5px;
    padding: 14px 13px;
    width: 283px;
    height: 130px;
    background: rgba(66, 81, 100, 0.92);
    border: 1px solid #6eb5de;
    box-shadow: 1px 1px 8px rgba(33, 179, 255, 0.67);

    border-radius: 4px;
    transition: 0.3s;
    cursor: pointer;

    .header {
      display: flex;
      justify-content: space-between;
      div:first-child {
        font-size: 14px;
        color: #6fe9ce;
        font-weight: 500;
      }

      div:last-child {
        span {
          font-size: 12px;
          font-weight: 500;
          color: #b6f0fc;
        }

        span:first-child {
          margin-right: 16px;
        }
      }
    }

    .main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 10px;

      .left {
        display: flex;
        flex-direction: column;
        .li {
          display: flex;
          height: 17px;
          align-items: center;
          margin-top: 10px;
          i {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }

          span {
            color: #b6f0fc;
          }

          span,
          b {
            margin-left: 14px;
            font-size: 12px;
            font-weight: 500;
            line-height: 17px;
          }
        }

        .li:nth-child(1) {
          i {
            background-color: #77c8ff;
          }

          b {
            color: #409eff;
          }
        }
        .li:nth-child(2) {
          i {
            background-color: #ff5b5d;
          }

          b {
            color: #ff5b5d;
          }
        }
        .li:nth-child(3) {
          i {
            background-color: #5feb84;
          }

          b {
            color: #5feb84;
          }
        }
      }
      .right {
        width: 13px;
        height: 13px;
        border-left: 2px solid #fff;
        border-bottom: 2px solid #fff;
        -webkit-transform: translate(0, -50%) rotate(-135deg);
        transform: translate(0, -50%) rotate(-135deg);
      }
    }
  }
}
</style>