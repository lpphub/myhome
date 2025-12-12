/**
 * 环境变量工具
 * 提供类型安全的环境变量访问
 */

/**
 * 获取环境变量值
 */
export const env = {
  /** API 基础地址 */
  get API_BASE_URL(): string {
    return import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"
  },

  /** 应用名称 */
  get APP_NAME(): string {
    return import.meta.env.VITE_APP_NAME || "我的家"
  },

  /** 应用标题 */
  get APP_TITLE(): string {
    return import.meta.env.VITE_APP_TITLE || env.APP_NAME
  },

  /** 应用版本 */
  get APP_VERSION(): string {
    return import.meta.env.VITE_APP_VERSION || "1.0.0"
  },

  /** 是否启用 Mock 数据 */
  get ENABLE_MOCK(): boolean {
    return import.meta.env.VITE_ENABLE_MOCK === "true"
  },

  /** 是否为开发环境 */
  get IS_DEV(): boolean {
    return import.meta.env.DEV
  },

  /** 是否为生产环境 */
  get IS_PROD(): boolean {
    return import.meta.env.PROD
  },

  /** 当前环境模式 */
  get MODE(): string {
    return import.meta.env.MODE
  },
} as const

/**
 * 环境变量类型导出
 */
export type EnvVars = Env.EnvVars

/**
 * 获取所有环境变量（调试用）
 */
export function getEnvInfo() {
  if (!env.IS_DEV) {
    return null
  }

  return {
    API_BASE_URL: env.API_BASE_URL,
    APP_NAME: env.APP_NAME,
    APP_TITLE: env.APP_TITLE,
    APP_VERSION: env.APP_VERSION,
    ENABLE_MOCK: env.ENABLE_MOCK,
    MODE: env.MODE,
  }
}
