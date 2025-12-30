// hooks/useLabels.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createLabel,
  deleteLabel,
  getLabels,
  reorderLabels,
  updateLabel,
} from '@/api/labels'
import type { LabelFormData } from '@/types/labels'

const QUERY_KEY = ['labels']

export function useLabels() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: getLabels,
    staleTime: 1000 * 60 * 5, // 5分钟
  })
}

export function useCreateLabel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createLabel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: () => toast.error('添加失败'),
  })
}

export function useUpdateLabel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: LabelFormData }) => updateLabel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: () => toast.error('更新失败'),
  })
}

export function useDeleteLabel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteLabel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: () => toast.error('删除失败'),
  })
}

export function useReorderLabels() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reorderLabels,
    // Optimistic update 在组件层处理
    onError: () => {
      // 失败时回滚
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}
