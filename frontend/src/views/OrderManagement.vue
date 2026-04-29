<!--
 * 订单管理页面
 * 功能：提供订单的增删改查管理功能
 * 作用：管理订单信息，包括新增、编辑、删除和查询订单
 -->
<template>
  <div class="order-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增订单
          </el-button>
        </div>
      </template>
      
      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="order_id" label="订单ID" width="140" />
        <el-table-column prop="user_id" label="用户ID" width="100" />
        <el-table-column prop="product_name" label="商品名称" width="180" />
        <el-table-column prop="quantity" label="数量" width="80" />
        <el-table-column prop="unit_price" label="单价" width="100">
          <template #default="{ row }">
            ¥{{ row.unit_price }}
          </template>
        </el-table-column>
        <el-table-column prop="total_amount" label="总金额" width="120">
          <template #default="{ row }">
            ¥{{ row.total_amount }}
          </template>
        </el-table-column>
        <el-table-column prop="pay_type" label="支付方式" width="100" />
        <el-table-column prop="order_date" label="下单时间" width="160" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; justify-content: flex-end"
        @size-change="loadData"
        @current-change="loadData"
      />
    </el-card>
    
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑订单' : '新增订单'"
      width="550px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="用户ID" prop="user_id">
          <el-input v-model="form.user_id" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="商品名称" prop="product_name">
          <el-select v-model="form.product_name" placeholder="请选择商品" style="width: 100%" @change="updatePrice">
            <el-option 
              v-for="product in productList" 
              :key="product.product_id" 
              :label="product.product_name" 
              :value="product.product_name"
              :price="product.price"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input-number v-model="form.quantity" :min="1" style="width: 100%" @change="calculateTotal" />
        </el-form-item>
        <el-form-item label="单价" prop="unit_price">
          <el-input-number v-model="form.unit_price" :min="0" :precision="2" style="width: 100%" disabled />
        </el-form-item>
        <el-form-item label="总金额" prop="total_amount">
          <el-input-number v-model="form.total_amount" :min="0" :precision="2" style="width: 100%" disabled />
        </el-form-item>
        <el-form-item label="支付方式" prop="pay_type">
          <el-select v-model="form.pay_type" placeholder="请选择支付方式" style="width: 100%">
            <el-option label="支付宝" value="支付宝" />
            <el-option label="微信支付" value="微信支付" />
            <el-option label="银行卡" value="银行卡" />
            <el-option label="信用卡" value="信用卡" />
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间" prop="order_date">
          <el-date-picker
            v-model="form.order_date"
            type="datetime"
            placeholder="选择下单时间"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="待支付" value="待支付" />
            <el-option label="已支付" value="已支付" />
            <el-option label="已发货" value="已发货" />
            <el-option label="已完成" value="已完成" />
            <el-option label="已取消" value="已取消" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '../api'

const loading = ref(false)
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const productList = ref([])

const form = ref({
  order_id: '',
  user_id: '',
  product_name: '',
  quantity: 1,
  unit_price: 0,
  total_amount: 0,
  pay_type: '',
  order_date: '',
  status: '待支付'
})

const rules = {
  user_id: [{ required: true, message: '请输入用户ID', trigger: 'blur' }],
  product_name: [{ required: true, message: '请选择商品', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }],
  pay_type: [{ required: true, message: '请选择支付方式', trigger: 'change' }],
  order_date: [{ required: true, message: '请选择下单时间', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const getStatusType = (status) => {
  const types = {
    '待支付': 'warning',
    '已支付': 'primary',
    '已发货': 'info',
    '已完成': 'success',
    '已取消': 'danger'
  }
  return types[status] || 'info'
}

const loadData = async () => {
  loading.value = true
  try {
    const [ordersRes, productsRes] = await Promise.all([
      api.getOrders(currentPage.value, pageSize.value),
      api.getProducts(1, 1000) // 获取足够多的产品数据用于选择
    ])
    if (ordersRes.code === 200) {
      tableData.value = ordersRes.data.list
      total.value = ordersRes.data.total
    }
    if (productsRes.code === 200) {
      productList.value = productsRes.data.list
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const updatePrice = (productName) => {
  const product = productList.value.find(p => p.product_name === productName)
  if (product) {
    form.value.unit_price = product.price
    calculateTotal()
  }
}

const calculateTotal = () => {
  form.value.total_amount = (form.value.quantity * form.value.unit_price).toFixed(2)
}

const handleAdd = () => {
  isEdit.value = false
  const now = new Date()
  form.value = {
    order_id: 'O' + String(Date.now()).slice(-8),
    user_id: '',
    product_name: '',
    quantity: 1,
    unit_price: 0,
    total_amount: 0,
    pay_type: '',
    order_date: now.toISOString().slice(0, 19).replace('T', ' '),
    status: '待支付'
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该订单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await api.deleteOrder(row.order_id)
      ElMessage.success('删除成功')
      loadData()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value) {
          await api.updateOrder(form.value)
          ElMessage.success('更新成功')
        } else {
          await api.addOrder(form.value)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        loadData()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.order-management {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
