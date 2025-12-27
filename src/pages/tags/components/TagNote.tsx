import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Edit2, Pin, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Tag } from '@/types/tags'
import { TAG_COLOR_CLASSES } from '@/types/tags'

interface TagNoteProps {
  tag: Tag
  sortableId?: string
  onDelete?: (tagId: number) => void
  onEdit?: (tag: Tag) => void
}

const ROTATIONS = ['-rotate-1', 'rotate-1', 'rotate-2', '-rotate-2', 'rotate-0']

export function TagNote({ tag, sortableId, onDelete, onEdit }: TagNoteProps) {
  const rotationClass = ROTATIONS[tag.id % ROTATIONS.length]
  const colorClasses = TAG_COLOR_CLASSES[tag.color]

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sortableId || `${tag.category}-${tag.id}`,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    scale: isDragging ? 1.05 : 1,
    zIndex: isDragging ? 1000 : undefined,
  }

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (onDelete) {
      onDelete(tag.id)
    }
  }

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (onEdit) {
      onEdit(tag)
    }
  }

  const handleClick = () => {
    if (!isDragging && onEdit) {
      onEdit(tag)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (onEdit) {
        onEdit(tag)
      }
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-testid='tag-note'
      {...attributes}
      {...listeners}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role='button'
      tabIndex={0}
      className={cn(
        'relative group p-3 rounded-lg shadow-md transition-all duration-300',
        'hover:shadow-xl hover:-translate-y-1.5 hover:scale-105',
        'border text-left overflow-hidden',
        'cursor-grab active:cursor-grabbing',
        colorClasses.bg,
        colorClasses.border,
        rotationClass
      )}
    >
      <div
        className={cn(
          'absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'
        )}
      >
        <button
          type='button'
          onClick={handleEditClick}
          className='p-1 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors'
          title='编辑'
        >
          <Edit2 className='w-3 h-3 text-warmGray-600' />
        </button>
        <button
          type='button'
          onClick={handleDelete}
          className='p-1 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors'
          title='删除'
        >
          <Trash2 className='w-3 h-3 text-red-500' />
        </button>
      </div>

      <div className='absolute top-2 left-2'>
        <Pin className='w-3 h-3 text-red-400 transform rotate-45' />
      </div>

      <div className='mt-5'>
        <h3 className={cn('font-bold text-sm mb-1', colorClasses.text)}>{tag.name}</h3>
        {tag.description && (
          <p className={cn('text-xs mb-1.5 line-clamp-2 opacity-80', colorClasses.text)}>
            {tag.description}
          </p>
        )}
        <div
          className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
            'bg-white/60 shadow-sm',
            colorClasses.text
          )}
        >
          <span className='w-1.5 h-1.5 rounded-full bg-current opacity-60' />
          <span>{tag.itemCount} 个物品</span>
        </div>
      </div>

      <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-white/30 to-transparent' />
    </div>
  )
}
