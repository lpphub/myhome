import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createTag, deleteTag, getCategories, getTags, reorderTags, updateTag } from '@/api/tags'
import type { Tag } from '@/types/tags'

interface UseTagsHook {
  tags: Tag[]
  categories: Array<{ code: string; name: string }>
  isLoading: boolean
  mutations: {
    onAdd: (tag: Omit<Tag, 'id' | 'createdAt' | 'updatedAt' | 'itemCount'>) => void
    onUpdate: (id: number, data: Partial<Tag>) => void
    onDelete: (id: number) => void
    onReorder: (params: {
      fromId: number
      toId?: number
      toCategory: string
      toIndex?: number
    }) => void
  }
}

export function useTags(): UseTagsHook {
  const queryClient = useQueryClient()

  const { data: tagsData, isLoading: tagsLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
  })

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['tag-categories'],
    queryFn: getCategories,
  })

  const isLoading = tagsLoading || categoriesLoading

  const createTagMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('标签添加成功')
    },
    onError: () => toast.error('添加标签失败'),
  })

  const updateTagMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Tag> }) => updateTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('标签更新成功')
    },
    onError: () => toast.error('更新标签失败'),
  })

  const deleteTagMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('标签删除成功')
    },
    onError: () => toast.error('删除标签失败'),
  })

  const reorderTagsMutation = useMutation({
    mutationFn: reorderTags,
    onError: () => toast.error('排序保存失败'),
  })

  return {
    tags: tagsData || [],
    categories: categoriesData || [],
    isLoading,
    mutations: {
      onAdd: createTagMutation.mutate,
      onUpdate: (id, data) => updateTagMutation.mutate({ id, data }),
      onDelete: deleteTagMutation.mutate,
      onReorder: reorderTagsMutation.mutate,
    },
  }
}
