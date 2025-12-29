import { useCallback, useMemo, useState } from 'react'
import { LoadingState } from '@/components/LoadingState'
import type { SortByType, Tag, TagActions } from '@/types/tags'
import { AddTagDialog } from './components/AddTagDialog'
import { TagDragPanel } from './components/TagDragPanel'
import { TagFilter } from './components/TagFilter'
import { useTags } from './hooks/useTags'

export default function TagsPage() {
  const { tags, categories, isLoading, mutations } = useTags()
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [defaultCategory, setDefaultCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState<SortByType>('date-desc')
  const isAddDialogOpen = editingTag !== null || defaultCategory !== ''

  const handleAddTag = useCallback(
    (tag: Tag) => {
      mutations.onAdd({
        label: tag.label,
        category: tag.category,
        color: tag.color,
        description: tag.description,
      })
      setDefaultCategory('')
      setEditingTag(null)
    },
    [mutations.onAdd]
  )

  const handleUpdateTag = useCallback(
    (tag: Tag) => {
      mutations.onUpdate(tag.id, {
        label: tag.label,
        category: tag.category,
        color: tag.color,
        description: tag.description,
      })
      setDefaultCategory('')
      setEditingTag(null)
    },
    [mutations.onUpdate]
  )

  const handleAddTagClick = useCallback((category: string) => {
    setDefaultCategory(category)
    setEditingTag(null)
  }, [])

  const handleDialogClose = useCallback(() => {
    setDefaultCategory('')
    setEditingTag(null)
  }, [])

  const tagActions = useMemo<TagActions>(
    () => ({
      onReorder: mutations.onReorder,
      onEdit: setEditingTag,
      onDelete: mutations.onDelete,
      onAddTagClick: handleAddTagClick,
    }),
    [mutations.onReorder, mutations.onDelete, handleAddTagClick]
  )

  if (isLoading) return <LoadingState type='loading' />

  return (
    <div className='max-w-7xl mx-auto px-4 py-6'>
      <TagFilter sortBy={sortBy} onSortChange={setSortBy} />
      <TagDragPanel
        tags={tags}
        categories={categories}
        sortBy={sortBy}
        onSortChange={setSortBy}
        tagActions={tagActions}
      />
      <AddTagDialog
        open={isAddDialogOpen}
        onOpenChange={handleDialogClose}
        onAddTag={handleAddTag}
        onUpdateTag={handleUpdateTag}
        editingTag={editingTag}
        defaultCategory={defaultCategory}
      />
    </div>
  )
}
