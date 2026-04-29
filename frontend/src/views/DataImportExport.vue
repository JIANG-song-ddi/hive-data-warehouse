<!--
 * 数据导入导出页面
 * 功能：提供数据导入、导出和操作日志管理功能
 * 作用：支持Excel数据文件的导入导出，以及操作日志的查看和管理
 -->
<template>
  <div class="data-import-export">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>数据导入导出</span>
        </div>
      </template>
      
      <el-tabs v-model="activeTab">
        <el-tab-pane label="导入数据" name="import">
          <el-form label-width="120px">
            <el-form-item label="清空数据">
              <el-alert
                title="数据清空警告"
                type="warning"
                :closable="false"
                show-icon
              >
                <template #default>
                  <div>
                    <p>1. 清空操作将删除所有现有数据</p>
                    <p>2. 此操作不可恢复，请谨慎执行</p>
                    <p>3. 建议在导入新数据前执行此操作</p>
                  </div>
                </template>
              </el-alert>
              <el-button type="danger" @click="handleClearData" :loading="clearLoading" style="margin-top: 10px;">
                <el-icon><Delete /></el-icon>
                一键清空原始数据
              </el-button>
            </el-form-item>
            <el-form-item label="导入说明">
              <el-alert
                title="导入数据说明"
                type="info"
                :closable="false"
                show-icon
              >
                <template #default>
                  <div>
                    <p>1. 请选择之前导出的Excel文件</p>
                    <p>2. 导入后系统将使用新数据更新所有可视化展示</p>
                    <p>3. 导入过程可能需要几秒钟时间</p>
                  </div>
                </template>
              </el-alert>
            </el-form-item>
            <el-form-item label="选择文件">
              <el-upload
                class="upload-demo"
                action="#"
                :auto-upload="false"
                :on-change="handleFileChange"
                :show-file-list="true"
                accept=".xlsx,.xls"
                :limit="1"
              >
                <el-button type="primary">
                  <el-icon><Upload /></el-icon>
                  选择Excel文件
                </el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    请上传.xlsx或.xls格式的Excel文件
                  </div>
                </template>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleImport" :loading="importLoading" :disabled="!selectedFile">
                <el-icon><Document /></el-icon>
                导入数据集
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="导出数据" name="export">
          <el-form label-width="120px">
            <el-form-item label="导出说明">
              <el-alert
                title="导出数据说明"
                type="info"
                :closable="false"
                show-icon
              >
                <template #default>
                  <div>
                    <p>1. 点击下方按钮将生成数据集的Excel文件</p>
                    <p>2. 生成的文件包含商品、用户和订单三个工作表</p>
                    <p>3. 生成的文件可用于后续的导入操作</p>
                  </div>
                </template>
              </el-alert>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleExport" :loading="exportLoading">
                <el-icon><Download /></el-icon>
                生成并导出数据集
              </el-button>
              <el-button @click="handleExportSmall" :loading="exportLoading">
                <el-icon><Download /></el-icon>
                生成并导出小数据集 (100条)
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <el-tab-pane label="操作日志" name="logs">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>操作日志</span>
                <el-button type="danger" size="small" @click="handleClearLogs" :disabled="operationLogs.length === 0">
                  <el-icon><Delete /></el-icon>
                  清空日志
                </el-button>
              </div>
            </template>
            <el-table 
              :data="operationLogs" 
              style="width: 100%" 
              v-loading="logsLoading"
              :height="400"
              table-layout="fixed"
              border
            >
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
              <el-table-column prop="details" label="详细信息" show-overflow-tooltip />
            </el-table>
            <el-empty v-if="operationLogs.length === 0 && !logsLoading" description="暂无操作记录" style="margin-top: 20px;" />
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    
    <!-- 自定义密码输入对话框 -->
    <el-dialog
      v-model="passwordDialogVisible"
      title="老板管理密码验证"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="password-dialog-content">
        <p class="password-hint-title">请输入老板管理密码以继续清空操作日志</p>
        <el-input
          v-model="inputPassword"
          type="password"
          placeholder="请输入老板管理密码"
          show-password
          @keyup.enter="confirmPassword"
        />
        <p class="password-hint">当前老板管理密码为：{{ getLogClearPassword() }}</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelPassword">取消</el-button>
          <el-button type="primary" @click="confirmPassword">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as XLSX from 'xlsx'
import { exportToExcel, parseExcel, transformImportedData, generateProducts, generateUsers, generateOrders } from '../utils/excelUtils'
import api from '../api'

const activeTab = ref('import')
const exportLoading = ref(false)
const importLoading = ref(false)
const clearLoading = ref(false)
const logsLoading = ref(false)
const selectedFile = ref(null)
const operationLogs = ref([])
const passwordDialogVisible = ref(false)
const inputPassword = ref('')
let passwordResolve = null
let passwordReject = null

// 格式化日期函数
const formatDate = (timestamp) => {
  if (!timestamp) return '-'
  try {
    return new Date(timestamp).toLocaleString('zh-CN')
  } catch (error) {
    return '-'
  }
}

