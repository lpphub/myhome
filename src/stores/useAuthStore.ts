import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { refreshToken as fetchRefreshToken } from '@/api/auth'
import type { User } from '@/types/auth'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean

  login: (data: { user: User; accessToken: string; refreshToken: string }) => void
  logout: () => void
  refreshTokens: () => Promise<string | null>

  updateUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,

        login: ({ user, accessToken, refreshToken }) =>
          set({ user, accessToken, refreshToken, isAuthenticated: true }),
        logout: () =>
          set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
        refreshTokens: async () => {
          const refreshToken = get().refreshToken
          if (!refreshToken) return null

          try {
            const res = await fetchRefreshToken(refreshToken)

            set({
              accessToken: res.accessToken,
              refreshToken: res.refreshToken ?? refreshToken,
              isAuthenticated: true,
            })

            return res.accessToken
          } catch (error) {
            console.error('Failed to refresh token:', error)
            return null
          }
        },
        updateUser: user => set({ user }),
      }),
      {
        name: 'auth-store',
        storage: createJSONStorage(() => localStorage),
        partialize: state => ({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
        }),
        version: 1,
      }
    )
  )
)

export default useAuthStore
