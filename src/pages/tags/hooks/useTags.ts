// hooks/useTags.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createCategory, createTag, deleteTag, getTags, updateTag } from '@/api/tags'
import type { ReorderParams, Tag, TagCategory, TagFormData } from '@/types/tags'

const QUERY_KEY = ['tags']

function optimisticReorder(categories: TagCategory[], params: ReorderParams): TagCategory[] {
  const { fromId, toCategory, toIndex } = params

  let movedTag: Tag | undefined

  const afterRemove = categories.map(cat => {
    const tagToMove = cat.tags.find(tag => tag.id === fromId)
    if (tagToMove) {
      movedTag = tagToMove
    }
    return {
      ...cat,
      tags: cat.tags.filter(tag => tag.id !== fromId).map((tag, idx) => ({ ...tag, order: idx })),
    }
  })

  if (!movedTag) return categories

  const updatedTag: Tag = {
    id: movedTag.id,
    name: movedTag.name,
    category: toCategory,
    order: movedTag.order,
    color: movedTag.color,
    description: movedTag.description,
    itemCount: movedTag.itemCount,
  }

  return afterRemove.map(cat => {
    if (cat.code === toCategory) {
      const newTags = [...cat.tags]
      newTags.splice(toIndex, 0, updatedTag)

      return {
        ...cat,
        tags: newTags.map((tag, idx) => ({ ...tag, order: idx })),
      }
    }
    return cat
  })
}

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

    // ✅ 1️⃣ 乐观更新
    onMutate: async params => {
      // ① 停止正在进行的 refetch，避免覆盖
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })

      // ② 快照当前数据（用于回滚）
      const previous = queryClient.getQueryData<TagCategory[]>(QUERY_KEY)

      // ③ 乐观更新缓存
      if (previous) {
        const next = optimisticReorder(previous, params)
        queryClient.setQueryData(QUERY_KEY, next)
      }

      // ④ 返回 context，供 onError 使用
      return { previous }
    },

    // ❌ 2️⃣ 出错回滚
    onError: (_err, _params, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEY, context.previous)
      }
      toast.error('操作失败')
    },

    // 🔄 3️⃣ 最终与服务端对齐（可选）
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    // },
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
