<template>
  <div id="echarts"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'echarts1',
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
      this.charts = this.$echarts.init(document.getElementById(id))
      const colorList = ['#FF647C', '#FFBE75', '#3EE2A5', '#6C77FD'];
      const data = [
        {
          name: '通知',
          value: 100,
        },
        {
          name: '严重',
          value: 75,
        },
        {
          name: '一般',
          value: 60,
        },
        {
          name: '致命',
          value: 50,
        },
      ];
      const arrName = this.getArrayValue(data, 'name');
      const arrValue = this.getArrayValue(data, 'value');
      const sumValue = eval(arrValue.join('+'));
      const objData = this.array2obj(data, 'name');
      const optionData = this.getData(data,sumValue,colorList);
      const option = {
        legend: {
          show: true,
          icon: 'circle',
          top: '4%',
          left: "55%",
          data: arrName,
          width: 20,
          padding: [0, 12],
          itemGap: 5,
          formatter: function (name) {
            return '{title|' + name + '} {value|' +(objData[name].value/sumValue* 100).toFixed(2) + '}  {title|%}';
          },
          textStyle: {
            rich: {
              title: {
                fontSize: 10,
                lineHeight: 10,
                color: '#fff',
              },
              value: {
                fontSize: 10,
                lineHeight: 10,
                color: '#fff',
              },
            },
          },
        },
        // tooltip: {
        //   position: 'inside',
        //   borderColor: '#fff',
        //   show: true,
        //   trigger: 'item',
        //   formatter: '{a}{b}:{c}({d}%)',
        // },
        tooltip: {
          position: 'inside',
          trigger: 'item',
          axisPointer: {
            type: 'shadow'
          },
      // {a}{b}:{c}({d}%)
      //     formatter: '{a}, {b}，{c}，{d}，{e}，{b0}{b1} ',
        },
        color: ['#FF647C','#3EE2A5','#FFBE75','#3EE2A5','#6C77FD'],
        xAxis: [
          {
            show: false,
          },
        ],
        series: optionData.series,
      };
      this.charts.setOption(option)
    },
    getArrayValue(array, key) {
      let key1 = key || 'value';
      let res = [];
      if (array) {
        array.forEach(function (t) {
          res.push(t[key1]);
        });
      }
      return res;
    },
    array2obj(array, key) {
      const resObj = {};
      for (let i = 0; i < array.length; i++) {
        resObj[array[i][key]] = array[i];
      }
      return resObj;
    },
    getData(data,sumValue,colorList) {
      const res = {
        series: [],
        yAxis: [],
      };
      const start = 90
      const end = 88
      const bili = 18;
      for (let i = 0; i < data.length; i++) {
        res.series.push({
          name: '',
          type: 'pie',
          clockWise: false, //顺时加载
          hoverAnimation: false, //鼠标移入变大
          radius: [start - i * bili + '%', end - i * bili + '%'],
          label: {
            show: false,
          },
          itemStyle: {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            borderWidth: 15,
          },
          data: [
            {
              value: data[i].value,
              name: data[i].name,
              itemStyle: {
                color: colorList[i],
                normal: {
                  borderWidth: 5,
                  borderColor: colorList[i]
                }
              }
            },
            {
              value: sumValue - data[i].value,
              name: '',
              itemStyle: {
                color: 'rgba(0,0,0,0)',
                borderWidth: 0,
              },
              tooltip: {
                show: false,
              },
              hoverAnimation: false,
            },
          ],
        });
        res.series.push({
          name: '',
          type: 'pie',
          silent: true,
          z: 1,
          clockWise: false, //顺时加载
          hoverAnimation: false, //鼠标移入变大
          radius: [start - i * bili + '%', end - i * bili + '%'],
          label: {
            show: false,
          },
          itemStyle: {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            borderWidth: 15,
          },
          data: [
            {
              value: 7.5,
              itemStyle: {
                normal: {
                  borderWidth: 5,
                  borderColor: '#687389'
                }
              }
            },
            {
              value: 2.5,
              name: '',
              itemStyle: {
                color: 'rgba(0,0,0,0)',
                borderWidth: 0,
              },
              tooltip: {
                show: false,
              },
              hoverAnimation: false,
            },
          ],
        });
      }
      return res;
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.drawPie('echarts')
    })
  }
}
</script>

<style lang="scss" scoped>
#echarts {
  width: 293px;
  height: 246px;
}
</style>
