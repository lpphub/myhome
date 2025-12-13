import { type ApiError, type AppError, ErrorCodes } from "@/types/errors"

/**
 * 将未知错误转换为 AppError
 */
export function handleApiError(error: unknown): AppError {
  if (error instanceof Error) {
    return {
      code: ErrorCodes.API_ERROR,
      message: error.message,
      timestamp: new Date(),
    }
  }

  // 处理 API 响应错误
  if (error && typeof error === "object" && "response" in error) {
    const err = error as { response?: { data?: unknown; status?: number; statusText?: string } }
    if (err.response?.data) {
      const data = err.response.data as { code?: string; message?: string }
      return {
        code: data.code || ErrorCodes.API_ERROR,
        message: data.message || "服务器错误",
        status: err.response.status,
        statusText: err.response.statusText,
        timestamp: new Date(),
      } as ApiError
    }
  }

  return {
    code: ErrorCodes.UNKNOWN_ERROR,
    message: "未知错误",
    timestamp: new Date(),
  }
}

/**
 * 检查是否为网络错误
 */
export function isNetworkError(error: AppError): boolean {
  return error.code === ErrorCodes.NETWORK_ERROR || error.code === ErrorCodes.TIMEOUT_ERROR
}

/**
 * 检查是否为认证错误
 */
export function isAuthError(error: AppError): boolean {
  return [ErrorCodes.UNAUTHORIZED, ErrorCodes.FORBIDDEN, ErrorCodes.TOKEN_EXPIRED].includes(
    error.code as ErrorCodes
  )
}

/**
 * 创建特定类型的错误
 */
export function createError(code: ErrorCodes, message: string, details?: unknown): AppError {
  return {
    code,
    message,
    details,
    timestamp: new Date(),
  }
}
