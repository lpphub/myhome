import { useCallback } from 'react'
import { storage } from '@/lib/storage'
import { useAuthStore } from '@/stores'

const getKey = (userId: number) => `current_space_id:${userId}`

export function useSpaceId() {
  const user = useAuthStore(s => s.user)

  const getSpaceId = useCallback(() => {
    if (!user) return null
    const id = storage.getItem(getKey(user.id))
    return id ? parseInt(id, 10) : null
  }, [user])

  const setSpaceId = useCallback(
    (id: number) => {
      if (!user) return
      storage.setItem(getKey(user.id), id.toString())
    },
    [user]
  )

  return { getSpaceId, setSpaceId }
}
