<!--
 * 商品管理页面
 * 功能：提供商品的增删改查管理功能
 * 作用：管理商品信息，包括新增、编辑、删除和查询商品
 -->
<template>
  <div class="product-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>商品管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增商品
          </el-button>
        </div>
      </template>
      
      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="product_id" label="商品ID" width="120" />
        <el-table-column prop="product_name" label="商品名称" width="200" />
        <el-table-column prop="category_level1_name" label="分类" width="120" />
        <el-table-column prop="brand_name" label="品牌" width="120" />
        <el-table-column prop="price" label="价格" width="120">
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '上架' ? 'success' : 'info'">
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
      :title="isEdit ? '编辑商品' : '新增商品'"
      width="500px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="商品名称" prop="product_name">
          <el-input v-model="form.product_name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="分类" prop="category_level1_name">
          <el-select v-model="form.category_level1_name" placeholder="请选择分类" style="width: 100%">
            <el-option label="电子产品" value="电子产品" />
            <el-option label="服装" value="服装" />
            <el-option label="食品" value="食品" />
            <el-option label="家居" value="家居" />
            <el-option label="运动" value="运动" />
            <el-option label="图书" value="图书" />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" prop="brand_name">
          <el-input v-model="form.brand_name" placeholder="请输入品牌" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="form.stock" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="上架" value="上架" />
            <el-option label="下架" value="下架" />
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
import { ref, onMounted } from 'vue'
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

const form = ref({
  product_id: '',
  product_name: '',
  category_level1_name: '',
  brand_name: '',
  price: 0,
  stock: 0,
  status: '上架'
})

const rules = {
  product_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  category_level1_name: [{ required: true, message: '请选择分类', trigger: 'change' }],
  brand_name: [{ required: true, message: '请输入品牌', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await api.getProducts(currentPage.value, pageSize.value)
    if (res.code === 200) {
      tableData.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  isEdit.value = false
  form.value = {
    product_id: 'P' + String(Date.now()).slice(-6),
    product_name: '',
    category_level1_name: '',
    brand_name: '',
    price: 0,
    stock: 0,
    status: '上架'
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  form.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await api.deleteProduct(row.product_id)
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
          await api.updateProduct(form.value)
          ElMessage.success('更新成功')
        } else {
          await api.addProduct(form.value)
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
.product-management {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
