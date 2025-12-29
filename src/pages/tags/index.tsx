import { useState } from 'react'
import { LoadingState } from '@/components/LoadingState'
import type { SortByType, Tag } from '@/types/tags'
import { AddTagDialog } from './components/AddTagDialog'
import { TagDragPanel } from './components/TagDragPanel'
import { TagFilter } from './components/TagFilter'
import { useTags } from './hooks/useTags'

export default function TagsPage() {
  const { tags, categories, isLoading, mutations } = useTags()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [defaultCategory, setDefaultCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState<SortByType>('date-desc')

  const handleAddTag = (tag: Tag) => {
    mutations.onAdd({
      label: tag.label,
      category: tag.category,
      color: tag.color,
      description: tag.description,
    })
    setIsAddDialogOpen(false)
  }

  const handleUpdateTag = (tag: Tag) => {
    mutations.onUpdate(tag.id, {
      label: tag.label,
      category: tag.category,
      color: tag.color,
      description: tag.description,
    })
    setIsAddDialogOpen(false)
    setEditingTag(null)
  }

  const handleAddTagClick = (category: string) => {
    setDefaultCategory(category)
    setIsAddDialogOpen(true)
  }

  if (isLoading) return <LoadingState type='loading' />

  return (
    <div className='max-w-7xl mx-auto px-4 py-6'>
      <TagFilter sortBy={sortBy} onSortChange={setSortBy} />
      <TagDragPanel
        tags={tags}
        categories={categories}
        sortBy={sortBy}
        onSortChange={setSortBy}
        tagActions={{
          onReorder: mutations.onReorder,
          onEdit: setEditingTag,
          onDelete: mutations.onDelete,
          onAddTagClick: handleAddTagClick,
        }}
      />
      <AddTagDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddTag={handleAddTag}
        onUpdateTag={handleUpdateTag}
        editingTag={editingTag}
        defaultCategory={defaultCategory}
      />
    </div>
  )
}
