import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Box, CheckSquare, Edit2, MoreHorizontal, Pin, Trash2 } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { Tag } from '@/types/tags'
import { TAG_COLOR_CLASSES } from '@/types/tags'

const ICON_MAP: Record<string, typeof Box> = {
  storage: Box,
  todo: CheckSquare,
  other: MoreHorizontal,
}

const ROTATIONS = ['-rotate-1', 'rotate-1', 'rotate-2', '-rotate-2', 'rotate-0']

export function TagNote({
  tag,
  onDelete,
  onEdit,
}: {
  tag: Tag
  onDelete?: (tagId: number) => void
  onEdit?: (tag: Tag) => void
}) {
  const rotationClass = ROTATIONS[tag.id % ROTATIONS.length]
  const colorClasses = TAG_COLOR_CLASSES[tag.color]

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `${tag.category}-${tag.id}`,
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
        <h3 className={cn('font-bold text-sm mb-1', colorClasses.text)}>{tag.label}</h3>
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

export function TagSection({
  title,
  category,
  tags,
  isDragOver = false,
  onDeleteTag,
  onEditTag,
}: {
  title: string
  category: string
  tags: (Tag & { sortableId?: string })[]
  isDragOver?: boolean
  onDeleteTag?: (tagId: number) => void
  onEditTag?: (tag: Tag) => void
}) {
  const Icon = ICON_MAP[category]

  return (
    <motion.div
      className='mb-8'
      animate={{ scale: isDragOver ? 1.02 : 1 }}
      style={{ backgroundColor: isDragOver ? 'rgba(255, 243, 224, 0.3)' : 'transparent' }}
      transition={{ duration: 0.2 }}
    >
      <div className='flex items-center mb-4 px-1'>
        <div className='flex items-center gap-2'>
          <div className='w-10 h-10 rounded-xl bg-linear-to-br from-honey-100 to-honey-200 flex items-center justify-center'>
            <Icon className='w-5 h-5 text-honey-600' />
          </div>
          <div>
            <h2 className='text-lg font-bold text-warmGray-800'>{title}</h2>
            <p className='text-sm text-warmGray-500'>{tags.length} 个便签</p>
          </div>
        </div>
      </div>

      <div className='flex flex-wrap gap-4'>
        {tags.map(tag => (
          <TagNote key={tag.id} tag={tag} onDelete={onDeleteTag} onEdit={onEditTag} />
        ))}

        {tags.length === 0 && (
          <div className='w-full py-12 text-center text-warmGray-400 bg-white/50 rounded-2xl border-2 border-dashed border-cream-300'>
            <Box className='w-12 h-12 mx-auto mb-3 opacity-50' aria-hidden='true' />
            <p className='font-medium'>暂无便签</p>
            <p className='text-sm mt-1'>点击右上角按钮添加第一个便签</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
