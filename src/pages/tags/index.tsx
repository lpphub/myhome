import { useCallback, useEffect, useMemo, useState } from 'react'
import { LoadingState } from '@/components/LoadingState'
import { TagFormDialog } from '@/pages/tags/components/TagFormDialog'
import { TagToolbar } from '@/pages/tags/components/TagToolbar'
import { TagWall } from '@/pages/tags/components/TagWall'
import {
  useCreateCategory,
  useCreateTag,
  useDeleteTag,
  useReorderTags,
  useTags,
  useUpdateTag,
} from '@/pages/tags/hooks/useTags'
import type { Category, ReorderParams, TagCategory, TagFormData } from '@/types/tags'

export default function TagsPage() {
  const { data: tagsData, isLoading } = useTags()
  /* ---------------- mutations ---------------- */
  const createTag = useCreateTag()
  const updateTag = useUpdateTag()
  const deleteTag = useDeleteTag()
  const reorderTags = useReorderTags()
  const createCategory = useCreateCategory()

  /* ---------------- 页面 UI 状态 ---------------- */

  // ⭐ 页面展示用的唯一数据源
  const [localTags, setLocalTags] = useState<TagCategory[]>([])

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

  const categoriesSelected = useMemo<Category[]>(
    () =>
      localTags.map(cat => ({
        id: cat.id,
        code: cat.code,
        name: cat.name,
      })),
    [localTags]
  )

  /* ---------------- handlers ---------------- */

  const handleAddCategory = useCallback(
    (categoryName: string) => {
      createCategory.mutate(categoryName, {
        onSuccess: category => {
          setLocalTags(prev => [...prev, { ...category, tags: [] }])
        },
      })
    },
    [createCategory]
  )

  const handleAddTag = useCallback(
    (data: TagFormData) => {
      createTag.mutate(data, {
        onSuccess: tag => {
          setLocalTags(prev =>
            prev.map(cat =>
              cat.code === data.category
                ? {
                    ...cat,
                    tags: [...cat.tags, { ...tag }],
                  }
                : cat
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
        prev.map(cat =>
          cat.code === data.category
            ? {
                ...cat,
                tags: cat.tags.map(tag => (tag.id === data.id ? { ...tag, ...data } : tag)),
              }
            : cat
        )
      )

      updateTag.mutate(data)
    },
    [updateTag]
  )

  const handleDeleteTag = useCallback(
    (id: number) => {
      setLocalTags(prev =>
        prev.map(cat => ({
          ...cat,
          tags: cat.tags.filter(tag => tag.id !== id),
        }))
      )

      deleteTag.mutate(id)
    },
    [deleteTag]
  )

  /* ===== 拖拽排序 ===== */
  const handleReorder = useCallback(
    (params: ReorderParams, nextTags: TagCategory[]) => {
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
      <TagToolbar onAddCategory={handleAddCategory} />

      <TagWall
        tags={localTags}
        tagActions={{
          onEdit: tag => {
            setDialogTag(tag)
            setDialogOpen(true)
          },
          onDelete: handleDeleteTag,
        }}
        onClickAddTag={category => {
          setDialogTag({ name: '', category, color: 'lemon' })
          setDialogOpen(true)
        }}
        onReorder={handleReorder}
      />

      <TagFormDialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        initialData={dialogTag}
        categories={categoriesSelected}
        actions={{
          addTag: handleAddTag,
          updateTag: handleUpdateTag,
        }}
      />
    </div>
  )
}
