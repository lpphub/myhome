import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Edit2, Pin, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LABEL_COLOR_CLASSES, type Label, type LabelFormData } from '@/types/labels'

interface LabelCardProps {
  label: Label
  onDelete?: (labelId: number) => void
  onEdit?: (label: LabelFormData) => void
}

export function LabelCard({ label, onEdit, onDelete }: LabelCardProps) {
  const ROTATIONS = ['-rotate-1', 'rotate-1', 'rotate-2', '-rotate-2', 'rotate-0']
  const rotationClass = ROTATIONS[label.id % ROTATIONS.length]
  const colorClasses = LABEL_COLOR_CLASSES[label.color]

  const { attributes, listeners, transform, transition, isDragging, setNodeRef } = useSortable({
    id: `label-${label.id}`,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    scale: isDragging ? 1.05 : 1,
    zIndex: isDragging ? 1000 : undefined,
    touchAction: 'none',
  }

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (onDelete) {
      onDelete(label.id)
    }
  }

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (onEdit) {
      onEdit(label)
    }
  }

  const handleClick = () => {
    if (!isDragging && onEdit) {
      // onEdit(label)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (onEdit) {
        onEdit(label)
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
        'w-full sm:w-52 shrink-0',
        colorClasses.bg,
        colorClasses.border,
        rotationClass
      )}
    >
      <div
        className={cn(
          'absolute top-2 right-2 flex gap-1 transition-opacity z-20',
          'opacity-100 sm:opacity-0 sm:group-hover:opacity-100'
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
          onClick={handleDeleteClick}
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
        <h3 className={cn('font-bold text-sm mb-1', colorClasses.text)}>{label.name}</h3>
        {label.description && (
          <p className={cn('text-xs mb-1.5 line-clamp-2 opacity-80', colorClasses.text)}>
            {label.description}
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
          <span>{label.itemCount} 个物品</span>
        </div>
      </div>

      <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-white/30 to-transparent' />
    </div>
  )
}
