import { useCallback, useMemo, useState } from 'react'
import { LoadingState } from '@/components/LoadingState'
import { TagFormDialog } from '@/pages/tags/components/TagFormDialog'
import { TagToolbar } from '@/pages/tags/components/TagToolbar'
import { TagWall } from '@/pages/tags/components/TagWall'
import { useCreateCategory, useTags } from '@/pages/tags/hooks/useTags'
import type { Category, TagFormData } from '@/types/tags'

export default function TagsPage() {
  const { data: tags, isLoading } = useTags()
  const createCategory = useCreateCategory()

  const categories = useMemo<Category[]>(
    () => tags?.map(cat => ({ id: cat.id, code: cat.code, name: cat.name })) || [],
    [tags]
  )

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

  const handleAddCategory = useCallback(
    (categoryName: string) => {
      createCategory.mutate(categoryName)
    },
    [createCategory]
  )

  const handleAddTagClick = useCallback((category: string) => {
    setDialogTag({ name: '', category, color: 'lemon' })
    setDialogOpen(true)
  }, [])

  const handleEditTagClick = useCallback((tag: TagFormData) => {
    setDialogTag(tag)
    setDialogOpen(true)
  }, [])

  const tagActions = useMemo(
    () => ({
      onEdit: handleEditTagClick,
      onDelete: (id: number) => console.log('delete', id),
      onReorder: (data: { fromId: number; toId?: number; toCategory: string; toIndex: number }) =>
        console.log('reorder', data),
    }),
    [handleEditTagClick]
  )

  if (isLoading) return <LoadingState type='loading' />

  if (!tags) return <LoadingState type='error' />

  return (
    <div className='max-w-7xl mx-auto px-4 py-6'>
      <TagToolbar onAddCategory={handleAddCategory} />

      <TagWall tags={tags} tagActions={tagActions} onAddTagClick={handleAddTagClick} />

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