// 处理导出数据
const handleExport = async () => {
  exportLoading.value = true
  try {
    exportToExcel()
    ElMessage.success('数据集导出成功，请在浏览器下载文件夹中查看')
    
    // 记录操作日志
    const log = {
      timestamp: new Date().toISOString(),
      operation: '导出数据',
      status: '成功',
      details: '导出了包含3000条数据的Excel文件'
    }
    operationLogs.value.unshift(log)
    
    // 保存日志到本地存储
    localStorage.setItem('operationLogs', JSON.stringify(operationLogs.value))
  } catch (error) {
    ElMessage.error('导出失败，请重试')
    console.error('Export error:', error)
    
    // 记录操作日志
    const log = {
      timestamp: new Date().toISOString(),
      operation: '导出数据',
      status: '失败',
      details: error.message || '未知错误'
    }
    operationLogs.value.unshift(log)
    
    // 保存日志到本地存储
    localStorage.setItem('operationLogs', JSON.stringify(operationLogs.value))
  } finally {
    exportLoading.value = false
  }
}

// 处理导出小数据集
const handleExportSmall = async () => {
  exportLoading.value = true
  try {
    // 生成小数据集
    const products = generateProducts(100)
    const users = generateUsers(100)
    const orders = generateOrders(users, products, 100)
    
    // 导出文件
    const wb = XLSX.utils.book_new()
    const productWs = XLSX.utils.json_to_sheet(products)
    XLSX.utils.book_append_sheet(wb, productWs, '商品数据')
    
    const userWs = XLSX.utils.json_to_sheet(users)
    XLSX.utils.book_append_sheet(wb, userWs, '用户数据')
    
    const orderWs = XLSX.utils.json_to_sheet(orders)
    XLSX.utils.book_append_sheet(wb, orderWs, '订单数据')
    
    XLSX.writeFile(wb, `电商数据集_小_${new Date().toISOString().split('T')[0]}.xlsx`)
    
    ElMessage.success('小数据集导出成功，请在浏览器下载文件夹中查看')
    
    // 记录操作日志
    const log = {
      timestamp: new Date().toISOString(),
      operation: '导出小数据集',
      status: '成功',
      details: '导出了包含100条数据的Excel文件'
    }
    operationLogs.value.unshift(log)
    
    // 保存日志到本地存储
    localStorage.setItem('operationLogs', JSON.stringify(operationLogs.value))
  } catch (error) {
    ElMessage.error('导出失败，请重试')
    console.error('Export error:', error)
    
    // 记录操作日志
    const log = {
      timestamp: new Date().toISOString(),
      operation: '导出小数据集',
      status: '失败',
      details: error.message || '未知错误'
    }
    operationLogs.value.unshift(log)
    
    // 保存日志到本地存储
    localStorage.setItem('operationLogs', JSON.stringify(operationLogs.value))
  } finally {
    exportLoading.value = false
  }
}

// 处理文件选择
const handleFileChange = (file) => {
  selectedFile.value = file.raw
}

// 处理导入数据
const handleImport = async () => {
  if (!selectedFile.value) {
    ElMessage.warning('请先选择文件')
    return
  }
  
  importLoading.value = true
  try {
    // 解析Excel文件
    const importedData = await parseExcel(selectedFile.value)
    
    // 转换数据格式
    const transformedData = transformImportedData(importedData)
    
    // 检查数据完整性
    if (!transformedData.products.length || !transformedData.users.length || !transformedData.orders.length) {
      ElMessage.error('导入的文件数据不完整，请检查文件格式')
      
      // 记录操作日志
      const log = {
        timestamp: new Date().toISOString(),
        operation: '导入数据',
        status: '失败',
        details: '导入的文件数据不完整'
      }
      operationLogs.value.unshift(log)
      
      // 保存日志到本地存储
      localStorage.setItem('operationLogs', JSON.stringify(operationLogs.value))
      
      return
    }
    
    // 更新全局数据
    window.importedData = transformedData
    
    ElMessage.success('数据集导入成功，可视化展示已更新')
    
    // 记录操作日志
    const log = {
      timestamp: new Date().toISOString(),
      operation: '导入数据',
      status: '成功',
      details: `导入了包含${transformedData.products.length}条商品、${transformedData.users.length}条用户和${transformedData.orders.length}条订单的数据`
    }
    operationLogs.value.unshift(log)
    
    // 保存日志到本地存储
    localStorage.setItem('operationLogs', JSON.stringify(operationLogs.value))
  } catch (error) {
    ElMessage.error('导入失败，请检查文件格式是否正确')
    console.error('Import error:', error)
    
    // 记录操作日志
    const log = {
      timestamp: new Date().toISOString(),
      operation: '导入数据',
      status: '失败',
      details: error.message || '未知错误'
    }
    operationLogs.value.unshift(log)
    
    // 保存日志到本地存储
    localStorage.setItem('operationLogs', JSON.stringify(operationLogs.value))
  } finally {
    importLoading.value = false
  }
}

