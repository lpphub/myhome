// 导出所有类型
export * from "./common"
export * from "./errors"

// API 响应类型
export interface ApiResponse<T = unknown> {
  data?: T
  message?: string
  code?: string
}

// 设备相关类型
export interface Device {
  id: string
  name: string
  type: string
  status: "online" | "offline" | "error"
  room?: string
  lastSeen?: Date
  properties?: Record<string, unknown>
}

// 房间相关类型
export interface Room {
  id: string
  name: string
  description?: string
  devices?: string[]
  createdAt?: Date
}

// 用户相关类型
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "user"
  createdAt: Date
  lastLoginAt?: Date
}
