/**
 * SSR-safe localStorage wrapper
 * Prevents "localStorage is not defined" errors during server-side rendering
 */

const storage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem(name)
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(name, value)
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(name)
  },
  clear: (): void => {
    if (typeof window === 'undefined') return
    window.localStorage.clear()
  },
}

export { storage }
