import { useCallback, useEffect, useMemo, useState } from 'react'
import { LoadingState } from '@/components/LoadingState'
import { TagFormDialog } from '@/pages/tags/components/TagFormDialog'
import { TagToolbar } from '@/pages/tags/components/TagToolbar'
import { TagWall } from '@/pages/tags/components/TagWall'
import { useCreateCategory, useReorderTags, useTags } from '@/pages/tags/hooks/useTags'
import type { Category, ReorderParams, Tag, TagCategory, TagFormData } from '@/types/tags'

export default function TagsPage() {
  const { data: tagsData, isLoading } = useTags()
  const createCategory = useCreateCategory()
  const reorderTags = useReorderTags()

  // ✅ 1️⃣ 本地状态管理标签数据
  const [localTags, setLocalTags] = useState<TagCategory[]>([])

  // 初始化本地状态
  useEffect(() => {
    if (tagsData) {
      setLocalTags(tagsData)
    }
  }, [tagsData])

  // 分类列表（用于弹窗）
  const categories = useMemo<Category[]>(
    () =>
      localTags.map(cat => ({
        id: cat.id,
        code: cat.code,
        name: cat.name,
      })),
    [localTags]
  )

  /* ---------------- dialog state ---------------- */
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [dialogTag, setDialogTag] = useState<TagFormData | null>(null)

  const dialogActions = useMemo(
    () => ({
      addTag: (data: TagFormData) => {
        console.log('add', data)
        setDialogOpen(false)
      },
      updateTag: (data: TagFormData) => {
        console.log('update', data)
        setDialogOpen(false)
      },
    }),
    []
  )

  // ✅ 2️⃣ 添加分类（更新本地状态 + 后端）
  const handleAddCategory = useCallback((categoryName: string) => {
    console.log('createCategory', categoryName)
  }, [])

  const handleAddTagClick = useCallback((category: string) => {
    setDialogTag({ name: '', category, color: 'lemon' })
    setDialogOpen(true)
  }, [])

  const handleEditTagClick = useCallback((tag: TagFormData) => {
    setDialogTag(tag)
    setDialogOpen(true)
  }, [])

  // ✅ 3️⃣ 拖拽处理：仅更新本地状态，结束后同步到后端
  const handleDraggingTag = useCallback(
    (data: ReorderParams) => {
      // 先更新本地状态（即时响应）
      setLocalTags(prev => optimisticReorder(prev, data))

      // 再同步到后端
      reorderTags.mutate(data)
    },
    [reorderTags]
  )

  const tagActions = useMemo(
    () => ({
      onEdit: handleEditTagClick,
      onDelete: (id: number) => console.log('delete', id),
    }),
    [handleEditTagClick]
  )

  if (isLoading) return <LoadingState type='loading' />
  if (!localTags.length) return <LoadingState type='error' />

  return (
    <div className='max-w-7xl mx-auto px-4 py-6'>
      <TagToolbar onAddCategory={handleAddCategory} />

      <TagWall
        tags={localTags}
        tagActions={tagActions}
        onAddTagClick={handleAddTagClick}
        onDraggingTag={handleDraggingTag}
      />

      <TagFormDialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        initialData={dialogTag}
        categories={categories}
        actions={dialogActions}
      />
    </div>
  )
}

/* ---------- 乐观更新逻辑（本地状态） ---------- */
function optimisticReorder(categories: TagCategory[], params: ReorderParams): TagCategory[] {
  const { fromId, toCategory, toIndex } = params
  let movedTag: Tag | undefined

  // 步骤1：从原分类移除标签
  const afterRemove = categories.map(cat => {
    const tagIndex = cat.tags.findIndex(tag => tag.id === fromId)
    if (tagIndex !== -1) {
      movedTag = cat.tags[tagIndex]
      return {
        ...cat,
        tags: cat.tags.filter((_, i) => i !== tagIndex).map((t, idx) => ({ ...t, order: idx })),
      }
    }
    return cat
  })

  if (!movedTag) return categories

  // 步骤2：将标签添加到目标分类
  return afterRemove.map(cat => {
    if (cat.code === toCategory) {
      const newTags = [...cat.tags]
      newTags.splice(toIndex, 0, {
        ...movedTag,
        category: toCategory,
        order: toIndex,
      })
      return {
        ...cat,
        tags: newTags.map((t, idx) => ({ ...t, order: idx })),
      }
    }
    return cat
  })
}
