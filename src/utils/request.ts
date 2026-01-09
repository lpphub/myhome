// utils/request.ts
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { useAuthStore } from '@/stores'
import { env } from './env'

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data?: T
}

export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export class ApiError extends Error {
  constructor(
    public code: number,
    public message: string,
    public response?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * 统一请求参数类型
 */
export interface RequestOptions<_T, _D = unknown> extends AxiosRequestConfig {
  retryCount?: number
  retryDelay?: number
}

/**
 * 重放请求配置
 */
export interface RetriableConfig extends AxiosRequestConfig {
  _retry?: boolean
}

interface QueuedRequest {
  config: RetriableConfig
  resolve: (response: AxiosResponse) => void
  reject: (error: unknown) => void
}

class HttpClient {
  private instance: AxiosInstance
  private baseURL: string
  private timeout: number

  // 刷新协调锁机制
  private isRefreshing = false
  private refreshQueue: QueuedRequest[] = []

  constructor(baseURL: string = env.API_BASE_URL, timeout: number = 60000) {
    this.baseURL = baseURL
    this.timeout = timeout
    this.instance = this.createInstance()
  }

  private createInstance(): AxiosInstance {
    const instance = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors(instance)
    return instance
  }

  private setupInterceptors(instance: AxiosInstance): void {
    // 请求拦截器
    instance.interceptors.request.use(
      config => {
        // 添加认证token
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // 请求日志
        this.logRequest(config)
        return config
      },
      error => {
        this.logError('Request Error:', error)
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    instance.interceptors.response.use(
      response => {
        this.logResponse(response)
        return response
      },
      error => {
        this.logError('Response Error:', error)
        return this.handleError(error)
      }
    )
  }

  private logRequest(config: InternalAxiosRequestConfig): void {
    if (env.IS_DEV) {
      console.group(`🚀 ${config.method?.toUpperCase()} ${config.url}`)
      console.log('Headers:', config.headers)
      console.log('Params:', config.params)
      console.log('Data:', config.data)
      console.groupEnd()
    }
  }

  private logResponse(response: AxiosResponse): void {
    if (env.IS_DEV) {
      console.group(`✅ ${response.status} ${response.config.url}`)
      console.log('Response:', response.data)
      console.groupEnd()
    }
  }

  private logError(label: string, error: unknown): void {
    if (!env.IS_DEV) return

    console.group(`❌ ${label}`)
    // 基本信息
    if (error instanceof Error) {
      console.log('Message:', error.message)
    }
    // Axios 错误信息
    if (axios.isAxiosError(error)) {
      if (error.config) {
        console.log('Request:', `${error.config.method?.toUpperCase()} ${error.config.url}`)
      }

      if (error.response) {
        console.log('Response:', `${error.response.status} ${error.response.statusText}`)
        console.log('Data:', error.response.data)
      } else {
        console.log('Network error - no response')
      }
    }
    console.groupEnd()
  }

  private async handleError(error: unknown): Promise<AxiosResponse> {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error)
    }

    const { response, config } = error

    // 不是 401 或没有 config，直接抛
    if (response?.status !== 401 || !config) {
      return Promise.reject(error)
    }

    return this.refreshTokenAndRetry(config)
  }

  /**
   * 刷新token并重试
   */
  private async refreshTokenAndRetry(originalConfig: RetriableConfig): Promise<AxiosResponse> {
    // 防止死循环
    if (originalConfig._retry) {
      throw new Error('Token refresh loop detected')
    }

    // 如果正在刷新，将请求加入队列
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.refreshQueue.push({
          config: originalConfig,
          resolve,
          reject,
        })
      })
    }

    this.isRefreshing = true

    try {
      const newToken = await useAuthStore.getState().refreshAccessToken()
      if (!newToken) {
        throw new Error('Token refresh failed')
      }

      // 处理队列中的请求
      this.processRefreshQueue(newToken)

      // 重试原始请求
      originalConfig._retry = true
      originalConfig.headers = {
        ...(originalConfig.headers ?? {}),
        Authorization: `Bearer ${newToken}`,
      }

      return this.instance.request(originalConfig)
    } catch (e) {
      // 刷新失败，拒绝所有队列中的请求
      this.rejectRefreshQueue(e)
      useAuthStore.getState().logout()
      throw e
    } finally {
      this.isRefreshing = false
    }
  }

  /**
   * 处理刷新队列中的请求
   */
  private processRefreshQueue(newToken: string): void {
    const queue = [...this.refreshQueue] // 复制队列
    this.refreshQueue = [] // 清空原队列

    queue.forEach(({ config, resolve, reject }) => {
      config.headers = {
        ...(config.headers ?? {}),
        Authorization: `Bearer ${newToken}`,
      }

      // 异步执行请求，不阻塞队列处理
      this.instance.request(config).then(resolve).catch(reject)
    })
  }

  /**
   * 拒绝刷新队列中的所有请求
   */
  private rejectRefreshQueue(error: unknown): void {
    const queue = [...this.refreshQueue] // 复制队列
    this.refreshQueue = [] // 清空原队列

    queue.forEach(({ reject }) => {
      reject(error)
    })
  }

  private unwrapResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
    const { data } = response

    if (data.code === 0 || data.code === 200) {
      return data.data as T
    }

    // 业务处理 可跳登录，弹窗提示等
    throw new ApiError(data.code, data.message, data)
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private getToken(): string | null {
    return useAuthStore.getState().accessToken
  }

  /**
   * 发起请求
   */
  async request<T = unknown, D = unknown>(options: RequestOptions<T, D>): Promise<T> {
    const { retryCount = 0, retryDelay = 1000, ...axiosOptions } = options
    try {
      const response = await this.instance.request<ApiResponse<T>>(axiosOptions)
      return this.unwrapResponse(response)
    } catch (error) {
      if (retryCount > 0) {
        await this.delay(retryDelay)
        return this.request<T, D>({ ...options, retryCount: retryCount - 1 })
      }
      throw error
    }
  }

  /**
   * GET 请求
   */
  get<T = unknown>(options: Omit<RequestOptions<T, void>, 'method'>): Promise<T> {
    return this.request<T>({ ...options, method: RequestMethod.GET })
  }

  /**
   * POST 请求
   */
  post<T = unknown, D = unknown>(options: Omit<RequestOptions<T, D>, 'method'>): Promise<T> {
    return this.request<T, D>({ ...options, method: RequestMethod.POST })
  }

  /**
   * PUT 请求
   */
  put<T = unknown, D = unknown>(options: Omit<RequestOptions<T, D>, 'method'>): Promise<T> {
    return this.request<T, D>({ ...options, method: RequestMethod.PUT })
  }

  /**
   * PATCH 请求
   */
  patch<T = unknown, D = unknown>(options: Omit<RequestOptions<T, D>, 'method'>): Promise<T> {
    return this.request<T, D>({ ...options, method: RequestMethod.PATCH })
  }

  /**
   * DELETE 请求
   */
  delete<T = unknown>(options: Omit<RequestOptions<T, void>, 'method'>): Promise<T> {
    return this.request<T>({ ...options, method: RequestMethod.DELETE })
  }

  /**
   * 上传文件
   */
  upload<T = unknown>(
    url: string,
    file: File,
    additionalData?: Record<string, FormDataEntryValue>
  ): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    return this.request<T>({
      url,
      method: RequestMethod.POST,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  /**
   * 下载文件
   */
  async download(url: string, filename?: string): Promise<void> {
    const response = await this.instance.get(url, { responseType: 'blob' })
    const blob = new Blob([response.data])
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename || 'download'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  /**
   * 批量请求
   */
  all<T extends readonly unknown[]>(promises: T): Promise<{ [K in keyof T]: Awaited<T[K]> }> {
    return Promise.all(promises)
  }

  /**
   * 获取原生 axios 实例
   */
  getInstance(): AxiosInstance {
    return this.instance
  }
}

// 导出单例
export const httpClient = new HttpClient()
export default httpClient
