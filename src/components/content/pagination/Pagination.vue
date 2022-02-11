<template>
  <div class="pagination_con">
    <div class="left">首页</div>
    <el-pagination background layout="prev, pager, next" :total="total">
    </el-pagination>
    <div class="right">末页</div>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 1,
    }
  },
}
</script>

<style lang="scss" scoped>
.pagination_con {
  display: flex;

  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translate(-50%);

  > div {
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
  }

  .left {
    width: 82px;
    height: 30px;
    background: linear-gradient(90deg, #0084b5 0%, #3de8e8 48%, #a8ffc5 100%);
    opacity: 1;
    border-radius: 4px;
  }

  .right {
    width: 82px;
    height: 30px;
    background: linear-gradient(90deg, #0084b5 0%, #3de8e8 48%, #a8ffc5 100%);
    opacity: 1;
    border-radius: 4px;
  }
}
</style>