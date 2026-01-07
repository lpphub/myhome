import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { LoadingState } from '@/components/LoadingState'
import { TagFormDialog } from '@/pages/tags/components/TagFormDialog'
import { TagToolbar } from '@/pages/tags/components/TagToolbar'
import { TagWall } from '@/pages/tags/components/TagWall'
import {
  useCreateGroup,
  useCreateTag,
  useDeleteGroup,
  useDeleteTag,
  useReorderTags,
  useTags,
  useUpdateTag,
} from '@/pages/tags/hooks/useTags'
import type { Group, ReorderParams, TagFormData, TagGroup } from '@/types/tags'

export default function TagsPage() {
  const { spaceId } = useParams<{ spaceId: string }>()
  const { data: tagsData, isLoading } = useTags(spaceId)
  /* ---------------- mutations ---------------- */
  const createTag = useCreateTag()
  const updateTag = useUpdateTag()
  const deleteTag = useDeleteTag()
  const reorderTags = useReorderTags()
  const createGroup = useCreateGroup()
  const deleteGroup = useDeleteGroup()

  /* ---------------- 页面 UI 状态 ---------------- */

  // ⭐ 页面展示用的唯一数据源
  const [localTags, setLocalTags] = useState<TagGroup[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')

  // dialog
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [dialogTag, setDialogTag] = useState<TagFormData | null>(null)

  /* ---------------- 初始化 / 同步 ---------------- */

  useEffect(() => {
    if (tagsData) {
      setLocalTags(tagsData)
    }
  }, [tagsData])

  /* ---------------- 派生数据 ---------------- */

  const filteredTags = useMemo(() => {
    if (!searchKeyword.trim()) return localTags

    const keyword = searchKeyword.toLowerCase()

    return localTags
      .map(cat => ({
        ...cat,
        tags: cat.tags.filter(
          tag =>
            tag.name.toLowerCase().includes(keyword) ||
            tag.description?.toLowerCase().includes(keyword)
        ),
      }))
      .filter(cat => cat.tags.length > 0)
  }, [localTags, searchKeyword])

  const groupsSelected = useMemo<Group[]>(
    () =>
      localTags.map(group => ({
        id: group.id,
        code: group.code,
        name: group.name,
      })),
    [localTags]
  )

  /* ---------------- handlers ---------------- */

  const handleAddGroup = useCallback(
    (groupName: string) => {
      createGroup.mutate(groupName, {
        onSuccess: group => {
          setLocalTags(prev => [...prev, { ...group, tags: [] }])
        },
      })
    },
    [createGroup]
  )

  const handleAddTag = useCallback(
    (data: TagFormData) => {
      createTag.mutate(data, {
        onSuccess: tag => {
          setLocalTags(prev =>
            prev.map(group =>
              group.code === data.group
                ? {
                    ...group,
                    tags: [...group.tags, { ...tag }],
                  }
                : group
            )
          )
        },
      })

      setDialogOpen(false)
    },
    [createTag]
  )

  const handleUpdateTag = useCallback(
    (data: TagFormData) => {
      setDialogOpen(false)

      setLocalTags(prev =>
        prev.map(group =>
          group.code === data.group
            ? {
                ...group,
                tags: group.tags.map(tag => (tag.id === data.id ? { ...tag, ...data } : tag)),
              }
            : group
        )
      )

      updateTag.mutate(data)
    },
    [updateTag]
  )

  const handleDeleteTag = useCallback(
    (id: number) => {
      deleteTag.mutate(id, {
        onSuccess: () => {
          setLocalTags(prev =>
            prev.map(cat => ({
              ...cat,
              tags: cat.tags.filter(tag => tag.id !== id),
            }))
          )
        },
      })
    },
    [deleteTag]
  )

  const handleDeleteGroup = useCallback(
    (groupCode: string) => {
      deleteGroup.mutate(groupCode, {
        onSuccess: () => {
          setLocalTags(prev => prev.filter(group => group.code !== groupCode))
        },
      })
    },
    [deleteGroup]
  )

  /* ===== 拖拽排序 ===== */
  const handleReorder = useCallback(
    (params: ReorderParams, nextTags: TagGroup[]) => {
      // 1️⃣ UI 立即变
      setLocalTags(nextTags)

      // 2️⃣ 后台同步
      reorderTags.mutate(params)
    },
    [reorderTags]
  )

  if (isLoading) return <LoadingState type='loading' />
  if (!tagsData) return <LoadingState type='error' />

  return (
    <div className='max-w-7xl mx-auto px-4 py-6'>
      <TagToolbar onAddGroup={handleAddGroup} onSearch={setSearchKeyword} />

      <TagWall
        tags={filteredTags}
        tagActions={{
          onEdit: tag => {
            setDialogTag({ ...tag })
            setDialogOpen(true)
          },
          onDelete: handleDeleteTag,
        }}
        onAddTag={group => {
          setDialogTag({ name: '', group, color: 'lemon' })
          setDialogOpen(true)
        }}
        onReorder={handleReorder}
        onDeleteGroup={handleDeleteGroup}
      />

      <TagFormDialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        initialData={dialogTag}
        groups={groupsSelected}
        actions={{
          addTag: handleAddTag,
          updateTag: handleUpdateTag,
        }}
      />
    </div>
  )
}
