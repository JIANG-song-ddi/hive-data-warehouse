<!--
 * 销售分析页面
 * 功能：展示销售数据的趋势分析图表
 * 作用：提供销售额、订单量等销售指标的可视化分析
 -->
<template>
  <div class="sales">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>销售分析</span>
        </div>
      </template>
      <div class="chart-container" ref="salesChart" v-loading="loading"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import api from '../api'

const salesChart = ref(null)
const loading = ref(true)

const loadData = async () => {
  try {
    const res = await api.getSalesOverview()
    if (res.code === 200 && res.data.length > 0) {
      const chart = echarts.init(salesChart.value)
      const option = {
        title: { text: '销售趋势分析' },
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: res.data.map(item => item.stat_date)
        },
        yAxis: { type: 'value' },
        series: [{
          data: res.data.map(item => item.pay_amount),
          type: 'line',
          smooth: true
        }]
      }
      chart.setOption(option)
    }
  } catch (error) {
    console.error('Load sales data error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.sales {
  padding: 0;
}

.card-header {
  font-size: 16px;
  font-weight: bold;
}

.chart-container {
  height: 500px;
  width: 100%;
}
</style>
