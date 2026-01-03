// hooks/useTags.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createCategory, createTag, deleteTag, getTags, reorderTags, updateTag } from '@/api/tags'
import type { TagCategory, TagFormData } from '@/types/tags'

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
    mutationFn: reorderTags,
    onSuccess: () => {
      // 操作成功后刷新缓存（确保数据一致性）
      // queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
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
    onMutate: async (categoryName: string) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })
      const previousData = queryClient.getQueryData<TagCategory[]>(QUERY_KEY)

      const newCategory: TagCategory = {
        id: Date.now(),
        code: `cat_${Date.now()}`,
        name: categoryName,
        tags: [],
      }

      queryClient.setQueryData<TagCategory[]>(QUERY_KEY, old => {
        if (!old) return [newCategory]
        return [...old, newCategory]
      })

      return { previousData }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(QUERY_KEY, context.previousData)
      }
      toast.error('创建分类失败')
    },
    onSuccess: () => {
      toast.success('创建分类成功')
      // queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}
