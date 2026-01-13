import { useMutation, useQuery } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
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
import { useSpace } from '@/pages/spaces/contexts/SpaceContext'
import { useTagsStore } from '@/pages/tags/stores/useTagsStore'
import type { ReorderParams, TagFormData, TagGroup } from '@/types/tags'

/* --------------------------------
 * Query（server state）
 * -------------------------------- */
export function useTagQuery() {
  const { spaceId } = useSpace()
  return useQuery({
    queryKey: ['tags', spaceId],
    queryFn: () => getTags(spaceId),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    enabled: !!spaceId,
  })
}

/* --------------------------------
 * Mutations（server effect）
 * -------------------------------- */
export function useCreateTagMutation() {
  return useMutation({
    mutationFn: createTag,
    onSuccess: () => toast.success('添加成功'),
    onError: () => toast.error('添加失败'),
  })
}

export function useUpdateTagMutation() {
  return useMutation({
    mutationFn: updateTag,
    onSuccess: () => toast.success('更新成功'),
    onError: () => toast.error('更新失败'),
  })
}

export function useDeleteTagMutation() {
  return useMutation({
    mutationFn: deleteTag,
    onError: () => toast.error('删除失败'),
  })
}

export function useReorderTagsMutation() {
  return useMutation({
    mutationFn: reorderTags,
    onError: () => toast.error('操作失败'),
  })
}

export function useCreateGroupMutation() {
  return useMutation({
    mutationFn: createGroup,
    onSuccess: () => toast.success('添加成功'),
    onError: () => toast.error('添加失败'),
  })
}

export function useDeleteGroupMutation() {
  return useMutation({
    mutationFn: deleteGroup,
    onError: () => toast.error('删除失败'),
  })
}

/* --------------------------------
 * 业务复合 Hooks（Command Hooks）
 * -------------------------------- */
export function useTags() {
  const { spaceId } = useSpace()

  const tags = useTagsStore(s => s.tags)
  const currentSpaceId = useTagsStore(s => s.spaceId)
  const initTags = useTagsStore(s => s.initTags)
  const query = useTagQuery()

  useEffect(() => {
    if (!query.data) return
    if (spaceId && spaceId !== currentSpaceId) {
      initTags(spaceId, query.data)
    }
  }, [spaceId, currentSpaceId, query.data, initTags])

  return {
    tags,
    isLoading: query.isLoading,
    error: query.error,
  }
}

export function useTagActions() {
  const { spaceId } = useSpace()
  const addTag = useTagsStore(s => s.addTag)
  const updateTag = useTagsStore(s => s.updateTag)
  const restore = useTagsStore(s => s.restore)

  const createTagMutation = useCreateTagMutation()
  const updateTagMutation = useUpdateTagMutation()

  const handleSubmitTag = useCallback(
    (data: TagFormData) => {
      // 更新
      if (data.id) {
        const previous = structuredClone(useTagsStore.getState().tags)

        updateTag(data)

        updateTagMutation.mutate(data, {
          onError: () => restore(previous),
        })
        return
      }

      // 新增
      createTagMutation.mutate(
        { ...data, spaceId },
        {
          onSuccess: tag => addTag(tag),
        }
      )
    },
    [spaceId, addTag, updateTag, restore, createTagMutation, updateTagMutation]
  )

  return handleSubmitTag
}

export function useDeleteTagAction() {
  const deleteTag = useTagsStore(s => s.deleteTag)
  const restore = useTagsStore(s => s.restore)

  const deleteTagMutation = useDeleteTagMutation()

  const handleDeleteTag = useCallback(
    (id: number) => {
      const previous = structuredClone(useTagsStore.getState().tags)

      deleteTag(id)

      deleteTagMutation.mutate(id, {
        onError: () => restore(previous),
      })
    },
    [deleteTag, restore, deleteTagMutation]
  )

  return handleDeleteTag
}

export function useReorderTagsAction() {
  const reorder = useTagsStore(s => s.reorder)
  const restore = useTagsStore(s => s.restore)

  const reorderMutation = useReorderTagsMutation()

  const handleReorder = useCallback(
    (params: ReorderParams, next: TagGroup[]) => {
      const previous = structuredClone(useTagsStore.getState().tags)

      reorder(next)

      reorderMutation.mutate(params, {
        onError: () => restore(previous),
      })
    },
    [reorder, restore, reorderMutation]
  )

  return handleReorder
}

export function useGroupActions() {
  const { spaceId } = useSpace()
  const addGroup = useTagsStore(s => s.addGroup)
  const deleteGroup = useTagsStore(s => s.deleteGroup)
  const restore = useTagsStore(s => s.restore)

  const createGroupMutation = useCreateGroupMutation()
  const deleteGroupMutation = useDeleteGroupMutation()

  const handleAddGroup = useCallback(
    (name: string) => {
      createGroupMutation.mutate(
        { name, spaceId },
        {
          onSuccess: group => addGroup(group),
        }
      )
    },
    [spaceId, addGroup, createGroupMutation]
  )

  const handleDeleteGroup = useCallback(
    (code: string) => {
      const previous = structuredClone(useTagsStore.getState().tags)

      deleteGroup(code)

      deleteGroupMutation.mutate(code, {
        onError: () => restore(previous),
      })
    },
    [deleteGroup, restore, deleteGroupMutation]
  )

  return {
    handleAddGroup,
    handleDeleteGroup,
  }
}
