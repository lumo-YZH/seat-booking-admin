<template>
  <div class="seat-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <div>
            <el-button @click="goBack" link>
              <el-icon><ArrowLeft /></el-icon>
              返回
            </el-button>
            <span style="margin-left: 10px;">{{ roomInfo.name }} - 座位管理</span>
          </div>
        </div>
      </template>
      
      <div class="seat-layout" v-loading="loading">
        <div class="layout-info">
          <el-tag>总座位数: {{ seatLayout.rows * seatLayout.cols }}</el-tag>
          <el-tag type="success" style="margin-left: 10px;">
            可用: {{ availableCount }}
          </el-tag>
          <el-tag type="danger" style="margin-left: 10px;">
            不可用: {{ unavailableCount }}
          </el-tag>
        </div>
        
        <div class="seats-grid" v-if="seatLayout.seats && seatLayout.seats.length">
          <div 
            v-for="row in seatLayout.rows" 
            :key="row" 
            class="seat-row"
          >
            <div class="row-label">{{ row }}</div>
            <div 
              v-for="col in seatLayout.cols" 
              :key="col"
              class="seat-item"
              :class="getSeatClass(row, col)"
              @click="handleToggleSeat(row, col)"
            >
              <div class="seat-content">
                <el-icon><Grid /></el-icon>
                <span>{{ row }}-{{ col }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <el-empty v-else description="暂无座位数据" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSeatLayout, updateSeatStatus } from '@/api/seat'
import { getRoomById } from '@/api/room'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const roomInfo = ref({})
const seatLayout = ref({
  meetingRoomId: null,
  meetingRoomName: '',
  rows: 0,
  cols: 0,
  seats: []
})

const availableCount = computed(() => {
  return seatLayout.value.seats.filter(s => s.status === 1).length
})

const unavailableCount = computed(() => {
  return seatLayout.value.seats.filter(s => s.status === 0).length
})

const getSeat = (row, col) => {
  return seatLayout.value.seats.find(s => s.rowNum === row && s.colNum === col)
}

const getSeatClass = (row, col) => {
  const seat = getSeat(row, col)
  return seat?.status === 1 ? 'available' : 'unavailable'
}

const loadRoomInfo = async () => {
  try {
    const res = await getRoomById(route.params.id)
    roomInfo.value = res.data
  } catch (error) {
    console.error(error)
  }
}

const loadSeatLayout = async () => {
  loading.value = true
  try {
    const res = await getSeatLayout(route.params.id)
    seatLayout.value = res.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleToggleSeat = async (row, col) => {
  const seat = getSeat(row, col)
  if (!seat) return
  
  const newStatus = seat.status === 1 ? 0 : 1
  const action = newStatus === 1 ? '启用' : '禁用'
  
  try {
    await ElMessageBox.confirm(`确定要${action}座位 ${row}-${col} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await updateSeatStatus({
      id: seat.id,
      status: newStatus
    })
    ElMessage.success(`${action}成功`)
    loadSeatLayout()
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error)
    }
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadRoomInfo()
  loadSeatLayout()
})
</script>

<style scoped>
.seat-manage {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
}

.layout-info {
  margin-bottom: 20px;
}

.seats-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.seat-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.row-label {
  width: 40px;
  text-align: center;
  font-weight: 600;
  color: #666;
}

.seat-item {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.seat-item.available {
  background: #67c23a;
  color: #fff;
}

.seat-item.available:hover {
  background: #85ce61;
  transform: scale(1.05);
}

.seat-item.unavailable {
  background: #f56c6c;
  color: #fff;
}

.seat-item.unavailable:hover {
  background: #f78989;
  transform: scale(1.05);
}

.seat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.seat-content .el-icon {
  font-size: 24px;
}

.seat-content span {
  font-size: 12px;
}
</style>

