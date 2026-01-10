import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { createSpace, deleteSpace, getSpaces, togglePinSpace, updateSpace } from '@/api/spaces'
import type { Space } from '@/types/spaces'

const SPACES_QUERY_KEY = ['spaces'] as const

export function useSpaces() {
  return useQuery({
    queryKey: SPACES_QUERY_KEY,
    queryFn: getSpaces,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export function usePinnedSpaceId() {
  const { data: spaces, isLoading } = useSpaces()

  const pinnedId = useMemo(() => spaces?.find(s => s.pin)?.id, [spaces])

  return { pinnedId, isLoading }
}

export function useCreateSpace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSpace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SPACES_QUERY_KEY })
      toast.success('创建成功')
    },
    onError: () => {
      toast.error('创建失败')
    },
  })
}

export function useUpdateSpace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateSpace,
    onMutate: async data => {
      await queryClient.cancelQueries({ queryKey: SPACES_QUERY_KEY })

      const previous = queryClient.getQueryData<Space[]>(SPACES_QUERY_KEY)

      queryClient.setQueryData<Space[]>(SPACES_QUERY_KEY, prev => {
        if (!prev) return []
        return prev.map(s => (s.id === data.id ? { ...s, ...data } : s))
      })

      return { previous }
    },
    onSuccess: () => {
      toast.success('更新成功')
    },
    onError: (_error, _data, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SPACES_QUERY_KEY, context.previous)
      }
      toast.error('更新失败')
    },
  })
}

export function useDeleteSpace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSpace,
    onMutate: async id => {
      await queryClient.cancelQueries({ queryKey: SPACES_QUERY_KEY })

      const previous = queryClient.getQueryData<Space[]>(SPACES_QUERY_KEY)

      queryClient.setQueryData<Space[]>(SPACES_QUERY_KEY, prev => {
        if (!prev) return []
        return prev.filter(s => s.id !== id)
      })

      return { previous }
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SPACES_QUERY_KEY, context.previous)
      }
      toast.error('删除失败')
    },
  })
}

export function useTogglePinSpace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: togglePinSpace,
    onMutate: async id => {
      await queryClient.cancelQueries({ queryKey: SPACES_QUERY_KEY })

      const previous = queryClient.getQueryData<Space[]>(SPACES_QUERY_KEY)

      queryClient.setQueryData<Space[]>(SPACES_QUERY_KEY, prev => {
        if (!prev) return []

        const target = prev.find(s => s.id === id)
        const newPin = !target?.pin

        return prev.map(s =>
          s.id === id ? { ...s, pin: newPin } : newPin ? { ...s, pin: false } : s
        )
      })

      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SPACES_QUERY_KEY, context.previous)
      }
      toast.error('设置失败')
    },
  })
}
