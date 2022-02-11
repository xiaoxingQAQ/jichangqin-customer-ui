<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpload: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      scroll: null,
      message: '哈哈哈'
    }
  },
  mounted() {

    // 创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      click: true,
      scrollX: true,  // 开启横向滚动
      mouseWheel: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad
    })

    //  this.scroll.on('scroll', pos => {
    //   console.log(pos);
      // let posY = Math.abs(pos.y)
      // let opacity = posY / 180;
      // opacity = opacity > 1 ? 1 : opacity
      // this.styleOption = { opacity: opacity }

      // if (posY >= 50) {
      //   this.isShow = false
      // } else {
      //   this.isShow = true
      // }
    // })

    // 2.监听滚动的位置
    if (this.probeType === 2 || this.probeType === 3) {
      this.scroll.on('scroll', (position) => {
        console.log(position);
        this.$emit('scroll', position)
      })
    }

    // 3.监听scroll滚动到底部
    if (this.pullUpLoad) {
      this.scroll.on('pullingUp', (e) => {
        console.log('e: ', e);
        this.$emit('pullingUp')
      })
    }
  },
  methods: {
    scrollTo(x, y, time = 300) {
      this.scroll && this.scroll.scrollTo(x, y, time)
    },
    refresh() {
      console.log('刷新');
      this.scroll && this.scroll.refresh()
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp()
    },
    getScrollY() {
      return this.scroll ? this.scroll.y : 0
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
