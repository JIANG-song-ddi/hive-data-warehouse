<!--
 * 管理员设置页面
 * 功能：提供管理员密码修改、日志权限密码管理和退出登录功能
 * 作用：管理管理员账户安全和系统权限设置
 -->
<template>
  <div class="admin-container">
    <div class="admin-sidebar">
      <div class="sidebar-header">
        <h3>系统管理</h3>
      </div>
      <el-menu
        default-active="password"
        class="admin-menu"
        :router="false"
      >
        <el-menu-item index="password">
          <el-icon><Key /></el-icon>
          <span>修改密码</span>
        </el-menu-item>
        <el-menu-item index="logs">
          <el-icon><Key /></el-icon>
          <span>清空日志权限密码管理</span>
        </el-menu-item>
        <el-menu-item index="logout" @click="handleLogout">
          <el-icon><SwitchButton /></el-icon>
          <span>退出登录</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="admin-content">
      <div class="content-header">
        <h2>管理员控制台</h2>
        <div class="user-info">
          <span>欢迎，{{ currentUser }}</span>
          <el-avatar :size="32" :src="avatarUrl" />
        </div>
      </div>
      
      <el-card v-if="activeMenu === 'password'" class="content-card">
        <template #header>
          <div class="card-header">
            <span>修改密码</span>
          </div>
        </template>
        <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="120px">
          <el-form-item label="原密码" prop="oldPassword">
            <el-input
              v-model="passwordForm.oldPassword"
              type="password"
              placeholder="请输入原密码"
              show-password
            />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="请输入新密码"
              show-password
              @input="checkPasswordStrength"
            />
            <div class="password-strength" v-if="passwordForm.newPassword">
              <div 
                class="strength-bar"
                :class="{ 
                  'weak': passwordStrength === '弱', 
                  'medium': passwordStrength === '中', 
                  'strong': passwordStrength === '强' 
                }"
                :style="{ width: passwordStrengthWidth + '%' }"
              ></div>
              <span class="strength-text">{{ passwordStrength }}</span>
            </div>
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="请确认新密码"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleChangePassword" :loading="passwordLoading">
              保存修改
            </el-button>
            <el-button @click="resetPasswordForm">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
      
      <el-card v-if="activeMenu === 'logs'" class="content-card">
        <template #header>
          <div class="card-header">
            <span>清空日志权限密码管理</span>
            <el-button type="danger" size="small" @click="handleClearLogs" :disabled="!hasLogs">
              <el-icon><Delete /></el-icon>
              清空操作日志
            </el-button>
            <el-button type="warning" size="small" @click="showChangeLogPasswordDialog">
              <el-icon><Key /></el-icon>
              修改清空日志密码
            </el-button>
          </div>
        </template>
        <el-table :data="operationLogs" style="width: 100%" border>
          <el-table-column prop="timestamp" label="操作时间" width="200">
            <template #default="scope">
              {{ formatDate(scope.row.timestamp) }}
            </template>
          </el-table-column>
          <el-table-column prop="operation" label="操作类型" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === '成功' ? 'success' : 'danger'">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="details" label="详细信息" />
        </el-table>
        <el-empty v-if="operationLogs.length === 0" description="暂无操作记录" style="margin-top: 40px;" />
      </el-card>
    </div>
    
    <!-- 清空日志密码验证对话框 -->
    <el-dialog
      v-model="clearLogPasswordDialogVisible"
      title="老板管理密码验证"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="password-dialog-content">
        <p class="password-hint-title">请输入老板管理密码以继续清空操作日志</p>
        <el-input
          v-model="clearLogPassword"
          type="password"
          placeholder="请输入老板管理密码"
          show-password
          @keyup.enter="confirmClearLogPassword"
        />
        <p class="password-hint">当前老板管理密码为：{{ getLogClearPassword() }}</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelClearLogPassword">取消</el-button>
          <el-button type="primary" @click="confirmClearLogPassword">确定</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 修改清空日志密码对话框 -->
    <el-dialog
      v-model="changeLogPasswordDialogVisible"
      title="修改老板管理密码"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="changeLogPasswordForm" :rules="changeLogPasswordRules" ref="changeLogPasswordFormRef" label-width="120px">
        <el-form-item label="当前老板管理密码" prop="currentPassword">
          <el-input
            v-model="changeLogPasswordForm.currentPassword"
            type="password"
            placeholder="请输入当前老板管理密码"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="resetLogClearPassword">
            <el-icon><Refresh /></el-icon>
            重置为默认密码
          </el-button>
          <span class="reset-hint">默认密码：boss123</span>
        </el-form-item>
        <el-form-item label="新老板管理密码" prop="newPassword">
          <el-input
            v-model="changeLogPasswordForm.newPassword"
            type="password"
            placeholder="请输入新老板管理密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认新老板管理密码" prop="confirmPassword">
          <el-input
            v-model="changeLogPasswordForm.confirmPassword"
            type="password"
            placeholder="请确认新老板管理密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelChangeLogPassword">取消</el-button>
          <el-button type="primary" @click="confirmChangeLogPassword">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeMenu = ref('password')
