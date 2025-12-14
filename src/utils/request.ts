// utils/request.ts
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios"

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data?: T
}

export enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export class ApiError extends Error {
  constructor(
    public code: number,
    public message: string,
    public response?: unknown
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export interface RequestConfig extends AxiosRequestConfig {
  timeout?: number
  retryCount?: number
  retryDelay?: number
  mock?: boolean
}

class HttpClient {
  private instance: AxiosInstance
  private baseURL: string
  private timeout: number

  constructor(baseURL: string = import.meta.env.VITE_API_BASE_URL, timeout: number = 60000) {
    this.baseURL = baseURL
    this.timeout = timeout
    this.instance = this.createInstance()
  }

  private createInstance(): AxiosInstance {
    const instance = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    })

    this.setupInterceptors(instance)
    return instance
  }

  private setupInterceptors(instance: AxiosInstance): void {
    // 请求拦截器
    instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
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
        this.logError("Request Error:", error)
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    instance.interceptors.response.use(
      (response: AxiosResponse) => {
        this.logResponse(response)
        return response
      },
      error => {
        this.logError("Response Error:", error)
        return this.handleError(error)
      }
    )
  }

  private logRequest(config: InternalAxiosRequestConfig): void {
    if (process.env.NODE_ENV === "development") {
      console.group(`🚀 ${config.method?.toUpperCase()} ${config.url}`)
      console.log("Headers:", config.headers)
      console.log("Params:", config.params)
      console.log("Data:", config.data)
      console.groupEnd()
    }
  }

  private logResponse(response: AxiosResponse): void {
    if (process.env.NODE_ENV === "development") {
      console.group(`✅ ${response.status} ${response.config.url}`)
      console.log("Response:", response.data)
      console.groupEnd()
    }
  }

  private logError(label: string, error: unknown): void {
    if (process.env.NODE_ENV === "development") {
      console.error(label, error)
    }
  }

  private handleError(error: unknown): Promise<never> {
    if (axios.isAxiosError(error)) {
      const { response, message } = error

      if (response) {
        const { status, data } = response

        // 处理业务错误
        if (data?.code && data?.message) {
          throw new ApiError(data.code, data.message, data)
        }

        // 处理HTTP错误
        const errorMessage = this.getHttpErrorMessage(status)
        throw new ApiError(status, errorMessage, data)
      }

      // 处理网络错误
      if (error.code === "ECONNABORTED") {
        throw new ApiError(408, "Request timeout")
      }

      throw new ApiError(0, message || "Network error")
    }

    return Promise.reject(error)
  }

  private getHttpErrorMessage(status: number): string {
    const errorMap: Record<number, string> = {
      400: "Bad Request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Not Found",
      408: "Request Timeout",
      500: "Internal Server Error",
      502: "Bad Gateway",
      503: "Service Unavailable",
      504: "Gateway Timeout",
    }

    return errorMap[status] || "Unknown Error"
  }

  private getToken(): string | null {
    // 从 localStorage 或其他地方获取 token
    return localStorage.getItem("access_token")
  }

  private unwrapResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
    const { data } = response

    if (data.code !== 0 && data.code !== 200) {
      throw new ApiError(data.code, data.message, data)
    }

    return data.data as T
  }

  /**
   * 发起请求
   */
  async request<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    const { retryCount = 0, retryDelay = 1000, ...axiosConfig } = config || {}

    try {
      const response = await this.instance.request<ApiResponse<T>>({ url, ...axiosConfig })
      return this.unwrapResponse(response)
    } catch (error) {
      if (retryCount > 0) {
        await this.delay(retryDelay)
        return this.request<T>(url, {
          ...config,
          retryCount: retryCount - 1,
        })
      }
      throw error
    }
  }

  /**
   * GET 请求
   */
  get<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: RequestMethod.GET })
  }

  /**
   * POST 请求
   */
  post<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: RequestMethod.POST, data })
  }

  /**
   * PUT 请求
   */
  put<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: RequestMethod.PUT, data })
  }

  /**
   * PATCH 请求
   */
  patch<T = unknown, D = unknown>(url: string, data?: D, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: RequestMethod.PATCH, data })
  }

  /**
   * DELETE 请求
   */
  delete<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: RequestMethod.DELETE })
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
    formData.append("file", file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    return this.request<T>(url, {
      method: "POST",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
  }

  /**
   * 下载文件
   */
  async download(url: string, filename?: string): Promise<void> {
    const response = await this.instance.get(url, { responseType: "blob" })
    const blob = new Blob([response.data])
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = filename || "download"
    link.click()
    URL.revokeObjectURL(link.href)
  }

  /**
   * 批量请求
   */
  all<T extends readonly unknown[]>(promises: T): Promise<{ [K in keyof T]: Awaited<T[K]> }> {
    return Promise.all(promises)
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
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
