import { useAuthStore } from '@/stores'
import type { User } from '@/types/auth'

interface UseAuthHook {
  user: User | null
  isAuthenticated: boolean
  login: (data: { user: User; accessToken: string; refreshToken: string }) => void
  logout: () => void
  refresh: () => Promise<string | null>
  updateUserPartial: (data: Partial<Pick<User, 'name' | 'avatar'>>) => void
}

export function useAuth(): UseAuthHook {
  const user = useAuthStore(s => s.user)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const login = useAuthStore(s => s.login)
  const logout = useAuthStore(s => s.logout)
  const refresh = useAuthStore(s => s.refreshTokens)
  const updateUserPartial = useAuthStore(s => s.updateUserPartial)

  return {
    user,
    isAuthenticated,
    login,
    logout,
    refresh,
    updateUserPartial,
  }
}
