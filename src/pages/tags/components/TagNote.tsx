import { Edit2, Pin, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Tag } from '@/types/tags'
import { TAG_COLOR_CLASSES } from '@/types/tags'

interface TagNoteProps {
  tag: Tag
  onDelete?: (tagId: number) => void
  onEdit?: (tag: Tag) => void
}

const ROTATIONS = ['-rotate-1', 'rotate-1', 'rotate-2', '-rotate-2', 'rotate-0']

export function TagNote({ tag, onDelete, onEdit }: TagNoteProps) {
  const [isHovered, setIsHovered] = useState(false)
  const rotationClass = ROTATIONS[tag.id % ROTATIONS.length]
  const colorClasses = TAG_COLOR_CLASSES[tag.color]

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (onDelete) {
      onDelete(tag.id)
    }
  }

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    handleClick()
  }

  const handleClick = () => {
    if (onEdit) {
      onEdit(tag)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative group p-3 rounded-lg shadow-md transition-all duration-300',
        'hover:shadow-xl hover:-translate-y-1.5 hover:scale-105',
        'border cursor-pointer text-left overflow-hidden',
        colorClasses.bg,
        colorClasses.border,
        rotationClass
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          'absolute top-2 right-2 flex gap-1 transition-opacity',
          isHovered ? 'opacity-100' : 'opacity-0'
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