const currentUser = ref('admin')
const avatarUrl = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

// 修改密码相关
const passwordFormRef = ref(null)
const passwordLoading = ref(false)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const passwordStrength = ref('')
const passwordStrengthWidth = ref(0)

// 操作日志相关
const operationLogs = ref([])
const clearLogPasswordDialogVisible = ref(false)
const changeLogPasswordDialogVisible = ref(false)
const clearLogPassword = ref('')
const changeLogPasswordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const changeLogPasswordFormRef = ref(null)

// 密码强度检查
const checkPasswordStrength = (value) => {
  let strength = 0
  if (value.length >= 8) strength++
  if (/[A-Z]/.test(value)) strength++
  if (/[a-z]/.test(value)) strength++
  if (/[0-9]/.test(value)) strength++
  
  switch (strength) {
    case 0:
    case 1:
      passwordStrength.value = '弱'
      passwordStrengthWidth.value = 33
      break
    case 2:
    case 3:
      passwordStrength.value = '中'
      passwordStrengthWidth.value = 66
      break
    case 4:
      passwordStrength.value = '强'
      passwordStrengthWidth.value = 100
      break
  }
}

// 密码规则
const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, message: '新密码长度至少为8位', trigger: 'blur' },
    { 
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, 
      message: '新密码必须包含大小写字母和数字', 
      trigger: 'blur' 
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 修改清空日志密码规则
const changeLogPasswordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, message: '新密码长度至少为8位', trigger: 'blur' },
    { 
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, 
      message: '新密码必须包含大小写字母和数字', 
      trigger: 'blur' 
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== changeLogPasswordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 获取清空日志密码（独立的老板管理密码）
const getLogClearPassword = () => {
  return localStorage.getItem('bossLogClearPassword') || 'boss123'
}

// 保存清空日志密码
const saveLogClearPassword = (password) => {
  localStorage.setItem('bossLogClearPassword', password)
}

// 重置清空日志密码
const resetLogClearPassword = () => {
  localStorage.setItem('bossLogClearPassword', 'boss123')
  ElMessage.success('清空日志密码已重置为默认值：boss123')
  
  // 记录操作日志
  addOperationLog('重置清空日志密码', '成功', '将清空日志密码重置为默认值')
}

// 处理修改密码
const handleChangePassword = async () => {
  if (!passwordFormRef.value) return

  try {
    await passwordFormRef.value.validate()
    passwordLoading.value = true

    // 模拟密码验证
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 验证原密码
    if (passwordForm.oldPassword !== '123') {
      ElMessage.error('原密码错误')
      return
    }

    // 保存新密码（实际应用中应该发送到后端）
    // 这里只是模拟
    ElMessage.success('密码修改成功')
    resetPasswordForm()

    // 记录操作日志
    addOperationLog('修改密码', '成功', '修改了管理员密码')
  } catch (error) {
    console.error('Change password error:', error)
  } finally {
    passwordLoading.value = false
  }
}

// 重置密码表单
const resetPasswordForm = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordStrength.value = ''
  passwordStrengthWidth.value = 0
  if (passwordFormRef.value) {
    passwordFormRef.value.resetFields()
  }
}

// 处理清空操作日志
const handleClearLogs = () => {
  clearLogPasswordDialogVisible.value = true
  clearLogPassword.value = ''
}

// 确认清空日志密码
const confirmClearLogPassword = async () => {
  if (!clearLogPassword.value) {
    ElMessage.error('请输入密码')
    return
  }

  if (clearLogPassword.value !== getLogClearPassword()) {
    ElMessage.error('密码错误，请重新输入')
    return
  }

  try {
    // 确认清空
    await ElMessageBox.confirm(
      '确定要清空所有操作日志吗？此操作不可恢复！',
      '警告',
      {
        confirmButtonText: '确定清空',
        cancelButtonText: '取消',
        type: 'danger'
      }
    )

    // 清空日志
    operationLogs.value = []
    localStorage.removeItem('operationLogs')

    // 记录清空操作
    addOperationLog('清空日志', '成功', '清空了所有操作日志')

    ElMessage.success('操作日志清空成功')
    clearLogPasswordDialogVisible.value = false
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Clear logs error:', error)
    }
  }
}

