<!--
 * 数据看板页面
 * 功能：展示电商数据仓库的核心指标和概览图表
 * 作用：提供销售、订单、用户、商品等关键指标的可视化展示
 -->
<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon sales">
              <el-icon><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ formatNumber(totalSales) }}</div>
              <div class="stat-label">总销售额</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon orders">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ formatNumber(totalOrders) }}</div>
              <div class="stat-label">订单数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon users">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ formatNumber(totalUsers) }}</div>
              <div class="stat-label">用户数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon products">
              <el-icon><Box /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ formatNumber(totalProducts) }}</div>
              <div class="stat-label">商品数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>销售趋势</span>
            </div>
          </template>
          <div ref="salesTrendChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>用户增长趋势</span>
            </div>
          </template>
          <div ref="userTrendChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>分类销售占比</span>
            </div>
          </template>
          <div ref="categoryPieChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>支付方式分布</span>
            </div>
          </template>
          <div ref="paymentPieChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import api from '../api'

const salesTrendChart = ref(null)
const userTrendChart = ref(null)
const categoryPieChart = ref(null)
const paymentPieChart = ref(null)

const totalSales = ref(0)
const totalOrders = ref(0)
const totalUsers = ref(0)
const totalProducts = ref(0)

const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(2) + '万'
  }
  return num.toString()
}

const initSalesTrendChart = (data) => {
  const chart = echarts.init(salesTrendChart.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(item => item.stat_date)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '销售额',
        type: 'line',
        smooth: true,
        data: data.map(item => item.pay_amount)
      }
    ]
  }
  chart.setOption(option)
}

const initUserTrendChart = (data) => {
  const chart = echarts.init(userTrendChart.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(item => item.stat_date)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '新增用户',
        type: 'line',
        smooth: true,
        data: data.map(item => item.new_users)
      }
    ]
  }
  chart.setOption(option)
}

const initCategoryPieChart = (data) => {
  const chart = echarts.init(categoryPieChart.value)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '销售占比',
        type: 'pie',
        radius: '50%',
        data: data.map(item => ({
          name: item.category_name,
          value: item.sales_amount
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  chart.setOption(option)
}

const initPaymentPieChart = (data) => {
  const chart = echarts.init(paymentPieChart.value)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '支付方式',
        type: 'pie',
        radius: ['40%', '70%'],
        data: data.map(item => ({
          name: item.pay_type,
          value: item.order_count
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  chart.setOption(option)
}

const loadData = async () => {
  try {
    const [salesRes, userRes, categoryRes, paymentRes, usersRes, productsRes] = await Promise.all([
      api.getSalesOverview(),
      api.getUserOverview(),
      api.getCategorySales(),
      api.getPaymentStats(),
      api.getUsers(1, 1), // 获取用户总数
      api.getProducts(1, 1) // 获取产品总数
    ])

    if (salesRes.code === 200 && salesRes.data.length > 0) {
      const latest = salesRes.data[salesRes.data.length - 1]
      totalSales.value = latest.pay_amount || 0
      totalOrders.value = latest.order_count || 0
      initSalesTrendChart(salesRes.data)
    }

    if (userRes.code === 200 && userRes.data.length > 0) {
      initUserTrendChart(userRes.data)
    }

    if (usersRes.code === 200) {
      totalUsers.value = usersRes.data.total || 0
    }

    if (productsRes.code === 200) {
      totalProducts.value = productsRes.data.total || 0
    }

    if (categoryRes.code === 200 && categoryRes.data.length > 0) {
      initCategoryPieChart(categoryRes.data)
    }

    if (paymentRes.code === 200 && paymentRes.data.length > 0) {
      initPaymentPieChart(paymentRes.data)
    }
  } catch (error) {
    console.error('Load data error:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.stat-card {
  margin-bottom: 0;
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.stat-icon.sales {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.orders {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.users {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.products {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-icon .el-icon {
  font-size: 30px;
  color: #fff;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.card-header {
  font-size: 16px;
  font-weight: bold;
}

.chart-container {
  height: 300px;
  width: 100%;
}
</style>
