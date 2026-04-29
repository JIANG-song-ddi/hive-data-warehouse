<!--
 * 用户分析页面
 * 功能：展示用户数据的分析和统计
 * 作用：提供用户增长、年龄分布等用户指标的可视化分析
 -->
<template>
  <div class="user">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户分析</span>
        </div>
      </template>
      <div class="chart-container" ref="userChart" v-loading="loading"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import api from '../api'

const userChart = ref(null)
const loading = ref(true)

const loadData = async () => {
  try {
    const res = await api.getUsers(1, 3000) // 获取所有用户数据
    if (res.code === 200 && res.data.list.length > 0) {
      // 计算年龄分布
      const ageGroups = {
        '18-24岁': 0,
        '25-34岁': 0,
        '35-44岁': 0,
        '45-54岁': 0,
        '55岁以上': 0
      }
      
      res.data.list.forEach(user => {
        if (user.age >= 18 && user.age <= 24) {
          ageGroups['18-24岁']++
        } else if (user.age >= 25 && user.age <= 34) {
          ageGroups['25-34岁']++
        } else if (user.age >= 35 && user.age <= 44) {
          ageGroups['35-44岁']++
        } else if (user.age >= 45 && user.age <= 54) {
          ageGroups['45-54岁']++
        } else if (user.age >= 55) {
          ageGroups['55岁以上']++
        }
      })
      
      const chart = echarts.init(userChart.value)
      const option = {
        title: { text: '用户年龄分布' },
        tooltip: { trigger: 'item' },
        series: [{
          name: '用户分布',
          type: 'pie',
          radius: '50%',
          data: Object.entries(ageGroups).map(([name, value]) => ({ name, value }))
        }]
      }
      chart.setOption(option)
    }
  } catch (error) {
    console.error('Load user data error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.user {
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
