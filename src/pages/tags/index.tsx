import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { LoadingState } from '@/components/LoadingState'
import { usePinnedSpaceId } from '@/pages/spaces/hooks/useSpaces'
import type { Group, ReorderParams, TagFormData, TagGroup } from '@/types/tags'
import { TagFormDialog } from './components/TagFormDialog'
import { TagToolbar } from './components/TagToolbar'
import { TagWall } from './components/TagWall'
import {
  useCreateGroup,
  useCreateTag,
  useDeleteGroup,
  useDeleteTag,
  useReorderTags,
  useTags,
  useUpdateTag,
} from './hooks/useTags'
import { useTagsStore } from './stores/useTagsStore'

/* =======================================================
 * 外层：只做 spaceId 判断（无业务 hooks）
 * ======================================================= */
export default function TagsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const pinnedSpaceId = usePinnedSpaceId()

  const spaceId = useMemo<number | undefined>(() => {
    const fromQuery = searchParams.get('spaceId')
    if (fromQuery) {
      const parsed = Number(fromQuery)
      return Number.isNaN(parsed) ? undefined : parsed
    }
    return pinnedSpaceId
  }, [searchParams, pinnedSpaceId])

  if (!spaceId) {
    return (
      <LoadingState
        type='error'
        message='请选择一个空间作为默认便签墙'
        action={{ label: '去选择', onClick: () => navigate('/') }}
      />
    )
  }

  return <TagsPageInner spaceId={spaceId} />
}

/* =======================================================
 * 内层：完整页面逻辑（所有 hooks 都在这里）
 * ======================================================= */
function TagsPageInner({ spaceId }: { spaceId: number }) {
  const {
    tags,
    initTags,
    addTag,
    updateTag: updateTagLocal,
    deleteTag: deleteTagLocal,
    reorder,
    addGroup,
    deleteGroup: deleteGroupLocal,
  } = useTagsStore()

  /* ---------------- apis ---------------- */
  const { data, isLoading } = useTags(spaceId)
  const createTag = useCreateTag()
  const updateTag = useUpdateTag()
  const deleteTag = useDeleteTag()
  const reorderTags = useReorderTags()
  const createGroup = useCreateGroup()
  const deleteGroup = useDeleteGroup()

  /* ---------------- ui ---------------- */
  const [searchKeyword, setSearchKeyword] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingTag, setEditingTag] = useState<TagFormData | undefined>()

  /* ---------------- server → store ---------------- */
  useEffect(() => {
    if (!data) return

    if (spaceId !== useTagsStore.getState().spaceId) {
      initTags(spaceId, data)
    }
  }, [data, spaceId, initTags])

  /* ---------------- derived ---------------- */
  const filteredTags = useMemo(() => {
    if (!searchKeyword.trim()) return tags
    const keyword = searchKeyword.toLowerCase()

    return tags
      .map(group => ({
        ...group,
        tags: group.tags.filter(
          tag =>
            tag.name.toLowerCase().includes(keyword) ||
            tag.description?.toLowerCase().includes(keyword)
        ),
      }))
      .filter(group => group.tags.length > 0)
  }, [tags, searchKeyword])

  const groupsSelected = useMemo<Group[]>(
    () => tags.map(({ id, code, name }) => ({ id, code, name })),
    [tags]
  )

  /* ---------------- handlers ---------------- */
  const handleSubmitTag = useCallback(
    (data: TagFormData) => {
      if (data.id) {
        const previous = structuredClone(useTagsStore.getState().tags)

        updateTagLocal(data)

        updateTag.mutate(data, {
          onError: () => useTagsStore.getState().restore(previous), // 失败时回滚到快照
        })
      } else {
        // 新增
        createTag.mutate({ ...data, spaceId }, { onSuccess: tag => addTag(tag) })
      }
      setOpenDialog(false)
    },
    [addTag, updateTagLocal, createTag, updateTag, spaceId]
  )

  const handleDeleteTag = useCallback(
    (id: number) => {
      const previous = structuredClone(useTagsStore.getState().tags)

      deleteTagLocal(id)
      deleteTag.mutate(id, {
        onError: () => useTagsStore.getState().restore(previous),
      })
    },
    [deleteTagLocal, deleteTag]
  )

  /* 拖拽排序 */
  const handleDragReorder = useCallback(
    (params: ReorderParams, next: TagGroup[]) => {
      const previous = structuredClone(useTagsStore.getState().tags)

      reorder(next)

      reorderTags.mutate(params, {
        onError: () => useTagsStore.getState().restore(previous),
      })
    },
    [reorder, reorderTags]
  )

  const handleAddGroup = useCallback(
    (name: string) => {
      createGroup.mutate({ name, spaceId }, { onSuccess: group => addGroup(group) })
    },
    [createGroup, addGroup, spaceId]
  )

  const handleDeleteGroup = useCallback(
    (code: string) => {
      const previous = structuredClone(useTagsStore.getState().tags)

      deleteGroupLocal(code)

      deleteGroup.mutate(code, {
        onError: () => useTagsStore.getState().restore(previous),
      })
    },
    [deleteGroupLocal, deleteGroup]
  )

  const handleOpenDialog = useCallback((tag?: TagFormData) => {
    setEditingTag(tag)
    setOpenDialog(true)
  }, [])

  if (isLoading) {
    return <LoadingState type='loading' />
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-6'>
      {/* 操作栏 */}
      <TagToolbar onAddGroup={handleAddGroup} onSearch={setSearchKeyword} />

      {/* 标签墙 */}
      <TagWall
        tags={filteredTags}
        tagActions={{
          onEdit: tag => handleOpenDialog(tag),
          onDelete: handleDeleteTag,
        }}
        onAddTag={group => handleOpenDialog({ group, name: '', color: 'lemon' })}
        onDragReorder={handleDragReorder}
        onDeleteGroup={handleDeleteGroup}
      />

      {/* Dialog */}
      <TagFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        initialData={editingTag}
        groups={groupsSelected}
        onSubmit={handleSubmitTag}
      />
    </div>
  )
}
