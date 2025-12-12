import type { ReactNode } from 'react'

// 通用 Props 类型
export interface BaseProps {
  className?: string
  children?: ReactNode
}

// 异步状态类型
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T = unknown> {
  data?: T
  status: AsyncStatus
  error?: Error
}

// 分页相关类型
export interface PaginationParams {
  page: number
  pageSize: number
  total?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

// 选择器选项类型
export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

// 菜单项类型
export interface MenuItem {
  key: string
  label: string
  icon?: ReactNode
  path?: string
  children?: MenuItem[]
}

// 主题类型
export type Theme = 'light' | 'dark' | 'auto'

// 语言类型
export type Locale = 'zh-CN' | 'en-US' | 'ja-JP'

// 设备状态类型
export type DeviceStatus = 'online' | 'offline' | 'error'

// 设备类型
export type DeviceType = 'light' | 'switch' | 'sensor' | 'camera' | 'thermostat' | 'lock'