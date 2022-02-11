<template>
  <div id="echarts1" style="width: 100%;height: calc(100% - 32px);"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'echarts',
  data() {
    return {
      charts: '',
      opinion: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
      opinionData: [
        {value: 335, name: '直接访问'},
        {value: 310, name: '邮件营销'},
        {value: 234, name: '联盟广告'},
        {value: 135, name: '视频广告'},
        {value: 1548, name: '搜索引擎'}
      ]
    }
  },
  methods: {
    drawPie(id) {
      var colorList = ['#00DE50', '#00BEF8', '#D69456', '#FF6F36', '#0086D8', '#C68BFD'];
      this.charts = this.$echarts.init(document.getElementById(id))
      this.charts.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '15%',
          right: '3%',
          left: '12%',
          bottom: '12%'
        },
        xAxis: [{
          type: 'category',
          data: ['加油站1', '加油站2', '加油站3', '加油站4', '加油站5', '加油站6'],
          axisLine: {
            lineStyle: {
              color: '#4B918A'
            }
          },
          axisLabel: {
            rotate: -30,
            margin: 5,
            color: '#e2e9ff',
            textStyle: {
              fontSize: 8
            },
          },
          axisTick: {
            show: false
          }
        }],
        yAxis: [{
          axisLabel: {
            formatter: '{value}',
            color: '#e2e9ff',
            textStyle: {
              fontSize: 8
            },
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: 'none'
            }
          }
        }],
        series: [{
          type: 'bar',
          data: [580, 250, 500, 600, 300, 280],
          barWidth: '16px',
          itemStyle: {
            normal: {
              barBorderRadius: 0,
              color: (params) => {
                return colorList[params.dataIndex]
              }
            }
          },
          label: {
            normal: {
              show: true,
              lineHeight: 4,
              formatter: '{c}',
              position: 'top',
              textStyle: {
                color: '#00D6F9',
                fontSize: 8
              }
            }
          }
        }]
      })
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.drawPie('echarts1')
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
