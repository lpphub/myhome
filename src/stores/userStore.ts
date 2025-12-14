import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { refreshToken } from "@/api/auth"

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

  setTokens: (tokens: { accessToken?: string | null; refreshToken?: string | null }) => void
  clearTokens: () => void

  setUserInfo: (info: UserInfo | null) => void
  clearUserInfo: () => void

  isAuthed: () => boolean
  doRefreshToken: () => Promise<string>
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      userInfo: null,

      isAuthed: () => !!get().accessToken,

      setTokens: data => set({ accessToken: data.accessToken, refreshToken: data.refreshToken }),
      clearTokens: () => set({ accessToken: null, refreshToken: null }),

      setUserInfo: userInfo => set({ userInfo }),
      clearUserInfo: () => set({ userInfo: null }),

      doRefreshToken: async () => {
        const rt = get().refreshToken
        if (!rt) {
          throw new Error("No refresh token")
        }

        const data = await refreshToken(rt)
        set({ ...data })
        return data.accessToken
      },
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
      // 只持久化必要字段
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
