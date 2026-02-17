<template>
  <div class="profile">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>个人中心</span>
        </div>
      </template>
      
      <div class="profile-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户名">
            {{ userStore.userInfo.username }}
          </el-descriptions-item>
          <el-descriptions-item label="姓名">
            {{ userStore.userInfo.name }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<style scoped>
.profile {
  padding: 20px;
}

.card-header {
  font-size: 18px;
  font-weight: 600;
}

.profile-content {
  padding: 20px;
}
</style>

