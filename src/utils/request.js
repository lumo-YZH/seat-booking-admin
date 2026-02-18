import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import router from '@/router'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 简单的内存缓存
const cache = new Map()
const CACHE_TIME = 30000 // 30秒缓存

// 请求拦截器
request.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers['token'] = userStore.token
    }
    
    // GET请求检查缓存
    if (config.method === 'get') {
      const cacheKey = config.url + JSON.stringify(config.params || {})
      const cached = cache.get(cacheKey)
      
      if (cached && Date.now() - cached.time < CACHE_TIME) {
        // 返回缓存数据
        config.adapter = () => {
          return Promise.resolve({
            data: cached.data,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
            request: {}
          })
        }
      }
    }
    
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    
    // 缓存GET请求的成功响应
    if (response.config.method === 'get' && res.code === 1) {
      const cacheKey = response.config.url + JSON.stringify(response.config.params || {})
      cache.set(cacheKey, {
        data: res,
        time: Date.now()
      })
      
      // 限制缓存大小，最多50条
      if (cache.size > 50) {
        const firstKey = cache.keys().next().value
        cache.delete(firstKey)
      }
    }
    
    if (res.code === 1) {
      return res
    } else {
      ElMessage.error(res.msg || '请求失败')
      return Promise.reject(new Error(res.msg || '请求失败'))
    }
  },
  error => {
    if (error.response?.status === 401) {
      ElMessage.error('登录已过期，请重新登录')
      const userStore = useUserStore()
      userStore.logout()
      router.push('/login')
    } else {
      ElMessage.error(error.message || '网络错误')
    }
    return Promise.reject(error)
  }
)

// 清除缓存的方法
export const clearCache = () => {
  cache.clear()
}

export default request

