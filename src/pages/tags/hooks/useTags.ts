// hooks/useTags.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createGroup,
  createTag,
  deleteGroup,
  deleteTag,
  getTags,
  reorderTags,
  updateTag,
} from '@/api/tags'
import type { TagGroup } from '@/types/tags'

const QUERY_KEY = ['tags']

export function useTags() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: getTags,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateTag() {
  return useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: () => toast.error('添加失败'),
  })
}

export function useUpdateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTag,
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: () => {
      toast.error('操作失败')
      const prev = queryClient.getQueryData<TagGroup[]>(QUERY_KEY)
      if (prev) {
        queryClient.setQueryData(QUERY_KEY, prev)
      }
    },
  })
}

export function useDeleteTag() {
  return useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: () => toast.error('删除失败'),
  })
}

export function useReorderTags() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reorderTags,
    onSuccess: () => {
      // 操作成功后刷新缓存（确保数据一致性）
      // queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: () => {
      toast.error('操作失败')
      const prev = queryClient.getQueryData<TagGroup[]>(QUERY_KEY)
      if (prev) {
        queryClient.setQueryData(QUERY_KEY, prev)
      }
    },
  })
}

export function useCreateGroup() {
  return useMutation({
    mutationFn: createGroup,
    onError: () => toast.error('添加失败'),
  })
}

export function useDeleteGroup() {
  return useMutation({
    mutationFn: deleteGroup,
    onError: () => toast.error('删除失败'),
  })
}
