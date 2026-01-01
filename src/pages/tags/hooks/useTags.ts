// hooks/useTags.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createCategory, createTag, deleteTag, getTags, updateTag } from '@/api/tags'
import type { ReorderParams, Tag, TagCategory, TagFormData } from '@/types/tags'

// useTags.ts 中的 optimisticReorder 优化
function optimisticReorder(categories: TagCategory[], params: ReorderParams): TagCategory[] {
  const { fromId, toCategory, toIndex } = params

  // 找到要移动的标签
  let movedTag: Tag | undefined
  let fromCategoryCode: string | undefined

  for (const cat of categories) {
    const tag = cat.tags.find(t => t.id === fromId)
    if (tag) {
      movedTag = tag
      fromCategoryCode = cat.code
      break
    }
  }

  if (!movedTag || !fromCategoryCode) return categories

  // ✅ 只更新受影响的分类
  return categories.map(cat => {
    // 源分类：移除标签
    if (cat.code === fromCategoryCode && cat.code !== toCategory) {
      return {
        ...cat,
        tags: cat.tags
          .filter(t => t.id !== fromId)
          .map((t, idx) => (t.order !== idx ? { ...t, order: idx } : t)),
      }
    }

    // 目标分类：添加标签
    if (cat.code === toCategory && cat.code !== fromCategoryCode) {
      const newTags = [...cat.tags]
      newTags.splice(toIndex, 0, { ...movedTag!, category: toCategory })
      return {
        ...cat,
        tags: newTags.map((t, idx) => (t.order !== idx ? { ...t, order: idx } : t)),
      }
    }

    // 同一分类内移动
    if (cat.code === fromCategoryCode && cat.code === toCategory) {
      const currentIndex = cat.tags.findIndex(t => t.id === fromId)
      if (currentIndex === toIndex) return cat // 位置没变

      const newTags = [...cat.tags]
      const [removed] = newTags.splice(currentIndex, 1)
      newTags.splice(toIndex > currentIndex ? toIndex - 1 : toIndex, 0, removed)

      return {
        ...cat,
        tags: newTags.map((t, idx) => (t.order !== idx ? { ...t, order: idx } : t)),
      }
    }

    // 其他分类不变
    return cat
  })
}

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
