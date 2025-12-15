import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { refreshToken as apiRefreshToken } from "@/api/auth"

export interface UserInfo {
  id: number
  username: string
  avatar?: string
  role?: string
}

interface UserState {
  accessToken: string | null
  refreshToken: string | null
  userInfo: UserInfo | null

  setTokens: (tokens: Partial<{ accessToken: string | null; refreshToken: string | null }>) => void
  clearTokens: () => void

  setUserInfo: (info: UserInfo | null) => void
  clearUserInfo: () => void

  isAuthed: () => boolean
  doRefreshToken: () => Promise<string | null>
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      userInfo: null,

      isAuthed: () => !!get().accessToken,

      setTokens: tokens =>
        set(state => ({
          accessToken: tokens.accessToken ?? state.accessToken,
          refreshToken: tokens.refreshToken ?? state.refreshToken,
        })),

      clearTokens: () => set({ accessToken: null, refreshToken: null }),

      setUserInfo: userInfo => set({ userInfo }),
      clearUserInfo: () => set({ userInfo: null }),

      doRefreshToken: async () => {
        const rt = get().refreshToken
        if (!rt) {
          console.warn("No refresh token available")
          return null
        }

        try {
          const data = await apiRefreshToken(rt)
          set({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken ?? rt,
          })
          return data.accessToken
        } catch (error) {
          console.error("Failed to refresh token:", error)
          // token 刷新失败，可以选择清空 token
          set({ accessToken: null, refreshToken: null })
          return null
        }
      },
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        userInfo: state.userInfo,
      }),
      version: 1,
    }
  )
)

export default useUserStore
