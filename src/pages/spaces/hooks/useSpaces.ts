import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createSpace, deleteSpace, getSpaces, updateSpace } from '@/api/spaces'
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

      const previousSpaces = queryClient.getQueryData<Space[]>(SPACES_QUERY_KEY)

      queryClient.setQueryData<Space[]>(SPACES_QUERY_KEY, old => {
        if (!old) return []
        return old.map(space => (space.id === data.id ? { ...space, ...data } : space))
      })

      return { previousSpaces }
    },
    onSuccess: () => {
      toast.success('更新成功')
    },
    onError: (_error, _variables, context) => {
      if (context?.previousSpaces) {
        queryClient.setQueryData(SPACES_QUERY_KEY, context.previousSpaces)
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

      const previousSpaces = queryClient.getQueryData<Space[]>(SPACES_QUERY_KEY)

      queryClient.setQueryData<Space[]>(SPACES_QUERY_KEY, old => {
        if (!old) return []
        return old.filter(space => space.id !== id)
      })

      return { previousSpaces }
    },
    onError: (_error, _id, context) => {
      if (context?.previousSpaces) {
        queryClient.setQueryData(SPACES_QUERY_KEY, context.previousSpaces)
      }
      toast.error('删除失败')
    },
  })
}
