<!--
 * 商品分析页面
 * 功能：展示商品销售排行和分类分析
 * 作用：提供商品销售数据的可视化展示和分析
 -->
<template>
  <div class="product">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>商品分析</span>
        </div>
      </template>
      <div class="chart-container" ref="productChart" v-loading="loading"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import api from '../api'

const productChart = ref(null)
const loading = ref(true)

const loadData = async () => {
  try {
    const res = await api.getProductSales(new Date().toISOString().split('T')[0], 10)
    if (res.code === 200 && res.data.length > 0) {
      // 按销售数量从高到低排序
      const sortedData = [...res.data].sort((a, b) => b.sales_quantity - a.sales_quantity)
      
      const chart = echarts.init(productChart.value)
      const option = {
        title: { text: '商品销售排行' },
        tooltip: { trigger: 'axis' },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: sortedData.map(item => item.product_name),
          axisLabel: {
            rotate: 60,
            interval: 0,
            fontSize: 10,
            overflow: 'truncate',
            ellipsis: '...'
          }
        },
        yAxis: { type: 'value' },
        series: [{
          data: sortedData.map(item => item.sales_quantity),
          type: 'bar',
          label: {
            show: true,
            position: 'top',
            formatter: '{c}',
            fontSize: 10
          }
        }]
      }
      chart.setOption(option)
    }
  } catch (error) {
    console.error('Load product data error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.product {
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
