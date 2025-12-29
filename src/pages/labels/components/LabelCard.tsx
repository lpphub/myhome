import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Edit2, Pin, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Label, LabelFormData } from '@/types/labels'

const ROTATIONS = ['-rotate-1', 'rotate-1', 'rotate-2', '-rotate-2', 'rotate-0']
const CARD_COLOR_CLASSES: Record<string, { bg: string; border: string; text: string }> = {
  lemon: {
    bg: 'bg-lemon-100',
    border: 'border-lemon-200',
    text: 'text-lemon-900',
  },
  coral: {
    bg: 'bg-coral-100',
    border: 'border-coral-200',
    text: 'text-coral-900',
  },
  lavender: {
    bg: 'bg-lavender-100',
    border: 'border-lavender-200',
    text: 'text-lavender-900',
  },
  honey: {
    bg: 'bg-honey-100',
    border: 'border-honey-200',
    text: 'text-honey-900',
  },
  cream: {
    bg: 'bg-cream-100',
    border: 'border-cream-200',
    text: 'text-cream-900',
  },
  pink: {
    bg: 'bg-pink-100',
    border: 'border-pink-200',
    text: 'text-pink-900',
  },
  mint: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-900',
  },
}

interface LabelCardProps {
  label: Label
  onDelete?: (labelId: number) => void
  onEdit?: (labelId: number, label: LabelFormData) => void
}

export function LabelCard({ label, onEdit, onDelete }: LabelCardProps) {
  const rotationClass = ROTATIONS[label.id % ROTATIONS.length]
  const colorClasses = CARD_COLOR_CLASSES[label.color]

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `${label.category}-${label.id}`,
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
      onDelete(label.id)
    }
  }

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (onEdit) {
      onEdit(label.id, label)
    }
  }

  const handleClick = () => {
    if (!isDragging && onEdit) {
      onEdit(label.id, label)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (onEdit) {
        onEdit(label.id, label)
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
        'w-52 shrink-0',
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
