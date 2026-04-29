<!--
 * SQL查询页面
 * 功能：提供SQL查询界面，执行Hive SQL查询
 * 作用：支持用户执行自定义SQL查询并展示查询结果
 -->
<template>
  <div class="query">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>SQL查询</span>
        </div>
      </template>
      <el-input
        v-model="sql"
        type="textarea"
        :rows="6"
        placeholder="请输入SQL查询语句"
      ></el-input>
      <el-button type="primary" style="margin-top: 15px;" @click="executeQuery">执行查询</el-button>
      
      <el-table :data="tableData" style="margin-top: 20px;" border>
        <el-table-column
          v-for="(column, index) in columns"
          :key="index"
          :prop="column"
          :label="column"
        ></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import api from '../api'

const sql = ref('')
const tableData = ref([])
const columns = ref([])

const executeQuery = async () => {
  if (!sql.value.trim()) {
    ElMessage.warning('请输入SQL语句')
    return
  }

  try {
    const res = await api.executeQuery(sql.value)
    if (res.code === 200 && res.data.length > 0) {
      columns.value = Object.keys(res.data[0])
      tableData.value = res.data
      ElMessage.success('查询成功')
    } else {
      ElMessage.info('查询结果为空')
    }
  } catch (error) {
    ElMessage.error('查询失败: ' + error.message)
  }
}
</script>

<style scoped>
.query {
  padding: 0;
}

.card-header {
  font-size: 16px;
  font-weight: bold;
}
</style>
