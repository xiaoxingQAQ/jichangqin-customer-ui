<template>
  <div class="footer_container">
    <ul>
      <li v-for="(item, index) in list" :key="index">
        <header>
          <i></i>
          <span>2021-01-22&nbsp;&nbsp;01:20：30</span>
        </header>
        <footer>
          <div>站长缺岗超过3次，存在管理风险，请尽快处理。</div>
        </footer>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [1, 2, 3, 4, 5, 6]
    }
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
}
</script>

<style lang="scss" scoped>
.footer_container {
  overflow: hidden;
}

ul {
  li {
    display: flex;
    flex-direction: column;
    margin-bottom: 14px;
    header {
      margin-bottom: 13px;
      display: flex;
      align-items: center;
      i {
        width: 6px;
        height: 6px;
        background: #6fe9ce;
        border-radius: 50%;
      }
      span {
        margin-left: 16px;
        font-size: 12px;
        font-weight: 500;
        line-height: 20px;
        color: #6fe9ce;
      }
    }
    footer {
      padding-left: 22px;
      div {
        font-size: 12px;
        font-weight: 500;
        line-height: 17px;
        color: #b6f0fc;
        opacity: 0.65;
      }
    }
  }
}
</style>