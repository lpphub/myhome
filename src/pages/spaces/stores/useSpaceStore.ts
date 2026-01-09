import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SpaceStore {
  spaceId?: number
  setSpaceId: (id: number) => void
  reset: () => void
}

export const useSpaceStore = create<SpaceStore>()(
  persist(
    set => ({
      spaceId: undefined,

      setSpaceId: (id: number) =>
        set({
          spaceId: id,
        }),

      reset: () =>
        set({
          spaceId: undefined,
        }),
    }),
    {
      name: 'space-store', // localStorage key
      partialize: state => ({ spaceId: state.spaceId }), // 只持久化 spaceId
    }
  )
)
