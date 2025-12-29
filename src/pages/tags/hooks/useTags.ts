import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { createTag, deleteTag, getCategories, getTags, reorderTags, updateTag } from '@/api/tags'
import type { ReorderRequest, Tag, TagFormData } from '@/types/tags'

interface UseTagsHook {
  tags: Tag[]
  categories: Array<{ code: string; name: string }>
  isLoading: boolean
  mutations: {
    onAdd: (data: TagFormData) => void
    onUpdate: (id: number, data: Partial<Tag>) => void
    onDelete: (id: number) => void
    onReorder: (params: ReorderRequest) => void
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

  const onAdd = useCallback(
    (data: TagFormData) => {
      createTagMutation.mutate(data)
    },
    [createTagMutation.mutate]
  )

  const onUpdate = useCallback(
    (id: number, data: Partial<Tag>) => {
      updateTagMutation.mutate({ id, data })
    },
    [updateTagMutation.mutate]
  )

  const onDelete = useCallback(
    (id: number) => {
      deleteTagMutation.mutate(id)
    },
    [deleteTagMutation.mutate]
  )

  const onReorder = useCallback(
    (params: ReorderRequest) => {
      reorderTagsMutation.mutate(params)
    },
    [reorderTagsMutation.mutate]
  )

  const mutations = useMemo(
    () => ({
      onAdd,
      onUpdate,
      onDelete,
      onReorder,
    }),
    [onAdd, onUpdate, onDelete, onReorder]
  )

  return {
    tags: tagsData || [],
    categories: categoriesData || [],
    isLoading,
    mutations,
  }
}
