// hooks/useTags.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createCategory, createTag, deleteTag, getTags, updateTag } from '@/api/tags'
import type { ReorderParams, Tag, TagCategory, TagFormData } from '@/types/tags'

const QUERY_KEY = ['tags']

export function useTags() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: getTags,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: () => toast.error('添加失败'),
  })
}

export function useUpdateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TagFormData }) => updateTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: () => toast.error('更新失败'),
  })
}

export function useDeleteTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: () => toast.error('删除失败'),
  })
}

export function useReorderTags() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: ReorderParams) => {
      // 调api接口
      return params
    },

    onSuccess: () => {
      // ✅ 操作成功后刷新缓存（确保数据一致性）
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },

    // ❌ 2️⃣ 出错回滚
    onError: () => {
      toast.error('操作失败')

      const prev = queryClient.getQueryData<TagCategory[]>(QUERY_KEY)
      if (prev) {
        queryClient.setQueryData(QUERY_KEY, prev)
      }
    },
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
    onError: () => toast.error('创建分类失败'),
  })
}
