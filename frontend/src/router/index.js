/**
 * Vue Router配置文件
 * 功能：配置应用的路由映射，管理页面导航
 * 作用：实现单页应用的路由跳转，连接不同的视图组件
 */
import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Sales from '../views/Sales.vue'
import Product from '../views/Product.vue'
import User from '../views/User.vue'
import Query from '../views/Query.vue'
import ProductManagement from '../views/ProductManagement.vue'
import UserManagement from '../views/UserManagement.vue'
import OrderManagement from '../views/OrderManagement.vue'
import DataImportExport from '../views/DataImportExport.vue'
import Login from '../views/Login.vue'
import Admin from '../views/Admin.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/sales',
    name: 'Sales',
    component: Sales
  },
  {
    path: '/product',
    name: 'Product',
    component: Product
  },
  {
    path: '/user',
    name: 'User',
    component: User
  },
  {
    path: '/query',
    name: 'Query',
    component: Query
  },
  {
    path: '/product-management',
    name: 'ProductManagement',
    component: ProductManagement
  },
  {
    path: '/user-management',
    name: 'UserManagement',
    component: UserManagement
  },
  {
    path: '/order-management',
    name: 'OrderManagement',
    component: OrderManagement
  },
  {
    path: '/data-import-export',
    name: 'DataImportExport',
    component: DataImportExport
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 登录页面和登录相关页面不需要验证
  const publicPages = ['/login']
  const isPublic = publicPages.includes(to.path)
  
  // 检查登录状态
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true'
  
  // 记录访问尝试
  console.log('访问尝试:', {
    path: to.path,
    isPublic,
    isLoggedIn,
    timestamp: new Date().toISOString()
  })
  
  // 如果不是公共页面且未登录，重定向到登录页面
  if (!isPublic && !isLoggedIn) {
    console.log('权限不足，重定向到登录页面')
    // 保存目标路径，登录后可以重定向回来
    localStorage.setItem('redirectTo', to.path)
    next('/login')
  } else {
    // 登录成功后重定向到之前的目标路径
    if (isLoggedIn && to.path === '/login') {
      const redirectTo = localStorage.getItem('redirectTo') || '/dashboard'
      localStorage.removeItem('redirectTo')
      next(redirectTo)
    } else {
      next()
    }
  }
})

export default router
