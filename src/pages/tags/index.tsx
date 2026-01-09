import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { LoadingState } from '@/components/LoadingState'
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
import { TagFormDialog } from './components/TagFormDialog'
import { TagToolbar } from './components/TagToolbar'
import { TagWall } from './components/TagWall'

export default function TagsPage() {
  const [searchParams] = useSearchParams()
  const spaceId = searchParams.get('spaceId') || undefined
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
  const [openDialog, setOpenDialog] = useState(false)
  const [editingTag, setEditingTag] = useState<TagFormData | undefined>()

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
  const handleSubmitTag = useCallback(
    (data: TagFormData) => {
      if (data.id) {
        // 编辑
        // updateTag.mutate(data)

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
      } else {
        // 新增
        console.log('add tag', data)
        // addTag.mutate(data)

        createTag.mutate(
          { ...data, spaceId: Number(spaceId) },
          {
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
          }
        )
      }

      setOpenDialog(false)
    },
    [createTag, updateTag, spaceId]
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

  /* 拖拽排序 */
  const handleDragReorder = useCallback(
    (params: ReorderParams, nextTags: TagGroup[]) => {
      // 1️⃣ UI 立即变
      setLocalTags(nextTags)

      // 2️⃣ 后台同步
      reorderTags.mutate(params)
    },
    [reorderTags]
  )

  const handleAddGroup = useCallback(
    (groupName: string) => {
      createGroup.mutate(
        { name: groupName, spaceId: Number(spaceId) },
        {
          onSuccess: group => {
            setLocalTags(prev => [...prev, { ...group, tags: [] }])
          },
        }
      )
    },
    [createGroup, spaceId]
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

  const handleOpenDialog = useCallback((tag?: TagFormData) => {
    setEditingTag(tag)
    setOpenDialog(true)
  }, [])

  if (isLoading) return <LoadingState type='loading' />
  if (!tagsData) return <LoadingState type='error' />

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
