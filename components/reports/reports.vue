<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
import echarts from 'echarts';
import { getechartsdata } from '@/api/api'
export default {
  data() {
    return {
     options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  mounted() {


    this.getecharts()

    // 使用刚指定的配置项和数据显示图表。



  },
  methods: {
    async  getecharts() {
      var myChart = echarts.init(document.getElementById('main'));
      // 指定图表的配置项和数据
      let res = await getechartsdata()
      this.option = res.data
      let newoption = _.merge(res.data, this.options)
      myChart.setOption(newoption);
    }
  }
}
</script>