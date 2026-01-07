import { useDroppable } from '@dnd-kit/core'
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { Plus, Tag, Trash2 } from 'lucide-react'
import { memo, useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { TagFormData, TagGroup } from '@/types/tags'
import { TagCard } from './TagCard'

export interface TagActions {
  onDelete: (tagId: number) => void
  onEdit: (tag: TagFormData) => void
}

interface TagSectionProps {
  dragOverId?: string | null
  tagGroup: TagGroup
  tagActions?: TagActions
  onAddTag?: (group: string) => void
  onDeleteGroup?: (code: string) => void
}

export const TagSection = memo(
  ({ dragOverId, tagGroup, tagActions, onAddTag, onDeleteGroup }: TagSectionProps) => {
    const { setNodeRef, isOver } = useDroppable({
      id: tagGroup.code,
    })
    const isDragOver = isOver || dragOverId?.startsWith(`${tagGroup.code}-`)

    const tagItems = useMemo(() => tagGroup.tags.map(t => `${t.group}-${t.id}`), [tagGroup.tags])
    return (
      <div
        ref={setNodeRef}
        className={cn(
          'rounded-lg transition-transform duration-150',
          isDragOver && 'scale-[1.01] bg-cream-200'
        )}
      >
        {/* 头部 */}
        <div className='flex items-center gap-2 px-4 py-2'>
          <div className='w-10 h-10 rounded-xl bg-linear-to-br from-honey-100 to-honey-200 flex items-center justify-center'>
            <Tag className='w-5 h-5 text-honey-600' />
          </div>
          <div>
            <h2 className='text-lg font-bold text-foreground'>{tagGroup.name}</h2>
            <p className='text-sm text-foreground'>
              {tagGroup.tags.length} 个便签
              {tagGroup.tags.length === 0 && onDeleteGroup && (
                <button
                  type='button'
                  onClick={() => onDeleteGroup(tagGroup.code)}
                  className='ml-2 p-0.5 rounded hover:bg-red-100 transition-all duration-200'
                  title='删除分组'
                >
                  <Trash2 className='w-3.5 h-3.5 text-red-500' />
                </button>
              )}
            </p>
          </div>
        </div>

        {/* 卡片区域 */}
        <div className='flex flex-row gap-4 flex-wrap py-4 px-4'>
          <SortableContext items={tagItems} strategy={rectSortingStrategy}>
            {tagGroup.tags.map(tag => (
              <TagCard key={tag.id} tag={tag} {...tagActions} />
            ))}
          </SortableContext>

          {onAddTag && (
            <button
              type='button'
              onClick={() => onAddTag(tagGroup.code)}
              className={cn(
                'w-52 p-4 rounded-lg border-2 border-dashed border-border',
                'hover:border-honey-300 hover:bg-honey-50 transition-all duration-300',
                'group flex flex-col items-center justify-center',
                'text-cream-900 hover:text-honey-600'
              )}
            >
              <div className='mt-5 mb-1.5'>
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
