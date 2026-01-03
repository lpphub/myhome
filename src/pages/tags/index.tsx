import { useCallback, useMemo, useState } from 'react'
import { LoadingState } from '@/components/LoadingState'
import { TagFormDialog } from '@/pages/tags/components/TagFormDialog'
import { TagToolbar } from '@/pages/tags/components/TagToolbar'
import { TagWall } from '@/pages/tags/components/TagWall'
import { useCreateCategory, useReorderTags, useTags } from '@/pages/tags/hooks/useTags'
import type { Category, ReorderParams, TagFormData } from '@/types/tags'

export default function TagsPage() {
  const { data: tagsData, isLoading } = useTags()
  const createCategory = useCreateCategory()
  const reorderTags = useReorderTags()

  /* ---------------- dialog state ---------------- */
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [dialogTag, setDialogTag] = useState<TagFormData | null>(null)

  // 分类列表（用于弹窗）
  const categories = useMemo<Category[]>(
    () =>
      tagsData?.map(cat => ({
        id: cat.id,
        code: cat.code,
        name: cat.name,
      })) || [],
    [tagsData]
  )

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

  const handleDraggingTag = useCallback((data: ReorderParams) => {
    console.log('handleDraggingTag', data)
    // 再同步到后端
    // reorderTags.mutate(data)
  }, [])

  const tagActions = useMemo(
    () => ({
      onEdit: handleEditTagClick,
      onDelete: (id: number) => console.log('delete', id),
    }),
    [handleEditTagClick]
  )

  if (isLoading) return <LoadingState type='loading' />
  if (!tagsData) return <LoadingState type='error' />

  return (
    <div className='max-w-7xl mx-auto px-4 py-6'>
      <TagToolbar onAddCategory={handleAddCategory} />

      <TagWall
        tags={tagsData}
        tagActions={tagActions}
        onClickAddTag={handleAddTagClick}
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
