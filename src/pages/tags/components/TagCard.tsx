import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Clock, Pin, Trash2 } from 'lucide-react'
import { memo, useCallback, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { TAG_COLOR_CLASSES, type Tag, type TagFormData } from '@/types/tags'
import { formatRelativeTime } from '@/utils/date'

const ROTATIONS = ['-rotate-1', 'rotate-1', 'rotate-2', '-rotate-2', 'rotate-0']

interface TagCardProps {
  tag: Tag
  onDelete?: (tagId: number) => void
  onEdit?: (tag: TagFormData) => void
}

export const TagCard = memo(({ tag, onEdit, onDelete }: TagCardProps) => {
  const rotationClass = ROTATIONS[tag.id % ROTATIONS.length]
  const colorClasses = TAG_COLOR_CLASSES[tag.color]

  const sortableId = useMemo(() => `${tag.group}-${tag.id}`, [tag.group, tag.id])
  const { attributes, listeners, transform, transition, isDragging, setNodeRef } = useSortable({
    id: sortableId,
  })

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      scale: isDragging ? 1.05 : 1,
      zIndex: isDragging ? 1000 : undefined,
      touchAction: 'none',
    }),
    [isDragging, transform, transition]
  )

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      onDelete?.(tag.id)
    },
    [onDelete, tag.id]
  )

  const handleClick = useCallback(() => {
    if (!isDragging && onEdit) {
      onEdit?.(tag)
    }
  }, [isDragging, onEdit, tag])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && onEdit) {
        e.preventDefault()
        onEdit(tag)
      }
    },
    [onEdit, tag]
  )

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
        'relative p-4 rounded-xl shadow-sm transition-all duration-300',
        'hover:shadow-xl hover:-translate-y-1.5 hover:scale-[1.02]',
        'border-2 text-left overflow-hidden',
        'cursor-grab active:cursor-grabbing',
        'w-full sm:w-56 shrink-0 box-border',
        'group',
        colorClasses.classes,
        rotationClass,
        isDragging && 'shadow-2xl'
      )}
    >
      <div className='absolute top-2.5 left-2.5 z-10'>
        <Pin className='w-4 h-4 text-red-500 opacity-80 transform rotate-45' />
      </div>

      <div className='absolute top-2.5 right-2.5 flex gap-1.5 z-20 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity'>
        <button
          type='button'
          onClick={handleDeleteClick}
          className={cn(
            'p-1.5 rounded-full transition-all duration-200',
            'bg-white/60 hover:bg-white hover:scale-110',
            'backdrop-blur-sm shadow-sm'
          )}
          title='删除'
        >
          <Trash2 className='w-3.5 h-3.5 text-red-500' />
        </button>
      </div>

      <div className='pt-5 pr-8'>
        <h3 className={cn('font-bold text-base mb-1.5 leading-snug', colorClasses.classes)}>
          {tag.name}
        </h3>
        {tag.description && (
          <p
            className={cn('text-xs line-clamp-2 leading-relaxed opacity-75', colorClasses.classes)}
          >
            {tag.description}
          </p>
        )}
      </div>

      <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current/20 to-transparent' />

      <div
        className={cn(
          'flex items-center gap-1.5 mt-3 pt-2 border-t border-current/10',
          'text-[11px] font-medium opacity-60',
          colorClasses.classes
        )}
      >
        <Clock className='w-3.5 h-3.5' />
        <span>{formatRelativeTime(tag.updatedAt) || formatRelativeTime(tag.createdAt)}</span>
      </div>
    </div>
  )
})
