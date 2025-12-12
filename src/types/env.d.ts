/// <reference types="vite/client" />

declare namespace Env {
  /** The router history mode */
  type RouterHistoryMode = "hash" | "history"

  /** Environment variables interface */
  interface EnvVars {
    /** The name of the application */
    readonly VITE_APP_NAME: string
    /** The title of the application */
    readonly VITE_APP_TITLE: string
    /** Backend API base url */
    readonly VITE_API_BASE_URL: string
    /** The version of the application */
    readonly VITE_APP_VERSION: string
    /** Enable mock data */
    readonly VITE_ENABLE_MOCK: string
  }

  /** Interface for import.meta */
  interface ImportMeta extends EnvVars {}
}