// 取消清空日志密码
const cancelClearLogPassword = () => {
  clearLogPasswordDialogVisible.value = false
}

// 显示修改清空日志密码对话框
const showChangeLogPasswordDialog = () => {
  changeLogPasswordForm.currentPassword = ''
  changeLogPasswordForm.newPassword = ''
  changeLogPasswordForm.confirmPassword = ''
  if (changeLogPasswordFormRef.value) {
    changeLogPasswordFormRef.value.resetFields()
  }
  changeLogPasswordDialogVisible.value = true
}

// 确认修改清空日志密码
const confirmChangeLogPassword = async () => {
  if (!changeLogPasswordFormRef.value) return

  try {
    await changeLogPasswordFormRef.value.validate()

    // 验证当前密码
    if (changeLogPasswordForm.currentPassword !== getLogClearPassword()) {
      ElMessage.error('当前密码错误')
      return
    }

    // 保存新密码
    saveLogClearPassword(changeLogPasswordForm.newPassword)

    ElMessage.success('清空日志密码修改成功')
    changeLogPasswordDialogVisible.value = false

    // 记录操作日志
    addOperationLog('修改清空日志密码', '成功', '修改了清空日志的密码')
  } catch (error) {
    console.error('Change log password error:', error)
  }
}

// 取消修改清空日志密码
const cancelChangeLogPassword = () => {
  changeLogPasswordDialogVisible.value = false
}

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('adminLoggedIn')
  localStorage.removeItem('adminUsername')
  localStorage.removeItem('loginTime')
  ElMessage.success('退出登录成功')
  router.push('/login')
}

// 加载操作日志
const loadOperationLogs = () => {
  const savedLogs = localStorage.getItem('operationLogs')
  if (savedLogs) {
    try {
      const parsedLogs = JSON.parse(savedLogs)
      if (Array.isArray(parsedLogs)) {
        operationLogs.value = parsedLogs
      }
    } catch (error) {
      console.error('加载操作日志失败:', error)
    }
  }
}

// 添加操作日志
const addOperationLog = (operation, status, details) => {
  const log = {
    timestamp: new Date().toISOString(),
    operation,
    status,
    details
  }
  operationLogs.value.unshift(log)
  localStorage.setItem('operationLogs', JSON.stringify(operationLogs.value))
}

// 格式化日期
const formatDate = (timestamp) => {
  if (!timestamp) return '-'
  try {
    return new Date(timestamp).toLocaleString('zh-CN')
  } catch (error) {
    return '-'
  }
}

// 计算是否有日志
const hasLogs = computed(() => {
  return operationLogs.value.length > 0
})

// 监听菜单变化
const handleMenuChange = (index) => {
  activeMenu.value = index
}

// 检查登录状态
const checkLoginStatus = () => {
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true'
  if (!isLoggedIn) {
    router.push('/login')
  }
}

onMounted(() => {
  checkLoginStatus()
  loadOperationLogs()
})
</script>

<style scoped>
.admin-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.admin-sidebar {
  width: 250px;
  background-color: #ffffff;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.05);
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  z-index: 1000;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e4e7ed;
  text-align: center;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.admin-menu {
  margin-top: 20px;
}

.admin-content {
  flex: 1;
  margin-left: 250px;
  padding: 20px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;
}

.content-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-info span {
  font-size: 14px;
  color: #606266;
}

.content-card {
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease-in-out;
}

.card-header {
  font-size: 16px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.password-strength {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.strength-bar {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background-color: #ebeef5;
  transition: all 0.3s ease;
}

.strength-bar.weak {
  background-color: #f56c6c;
}

.strength-bar.medium {
  background-color: #e6a23c;
}

.strength-bar.strong {
  background-color: #67c23a;
}

.strength-text {
  font-size: 12px;
  color: #909399;
  width: 40px;
  text-align: right;
}

.password-dialog-content {
  text-align: center;
}

.password-hint-title {
  margin-bottom: 20px;
  font-size: 14px;
}

.password-hint {
  margin-top: 12px;
  color: #909399;
  font-size: 12px;
}

.reset-hint {
  margin-left: 10px;
  color: #909399;
  font-size: 12px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .admin-sidebar {
    width: 200px;
  }
  
  .admin-content {
    margin-left: 200px;
    padding: 10px;
  }
  
  .content-header h2 {
    font-size: 20px;
  }
  
  .card-header {
    font-size: 14px;
  }
}
</style>
