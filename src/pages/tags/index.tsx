import { useState } from 'react'
import { LoadingState } from '@/components/LoadingState'
import type { Tag } from '@/types/tags'
import { AddTagDialog } from './components/AddTagDialog'
import { TagDragPanel } from './components/TagDragPanel'
import { TagFilter } from './components/TagFilter'
import { useTags } from './hooks/useTags'

export default function TagsPage() {
  const { tags, categories, isLoading, mutations } = useTags()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)

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

  if (isLoading) return <LoadingState type='loading' />

  return (
    <div className='max-w-7xl mx-auto px-4 py-6'>
      <TagFilter />
      <TagDragPanel
        tags={tags}
        categories={categories}
        tagActions={{
          onReorder: mutations.onReorder,
          onEdit: setEditingTag,
          onDelete: mutations.onDelete,
        }}
      />
      <AddTagDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddTag={handleAddTag}
        onUpdateTag={handleUpdateTag}
        editingTag={editingTag}
      />
    </div>
  )
}
