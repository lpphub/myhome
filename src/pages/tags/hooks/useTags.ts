// hooks/useTags.ts
import { useMutation, useQuery } from '@tanstack/react-query'
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

export function useTags(spaceId: number) {
  return useQuery({
    queryKey: ['tags', spaceId],
    queryFn: () => getTags(spaceId),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    enabled: !!spaceId,
  })
}

export function useCreateTag() {
  return useMutation({
    mutationFn: createTag,
    onSuccess: () => toast.success('添加成功'),
    onError: () => toast.error('添加失败'),
  })
}

export function useUpdateTag() {
  return useMutation({
    mutationFn: updateTag,
    onSuccess: () => toast.success('更新成功'),
    onError: () => toast.error('更新失败'),
  })
}

export function useDeleteTag() {
  return useMutation({
    mutationFn: deleteTag,
    onError: () => toast.error('删除失败'),
  })
}

export function useReorderTags() {
  return useMutation({
    mutationFn: reorderTags,
    onError: () => toast.error('操作失败'),
  })
}

export function useCreateGroup() {
  return useMutation({
    mutationFn: createGroup,
    onSuccess: () => toast.success('添加成功'),
    onError: () => toast.error('添加失败'),
  })
}

export function useDeleteGroup() {
  return useMutation({
    mutationFn: deleteGroup,
    onError: () => toast.error('删除失败'),
  })
}
