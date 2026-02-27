<template>
  <div class="booking-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>预订管理</span>
          <el-button @click="handleQuery" :icon="Refresh" circle title="刷新"></el-button>
        </div>
      </template>
      
      <!-- 搜索表单 -->
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="queryForm.userName" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="会议室">
          <el-input v-model="queryForm.roomName" placeholder="请输入会议室名称" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="请选择状态" clearable>
            <el-option label="待确认" :value="0" />
            <el-option label="已确认" :value="1" />
            <el-option label="已取消" :value="2" />
            <el-option label="已完成" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 表格 -->
      <el-table :data="tableData" border stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="userName" label="用户" />
        <el-table-column prop="roomName" label="会议室" />
        <el-table-column prop="seats" label="座位" show-overflow-tooltip />
        <el-table-column label="开始时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button 
              v-if="row.status === 1"
              type="success" 
              size="small" 
              link
              @click="handleComplete(row)"
            >
              完成
            </el-button>
            <el-button 
              v-if="row.status === 0 || row.status === 1"
              type="danger" 
              size="small" 
              link
              @click="handleCancel(row)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <el-pagination
        v-model:current-page="queryForm.page"
        v-model:page-size="queryForm.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleQuery"
        @current-change="handleQuery"
        style="margin-top: 20px; justify-content: flex-end;"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { getBookingPage, completeBooking, cancelBooking } from '@/api/booking'
import dayjs from 'dayjs'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)

const queryForm = reactive({
  userName: '',
  roomName: '',
  status: null,
  page: 1,
  pageSize: 10
})

const formatTime = (time) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

const getStatusText = (status) => {
  const map = {
    0: '待确认',
    1: '已确认',
    2: '已取消',
    3: '已完成'
  }
  return map[status] || '未知'
}

const getStatusType = (status) => {
  const map = {
    0: 'warning',
    1: 'primary',
    2: 'success',
    3: 'info'
  }
  return map[status] || ''
}

const handleQuery = async () => {
  loading.value = true
  try {
    const res = await getBookingPage(queryForm)
    tableData.value = res.data.records
    total.value = res.data.total
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  queryForm.userName = ''
  queryForm.roomName = ''
  queryForm.status = null
  queryForm.page = 1
  handleQuery()
}

const handleComplete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要完成该预订吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await completeBooking(row.id)
    ElMessage.success('操作成功')
    handleQuery()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

const handleCancel = async (row) => {
  try {
    await ElMessageBox.confirm('确定要取消该预订吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await cancelBooking(row.id)
    ElMessage.success('取消成功')
    handleQuery()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

onMounted(() => {
  handleQuery()
})
</script>

<style scoped>
.booking-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
}

.search-form {
  margin-bottom: 20px;
}
</style>

