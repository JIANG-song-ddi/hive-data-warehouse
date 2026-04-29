<!--
 * 主应用组件
 * 功能：提供应用的整体布局，包含侧边栏导航和主内容区域
 * 作用：组织整个前端应用的结构，管理路由视图
 -->
<template>
  <div class="app-container">
    <!-- 未登录状态 -->
    <div v-if="!isAdminLoggedIn" class="login-wrapper">
      <router-view />
    </div>
    
    <!-- 登录状态 -->
    <el-container v-else class="system-container">
      <el-aside width="200px">
        <div class="logo">
          <h3>电商数据仓库</h3>
        </div>
        <el-menu
          :default-active="activeMenu"
          router
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
        >
          <el-menu-item index="/dashboard">
            <el-icon><DataLine /></el-icon>
            <span>数据看板</span>
          </el-menu-item>
          <el-menu-item index="/sales">
            <el-icon><ShoppingCart /></el-icon>
            <span>销售分析</span>
          </el-menu-item>
          <el-menu-item index="/product">
            <el-icon><Box /></el-icon>
            <span>商品分析</span>
          </el-menu-item>
          <el-menu-item index="/user">
            <el-icon><User /></el-icon>
            <span>用户分析</span>
          </el-menu-item>
          <el-menu-item index="/query">
            <el-icon><Search /></el-icon>
            <span>数据查询</span>
          </el-menu-item>
          <el-sub-menu index="/management">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统管理</span>
            </template>
            <el-menu-item index="/product-management">
              <el-icon><Box /></el-icon>
              <span>商品管理</span>
            </el-menu-item>
            <el-menu-item index="/user-management">
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="/order-management">
              <el-icon><Document /></el-icon>
              <span>订单管理</span>
            </el-menu-item>
            <el-menu-item index="/data-import-export">
              <el-icon><Download /></el-icon>
              <span>数据导入导出</span>
            </el-menu-item>
            <el-menu-item index="/admin">
              <el-icon><Key /></el-icon>
              <span>管理员设置</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header-content">
            <span class="header-title">电商数据仓库系统</span>
          </div>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const activeMenu = computed(() => route.path)
const isAdminLoggedIn = ref(false)

// 检查登录状态
const checkLoginStatus = () => {
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true'
  isAdminLoggedIn.value = isLoggedIn
  console.log('登录状态检查:', isLoggedIn)
  // 强制刷新页面以确保状态更新
  if (isLoggedIn) {
    console.log('用户已登录，显示系统界面')
  } else {
    console.log('用户未登录，显示登录页面')
  }
}

// 跳转到登录页面
const goToLogin = () => {
  router.push('/login')
}

// 跳转到管理员页面
const goToAdmin = () => {
  router.push('/admin')
}

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('adminLoggedIn')
  localStorage.removeItem('adminUsername')
  localStorage.removeItem('loginTime')
  isAdminLoggedIn.value = false
  ElMessage.success('退出登录成功')
  router.push('/login')
}

// 监听路由变化，重新检查登录状态
watch(
  () => route.path,
  () => {
    checkLoginStatus()
  }
)

onMounted(() => {
  checkLoginStatus()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 登录页面包装器 */
.login-wrapper {
  min-height: 100vh;
  width: 100%;
  background-color: #f5f7fa;
}

/* 系统容器 */
.system-container {
  height: 100vh;
}

.el-aside {
  background-color: #304156;
  overflow-x: hidden;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 16px;
  background-color: #2b3a4a;
}

.logo h3 {
  margin: 0;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
