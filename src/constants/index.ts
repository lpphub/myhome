// 导出所有常量
export * from "./animations"

// API 相关常量
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },
  DEVICES: {
    LIST: "/devices",
    CONTROL: "/devices/:id/control",
  },
  ROOMS: {
    LIST: "/rooms",
    CREATE: "/rooms",
  },
} as const

// 本地存储键
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_INFO: "user_info",
  IS_AUTHENTICATED: "isAuthenticated",
} as const

// 路由路径
export const ROUTES = {
  HOME: "/",
  SIGNIN: "/signin",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  DEVICES: "/devices",
  ROOMS: "/rooms",
  SETTINGS: "/settings",
  PROFILE: "/profile",
} as const

// 通用延迟时间
export const DELAYS = {
  API_CALL: 1500,
  ANIMATION: 300,
  TOAST: 3000,
} as const
