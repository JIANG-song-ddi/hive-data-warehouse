<!--
 * 登录页面
 * 功能：提供管理员登录界面和身份验证
 * 作用：验证管理员身份，确保只有授权用户才能访问系统
 -->
<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>电商数据仓库系统</h2>
        <p>管理员登录</p>
      </div>
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-position="top">
        <el-form-item label="管理员ID" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="管理员ID"
            prefix-icon="User"
            :disabled="loading"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            :disabled="loading"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            @click="handleLogin"
            :loading="loading"
            :disabled="loading"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <div class="login-footer">
        <p>初始登录凭证：用户名 admin，密码 123</p>
        <div class="login-links">
          <a href="#" @click.prevent="handleForgotPassword" class="forgot-password">忘记密码？</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElForm, ElFormItem, ElInput, ElButton, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)
const errorMessage = ref('')
const loginAttempts = ref(0)
const maxAttempts = 5
const lockoutTime = 300000 // 5分钟
const lastAttemptTime = ref(0)

const loginForm = reactive({
  username: '',
  password: ''
})

const loginRules = {
  username: [
    { required: true, message: '请输入管理员ID', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  // 检查是否被锁定
  if (loginAttempts.value >= maxAttempts) {
    const currentTime = Date.now()
    if (currentTime - lastAttemptTime.value < lockoutTime) {
      const remainingTime = Math.ceil((lockoutTime - (currentTime - lastAttemptTime.value)) / 1000 / 60)
      errorMessage.value = `登录失败次数过多，请 ${remainingTime} 分钟后再试`
      return
    } else {
      // 解锁
      loginAttempts.value = 0
      lastAttemptTime.value = 0
    }
  }

  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    loading.value = true
    errorMessage.value = ''

    // 模拟登录验证
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 验证凭证
    if (loginForm.username === 'admin' && loginForm.password === '123') {
      // 登录成功
      loginAttempts.value = 0
      lastAttemptTime.value = 0
      
      // 存储登录状态
      localStorage.setItem('adminLoggedIn', 'true')
      localStorage.setItem('adminUsername', loginForm.username)
      localStorage.setItem('loginTime', Date.now().toString())
      
      ElMessage.success('登录成功')
      // 重定向到之前的目标路径
      const redirectTo = localStorage.getItem('redirectTo') || '/dashboard'
      localStorage.removeItem('redirectTo')
      router.push(redirectTo)
    } else {
      // 登录失败
      loginAttempts.value++
      lastAttemptTime.value = Date.now()
      errorMessage.value = `登录失败，剩余尝试次数：${maxAttempts - loginAttempts.value}`
      // 记录登录失败尝试
      console.log('登录失败尝试:', {
        username: loginForm.username,
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}

// 处理忘记密码
const handleForgotPassword = () => {
  ElMessageBox.alert(
    '请联系系统管理员重置密码。\n\n默认管理员账号：admin\n默认密码：123',
    '忘记密码',
    {
      confirmButtonText: '确定',
      type: 'info'
    }
  )
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-box {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  animation: fadeIn 0.5s ease-in-out;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #333;
  margin-bottom: 10px;
  font-size: 24px;
  font-weight: 600;
}

.login-header p {
  color: #666;
  font-size: 16px;
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
}

.error-message {
  color: #f56c6c;
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}

.login-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 12px;
  color: #909399;
}

.login-links {
  margin-top: 10px;
}

.forgot-password {
  color: #409EFF;
  text-decoration: none;
  transition: color 0.3s;
}

.forgot-password:hover {
  color: #66b1ff;
  text-decoration: underline;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .login-box {
    padding: 30px 20px;
  }
  
  .login-header h2 {
    font-size: 20px;
  }
  
  .login-btn {
    height: 44px;
    font-size: 14px;
  }
}
</style>
