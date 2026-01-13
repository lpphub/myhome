import { useAuthStore } from '@/stores'

export function useAuth() {
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
