// 通用响应类型
export interface ApiResponse<T = unknown> {
  data: T
  msg?: string
  code?: number
}
