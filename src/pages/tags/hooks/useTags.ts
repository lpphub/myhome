import { useMutation, useQuery } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { queryKeys, withToast } from '@/lib/query-helpers'
import { useSpace } from '@/pages/spaces/contexts/SpaceContext'
import { useTagsStore } from '@/pages/tags/stores/useTagsStore'
import {
  createGroup,
  createTag,
  deleteGroup,
  deleteTag,
  getTags,
  reorderTags,
  updateTag,
} from '@/services/tags'
import type { Group, ReorderParams, TagFormData, TagGroup } from '@/types/tags'

/* --------------------------------
 * Query（server state）
 * -------------------------------- */
export function useTagQuery() {
  const { spaceId } = useSpace()
  return useQuery({
    queryKey: queryKeys.tags(spaceId),
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
  return useMutation(withToast({ mutationFn: createTag }, 'create'))
}

export function useUpdateTagMutation() {
  return useMutation(withToast({ mutationFn: updateTag }, 'update'))
}

export function useDeleteTagMutation() {
  return useMutation(withToast({ mutationFn: deleteTag }, 'delete'))
}

export function useReorderTagsMutation() {
  return useMutation(withToast({ mutationFn: reorderTags }, { error: '操作失败' }))
}

export function useCreateGroupMutation() {
  return useMutation(withToast({ mutationFn: createGroup }, 'create'))
}

export function useDeleteGroupMutation() {
  return useMutation(withToast({ mutationFn: deleteGroup }, 'delete'))
}

/* --------------------------------
 * 业务复合 Hooks（Command Hooks）
 * -------------------------------- */
export function useTags() {
  const { data, isLoading, error } = useTagQuery()

  const tags = useTagsStore(s => s.tags)
  const currentSpaceId = useTagsStore(s => s.spaceId)
  const { spaceId } = useSpace()

  useEffect(() => {
    if (!data) return
    if (spaceId && spaceId !== currentSpaceId) {
      useTagsStore.getState().initTags(spaceId, data)
    }
  }, [spaceId, currentSpaceId, data])

  return { tags, isLoading, error }
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
      createGroupMutation.mutate({ name, spaceId } as Group, {
        onSuccess: group => addGroup(group),
      })
    },
    [spaceId, addGroup, createGroupMutation]
  )

  const handleDeleteGroup = useCallback(
    (id: number) => {
      const previous = structuredClone(useTagsStore.getState().tags)

      deleteGroup(id)

      deleteGroupMutation.mutate({ id, spaceId } as Group, {
        onError: () => restore(previous),
      })
    },
    [spaceId, deleteGroup, restore, deleteGroupMutation]
  )

  return {
    handleAddGroup,
    handleDeleteGroup,
  }
}
