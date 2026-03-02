import { useDroppable } from '@dnd-kit/core'
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { Plus, Tags, Trash2 } from 'lucide-react'
import { memo, useCallback, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Tag, TagGroup } from '@/types/tags'
import { NewTagCard } from './NewTagCard'
import { TagCard } from './TagCard'

interface TagSectionProps {
  dragOverId?: string | null
  tagGroup: TagGroup
  onAddTag: (groupId: number, data: { name: string; color: string }) => void
  onClickTag: (tag: Tag) => void
  onDeleteGroup?: (id: number) => void
}

export const TagSection = memo(
  ({ dragOverId, tagGroup, onAddTag, onClickTag, onDeleteGroup }: TagSectionProps) => {
    const [showNewCard, setShowNewCard] = useState(false)

    const { setNodeRef, isOver } = useDroppable({
      id: tagGroup.id,
    })
    const isDragOver = isOver || dragOverId?.startsWith(`${tagGroup.id}-`)

    const tagItems = tagGroup.tags.map(t => `${t.groupId}-${t.id}`)

    const handleAddClick = useCallback(() => {
      setShowNewCard(true)
    }, [])

    const handleNewCardSave = useCallback(
      (data: { name: string; color: string; groupId: number }) => {
        onAddTag(data.groupId, { name: data.name, color: data.color })
        setShowNewCard(false)
      },
      [onAddTag]
    )

    const handleNewCardCancel = useCallback(() => {
      setShowNewCard(false)
    }, [])

    return (
      <div
        ref={setNodeRef}
        className={cn('rounded-lg transition-transform duration-150', isDragOver && 'scale-[1.01] bg-cream-200')}
      >
        <div className='flex items-center gap-2 px-4 py-2'>
          <div className='w-10 h-10 rounded-xl bg-linear-to-br from-honey-100 to-honey-200 flex items-center justify-center shrink-0'>
            <Tags className='w-5 h-5 text-honey-600' />
          </div>
          <h2 className='text-lg font-bold text-foreground flex items-center gap-2'>
            {tagGroup.name}
            <Badge variant='outline'>{tagGroup.tags.length}</Badge>
            {tagGroup.tags.length === 0 && onDeleteGroup && (
              <button
                type='button'
                onClick={() => onDeleteGroup(tagGroup.id)}
                className='ml-1 rounded hover:bg-red-100 transition-all duration-200'
                title='删除分组'
              >
                <Trash2 className='w-3.5 h-3.5 text-red-500' />
              </button>
            )}
          </h2>
        </div>

        <div className='flex flex-row gap-4 flex-wrap py-4 px-4'>
          <SortableContext items={tagItems} strategy={rectSortingStrategy}>
            {tagGroup.tags.map(tag => (
              <TagCard key={tag.id} tag={tag} onClick={onClickTag} />
            ))}
          </SortableContext>

          {showNewCard && <NewTagCard groupId={tagGroup.id} onSave={handleNewCardSave} onCancel={handleNewCardCancel} />}

          {!showNewCard && (
            <button
              type='button'
              onClick={handleAddClick}
              className={cn(
                'w-56 min-h-48 p-3 rounded-sm border-2 border-dashed border-honey-300',
                'hover:border-honey-400 hover:bg-honey-100/50 transition-all duration-250',
                'group flex flex-col items-center justify-center',
                'text-honey-500 hover:text-honey-700'
              )}
            >
              <div className='mb-1.5'>
                <Plus className='w-8 h-8 transition-transform group-hover:rotate-90 mx-auto' />
              </div>
              <span className='text-sm font-medium'>添加便签</span>
            </button>
          )}
        </div>
      </div>
    )
  }
)