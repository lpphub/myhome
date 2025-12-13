type LogLevel = "debug" | "info" | "warn" | "error"

interface LogEntry {
  level: LogLevel
  message: string
  data?: unknown
  timestamp: Date
}

class Logger {
  private isProduction = import.meta.env.PROD

  private formatMessage(entry: LogEntry): string {
    const { level, message, data, timestamp } = entry
    const time = timestamp.toISOString()
    const dataStr = data ? ` | Data: ${JSON.stringify(data)}` : ""
    return `[${time}] ${level.toUpperCase()}: ${message}${dataStr}`
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    if (this.isProduction && level === "debug") {
      return // 不在生产环境输出 debug 日志
    }

    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date(),
    }

    const formattedMessage = this.formatMessage(entry)

    switch (level) {
      case "debug":
      case "info":
        console.log(formattedMessage)
        break
      case "warn":
        console.warn(formattedMessage)
        break
      case "error":
        console.error(formattedMessage)
        break
    }
  }

  debug(message: string, data?: unknown): void {
    this.log("debug", message, data)
  }

  info(message: string, data?: unknown): void {
    this.log("info", message, data)
  }

  warn(message: string, data?: unknown): void {
    this.log("warn", message, data)
  }

  error(message: string, error?: unknown): void {
    this.log("error", message, error)
  }
}

// 导出单例实例
export const logger = new Logger()

// 开发环境下暴露到全局，方便调试
if (!import.meta.env.PROD && typeof window !== "undefined") {
  ;(window as unknown as Record<string, unknown>).logger = logger
}