// 处理清空数据
const handleClearData = async () => {
  try {
    // 显示确认对话框
    await ElMessageBox.confirm(
      '确定要清空所有数据吗？此操作不可恢复！',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }
    )
    
    clearLoading.value = true
    
    // 模拟清空过程
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 清空数据
    window.importedData = {
      products: [],
      users: [],
      orders: []
    }
    
    // 记录操作日志
    const log = {
      timestamp: new Date().toISOString(),
      operation: '清空数据',
      status: '成功',
      details: '清空了所有商品、用户和订单数据'
    }
    operationLogs.value.unshift(log)
    
    // 保存日志到本地存储
    localStorage.setItem('operationLogs', JSON.stringify(operationLogs.value))
    
    ElMessage.success('数据清空成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清空数据失败')
      console.error('Clear data error:', error)
      
      // 记录操作日志
      const log = {
        timestamp: new Date().toISOString(),
        operation: '清空数据',
        status: '失败',
        details: error.message || '未知错误'
      }
      operationLogs.value.unshift(log)
      
      // 保存日志到本地存储
      localStorage.setItem('operationLogs', JSON.stringify(operationLogs.value))
    }
  } finally {
    clearLoading.value = false
  }
}

// 处理清空操作日志
const handleClearLogs = async () => {
  try {
    // 第一次确认
    await ElMessageBox.confirm(
      '确定要清空所有操作日志吗？此操作不可恢复！',
      '警告',
      {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 显示密码输入对话框
    inputPassword.value = ''
    passwordDialogVisible.value = true
    
    // 等待密码输入
    const password = await new Promise((resolve, reject) => {
      passwordResolve = resolve
      passwordReject = reject
    })
    
    // 第二次确认（确保操作）
    await ElMessageBox.confirm(
      '密码验证成功！确认清空所有操作日志吗？',
      '最终确认',
      {
        confirmButtonText: '确定清空',
        cancelButtonText: '取消',
        type: 'danger'
      }
    )
    
    logsLoading.value = true
    
    // 记录清空操作到审计日志
    const clearLog = {
      timestamp: new Date().toISOString(),
      operation: '清空日志',
      status: '成功',
      details: '清空了所有操作日志'
    }
    
    // 先清空日志
    operationLogs.value = []
    
    // 保存空日志到本地存储
    localStorage.setItem('operationLogs', JSON.stringify(operationLogs.value))
    
    // 然后添加清空操作记录
    operationLogs.value.push(clearLog)
    
    // 再次保存
    localStorage.setItem('operationLogs', JSON.stringify(operationLogs.value))
    
    ElMessage.success('操作日志清空成功')
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      if (error !== 'cancel') {
        // 记录失败操作
        const failLog = {
          timestamp: new Date().toISOString(),
          operation: '清空日志',
          status: '失败',
          details: error.message || '未知错误'
        }
        operationLogs.value.unshift(failLog)
        localStorage.setItem('operationLogs', JSON.stringify(operationLogs.value))
        
        ElMessage.error('清空操作日志失败')
        console.error('Clear logs error:', error)
      }
    }
  } finally {
    logsLoading.value = false
    passwordDialogVisible.value = false
  }
}

// 获取清空日志密码（独立的老板管理密码）
const getLogClearPassword = () => {
  return localStorage.getItem('bossLogClearPassword') || 'boss123'
}

// 确认密码
const confirmPassword = () => {
  if (!inputPassword.value) {
    ElMessage.error('密码不能为空')
    return
  }
  
  if (inputPassword.value !== getLogClearPassword()) {
    ElMessage.error('老板管理密码错误，请重新输入')
    return
  }
  
  passwordDialogVisible.value = false
  if (passwordResolve) {
    passwordResolve(inputPassword.value)
  }
}

// 取消密码
const cancelPassword = () => {
  passwordDialogVisible.value = false
  if (passwordReject) {
    passwordReject('cancel')
  }
}

// 加载操作日志
const loadOperationLogs = async () => {
  logsLoading.value = true
  try {
    const savedLogs = localStorage.getItem('operationLogs')
    if (savedLogs) {
      const parsedLogs = JSON.parse(savedLogs)
      // 验证日志数据格式
      if (Array.isArray(parsedLogs)) {
        operationLogs.value = parsedLogs
      } else {
        console.warn('操作日志数据格式不正确，已重置')
        operationLogs.value = []
      }
    }
  } catch (error) {
    console.error('加载操作日志失败:', error)
    ElMessage.warning('加载操作日志失败，已重置')
    operationLogs.value = []
    // 清除损坏的日志数据
    localStorage.removeItem('operationLogs')
  } finally {
    logsLoading.value = false
  }
}

onMounted(() => {
  // 确保全局变量存在
  if (!window.importedData) {
    window.importedData = null
  }
  
  // 加载操作日志
  loadOperationLogs()
})

// 监听标签页切换
watch(activeTab, async (newTab) => {
  if (newTab === 'logs') {
    // 等待DOM更新后重新加载数据，避免ResizeObserver错误
    await nextTick()
    await loadOperationLogs()
  }
})
</script>

<style scoped>
.data-import-export {
  padding: 0;
}

.card-header {
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-upload__tip {
  margin-top: 10px;
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
