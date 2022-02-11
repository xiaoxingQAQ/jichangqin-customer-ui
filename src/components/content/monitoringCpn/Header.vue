<template>
  <div>
    <div class="title" :class="{ unique: unique }">
      <slot name="title"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    types: {
      type: String,
      default: '1' // 矩形 
    }
  },
  data() {
    return {

    }
  },
  computed: {
    unique() {
      return this.types == '1' ? false : true
    }
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 293px;
  height: 39px;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  color: #000000;
  background: #6fe9ce;
}
.unique {
  width: 293px;
  height: 47px;
  border-radius: 18px 18px 0px 0px;
}
</style>