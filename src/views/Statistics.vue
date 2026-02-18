<template>
  <div class="statistics">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>数据统计</span>
        </div>
      </template>
      
      <!-- 筛选条件 -->
      <el-form :inline="true" :model="queryForm" class="search-form">
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            @change="handleQuery"
          />
        </el-form-item>
        <el-form-item label="会议室">
          <el-select v-model="queryForm.roomId" clearable placeholder="全部" @change="handleQuery" style="width: 200px;">
            <el-option
              v-for="room in roomList"
              :key="room.id"
              :label="room.name"
              :value="room.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleExportBookings">导出预订记录</el-button>
          <el-button type="warning" @click="handleExportStatistics">导出统计报表</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 预订趋势图表 -->
      <el-card style="margin-bottom: 20px;">
        <template #header>
          <span>预订趋势</span>
        </template>
        <div ref="trendChartRef" style="width: 100%; height: 400px;"></div>
      </el-card>
      
      <!-- 会议室使用率图表 -->
      <el-card>
        <template #header>
          <span>会议室使用率排行</span>
        </template>
        <div ref="usageChartRef" style="width: 100%; height: 400px;"></div>
      </el-card>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { getBookingTrend, getRoomUsage, exportBookings, exportStatistics } from '@/api/admin'
import { getRoomPage } from '@/api/room'
import dayjs from 'dayjs'

const trendChartRef = ref(null)
const usageChartRef = ref(null)
const dateRange = ref([])
const roomList = ref([])

const queryForm = reactive({
  startDate: null,
  endDate: null,
  roomId: null
})

let trendChart = null
let usageChart = null

// 加载会议室列表
const loadRooms = async () => {
  try {
    const res = await getRoomPage({ page: 1, pageSize: 100, status: 1 })
    roomList.value = res.data.records
  } catch (error) {
    console.error(error)
  }
}

// 初始化预订趋势图表
const initTrendChart = (data) => {
  if (trendChart) {
    trendChart.dispose()
  }
  
  trendChart = echarts.init(trendChartRef.value)
  
  const option = {
    title: {
      text: '预订趋势统计',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.date),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: '预订数量'
    },
    series: [
      {
        name: '预订数量',
        type: 'line',
        data: data.map(item => item.count),
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(102, 126, 234, 0.5)' },
            { offset: 1, color: 'rgba(102, 126, 234, 0.1)' }
          ])
        },
        itemStyle: {
          color: '#667eea'
        },
        lineStyle: {
          width: 3
        }
      }
    ]
  }
  
  trendChart.setOption(option)
}

// 初始化会议室使用率图表
const initUsageChart = (data) => {
  if (usageChart) {
    usageChart.dispose()
  }
  
  usageChart = echarts.init(usageChartRef.value)
  
  const option = {
    title: {
      text: '会议室使用率排行',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params) => {
        const item = params[0]
        return `${item.name}<br/>预订次数: ${item.value}<br/>使用率: ${data[item.dataIndex].usageRate}%`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.roomName),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: '预订次数'
    },
    series: [
      {
        name: '预订次数',
        type: 'bar',
        data: data.map(item => item.bookingCount),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#f093fb' },
            { offset: 1, color: '#f5576c' }
          ])
        },
        barWidth: '60%'
      }
    ]
  }
  
  usageChart.setOption(option)
}

// 查询统计数据
const handleQuery = async () => {
  if (dateRange.value && dateRange.value.length === 2) {
    queryForm.startDate = dateRange.value[0]
    queryForm.endDate = dateRange.value[1]
  } else {
    queryForm.startDate = null
    queryForm.endDate = null
  }
  
  try {
    // 获取预订趋势
    const trendRes = await getBookingTrend(queryForm)
    initTrendChart(trendRes.data)
    
    // 获取会议室使用率
    const usageRes = await getRoomUsage(queryForm)
    initUsageChart(usageRes.data)
    
  } catch (error) {
    ElMessage.error('加载统计数据失败')
    console.error(error)
  }
}

// 重置
const handleReset = () => {
  dateRange.value = []
  queryForm.startDate = null
  queryForm.endDate = null
  queryForm.roomId = null
  handleQuery()
}

// 导出预订记录
const handleExportBookings = async () => {
  try {
    const params = new URLSearchParams()
    if (queryForm.startDate) params.append('startDate', queryForm.startDate)
    if (queryForm.endDate) params.append('endDate', queryForm.endDate)
    if (queryForm.roomId) params.append('roomId', queryForm.roomId)
    
    const response = await fetch(`/api/admin/report/export/bookings?${params.toString()}`, {
      method: 'GET',
      headers: {
        'token': localStorage.getItem('admin_token')
      }
    })
    
    if (!response.ok) {
      throw new Error('导出失败')
    }
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `预订记录_${new Date().toLocaleDateString()}.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
    console.error(error)
  }
}

// 导出统计报表
const handleExportStatistics = async () => {
  try {
    const params = new URLSearchParams()
    if (queryForm.startDate) params.append('startDate', queryForm.startDate)
    if (queryForm.endDate) params.append('endDate', queryForm.endDate)
    if (queryForm.roomId) params.append('roomId', queryForm.roomId)
    
    const response = await fetch(`/api/admin/report/export/statistics?${params.toString()}`, {
      method: 'GET',
      headers: {
        'token': localStorage.getItem('admin_token')
      }
    })
    
    if (!response.ok) {
      throw new Error('导出失败')
    }
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `统计报表_${new Date().toLocaleDateString()}.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
    console.error(error)
  }
}

// 监听窗口大小变化
const handleResize = () => {
  trendChart?.resize()
  usageChart?.resize()
}

onMounted(() => {
  // 默认查询最近7天
  const endDate = dayjs().format('YYYY-MM-DD')
  const startDate = dayjs().subtract(6, 'day').format('YYYY-MM-DD')
  dateRange.value = [startDate, endDate]
  queryForm.startDate = startDate
  queryForm.endDate = endDate
  
  loadRooms()
  
  nextTick(() => {
    handleQuery()
    window.addEventListener('resize', handleResize)
  })
})
</script>

<style scoped>
.statistics {
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

