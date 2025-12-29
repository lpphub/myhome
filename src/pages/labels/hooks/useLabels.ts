// hooks/useLabels.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createLabel, deleteLabel, getLabels, reorderLabels, updateLabel } from '@/api/labels'
import type { Label, LabelCategory, LabelFormData } from '@/types/labels'

const QUERY_KEY = ['labels']

// 将扁平数据转换为分类结构
export function groupByCategory(labels: Label[]): LabelCategory[] {
  const categoryMap = new Map<string, Label[]>()

  labels
    .sort((a, b) => a.order - b.order)
    .forEach(label => {
      const existing = categoryMap.get(label.category) || []
      categoryMap.set(label.category, [...existing, label])
    })

  return Array.from(categoryMap.entries()).map(([name, labels]) => ({
    id: name,
    name,
    labels,
    icon: '',
  }))
}

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
    mutationFn: ({ id, data }: { id: number; data: Partial<LabelFormData> }) =>
      updateLabel(id, data),
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
