<template>
  <nav>
    <!-- user -->
    <div class="user_container">
      <span>
        <img
          src="@/assets/images/home/14.svg"
          alt=""
        />
      </span>
      <span>
        <span>Administrator</span>
      </span>
    </div>
    <!-- 导航 -->
    <div class="nav_container">
      <!-- 控制导航区 -->
      <div class="control_container">
        <div class="control">
          <div>
            <i
              style="transform: translateY(-1px)"
              class="iconfont icon-fanhui1"
            ></i>
          </div>
          <div>
            <i class="iconfont icon-shuaxin"></i>
          </div>
          <div>
            <span>在线用户：</span>
            <span>10</span>
          </div>
        </div>

        <div>
          <span v-if="$route.path != '/index' ">加油站平台</span>
        </div>
      </div>
      <!-- 菜单导航区 -->
      <div class="memu_container">
        <ul>
          <li
            v-for="(item, index) in menuList"
            :key="item.id"
            @click="onChange(item.id)"
            :class="{ active: currentIndex == index }"
          >
            <i :class="[
                'iconfont',
                item.icon,
                { active_i: currentIndex == index },
                { unique: index == 3 }
              ]"></i>
          </li>
        </ul>
        <div>
          <el-checkbox style="transform: translateY(1px)">弹窗预警</el-checkbox>
          <div>
            <i class="iconfont icon-shezhi" @click="$router.push('/operation')"></i>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 0,
      menuList: [
        { id: 0, title: '首页', icon: 'icon-dingwei1' },
        { id: 1, title: '监控中心', icon: 'icon-zhifajianguan1' },
        { id: 2, title: '布控界面', icon: 'icon-jiankongshexiangtou' },
        { id: 3, title: '智能分析', icon: 'icon-jiqiaofenxi' },
      ]
    }
  },
  created() {
    this.selected()
  },
  methods: {
    onChange(index) {
      this.currentIndex = index
      const path = this.$route.path
      sessionStorage.setItem('navPath', JSON.stringify(index))
      switch (index) {
        case 0:
          if (path == '/index') return
          this.$router.push('/index')
          break;
        case 1:
          if (path == '/monitoring') return
          this.$router.push('/monitoring')
          break;
        case 2:
          if (path == '/control') return
          this.$router.push('/control')
          break;
        case 3:
          if (path == '/analyse') return
          this.$router.push('/analyse')
          break;
      }
    },
    selected() {
      const navPath = JSON.parse(sessionStorage.getItem('navPath'));
      if (navPath) {
        switch (navPath) {
          case 0:
            this.currentIndex = 0;
            break;
          case 1:
            this.currentIndex = 1;
            break;
          case 2:
            this.currentIndex = 2
            break;
          case 3:
            this.currentIndex = 3
            break;
        }
      }
    }
  },

}
</script>

<style lang="scss" scoped>
nav {
  display: flex;
  position: fixed;
  top: 0;
  width: 100%;
  height: 64px;
  background-color: #090909;

  // user
  .user_container {
    display: flex;
    align-items: center;
    width: 176px;
    height: 64px;
    padding-left: 18px;
    background: #090909;
    span:nth-child(1) {
      margin-right: 16px;
      width: 30px;
      height: 30px;

      img {
        width: 100%;
      }
    }
    span:nth-child(2) {
      box-sizing: border-box;
      padding: 8px 0;
      height: 30px;
      span {
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        color: #cacccc;
      }
    }
  }
  // 导航
  .nav_container {
    display: flex;
    width: 1744px;
    background: #181818;
    opacity: 1;

    // 控制区
    .control_container {
      display: flex;
      width: 1328px;
      height: 64px;

      .control {
        display: flex;
        align-items: center;
        width: 230px;

        div:nth-child(1),
        div:nth-child(2),
        div:nth-child(3) {
          margin-left: 24px;
          cursor: pointer;
        }
        div:nth-child(1),
        div:nth-child(2) {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 20px;
          height: 20px;
          i {
            font-size: 20px;
            color: #fff;
          }
        }

        div:nth-child(3) {
          border: 1px solid transparent;
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          width: 118px;
          height: 30px;

          border-radius: 4px;
          color: #cacccc;
          background: #4a4a4a;
          opacity: 1;
          span {
            font-size: 12px;
            font-weight: 500;
          }
        }
      }

      > div:nth-child(2) {
        width: 1070px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 600;
        color: #ffffff;
      }
    }

    // 菜单导航区
    .memu_container {
      display: flex;
      width: 480px;
      height: 64px;
      ul {
        display: flex;
        margin-right: 8px;
      }
      li {
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;

        width: 64px;
        height: 64px;
        cursor: pointer;
        i {
          font-size: 22px;
          color: #fff;
          &.unique {
            font-size: 19px !important;
          }
        }
      }

      > div {
        width: 160px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        div {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 13px;
          width: 20px;
          height: 20px;
          cursor: pointer;
          i {
            font-size: 22px;
            color: #fff;
          }
        }
      }
    }
  }
  .active {
    background: #4a4a4a !important;
    border-radius: 0 0 13px 13px !important;
  }
  .active_i {
    color: #6fe9ce !important;
  }
}
</style>