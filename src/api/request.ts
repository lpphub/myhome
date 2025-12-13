import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios"
import { env } from "@/utils/env"

export interface ApiResponse<T = unknown> {
  data?: T
  message: string
  code: number
}

export interface RequestConfig extends AxiosRequestConfig {
  // 是否显示loading
  loading?: boolean
  // 是否显示错误提示
  showError?: boolean
  // 是否需要token
  needToken?: boolean
  // 重试次数
  retryCount?: number
}

const axiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
})

axiosInstance.interceptors.request.use(
  config => {
    const customConfig = config as RequestConfig
    if (customConfig.needToken) {
      const token = "aaa" // 从 store 中获取 token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  error => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (res: AxiosResponse<ApiResponse<unknown>>) => {
    if (!res.data) throw new Error("network request failed")
    const { code, message, data } = res.data
    if (code === 0) {
      return res
    }
    throw new Error(message || "network request failed")
  },
  (error: AxiosError<ApiResponse>) => {
    const { response, message } = error || {}
    const errMsg = response?.data?.message || message || "network request failed"
    // toast error message
    console.error(errMsg)

    if (response?.status === 401) {
      // 401 清除用户信息和 token
    }
    return Promise.reject(error)
  }
)

class APIClient {
  get<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "GET" })
  }
  post<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "POST" })
  }
  put<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "PUT" })
  }
  delete<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "DELETE" })
  }
  request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    return axiosInstance.request<ApiResponse<T>, T>(config).then(res => {
      const { data } = res.data || {}
      return data as T
    })
  }

}

export default new APIClient()
