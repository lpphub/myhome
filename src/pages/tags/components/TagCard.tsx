import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import parse from 'html-react-parser'
import { Clock, Pin, Trash2 } from 'lucide-react'
import { memo, useCallback, useMemo } from 'react'
import { parseEditorContent } from '@/components/editor/utils'
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
  const colorClasses = TAG_COLOR_CLASSES[tag.color] ?? TAG_COLOR_CLASSES.lemon

  const { html: tagHtml } = useMemo(() => parseEditorContent(tag.content), [tag.content])

  const sortableId = useMemo(() => `${tag.groupId}-${tag.id}`, [tag.groupId, tag.id])
  const { attributes, listeners, transform, transition, isDragging, setNodeRef } = useSortable({
    id: sortableId,
  })

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      zIndex: isDragging ? 1000 : undefined,
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
      onEdit(tag)
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
      data-testid='tag-card'
      {...attributes}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role='button'
      tabIndex={0}
      className={cn(
        'relative p-3 max-sm:p-2.5 rounded-sm shadow-tag transition-all duration-250',
        'hover:shadow-tag-hover hover:-translate-y-1.5 hover:scale-[1.02]',
        'text-left overflow-hidden',
        'w-56 h-46 max-[480px]:w-full box-border',
        'group flex flex-col justify-between',
        colorClasses.classes,
        rotationClass,
        isDragging && 'shadow-tag-dragging'
      )}
    >
      {/* 顶部图钉 - 拖拽手柄 */}
      <button
        type='button'
        {...listeners}
        className='absolute top-2 left-2 z-10 p-0.5 cursor-grab active:cursor-grabbing touch-none'
        aria-label='拖拽卡片'
      >
        <Pin className='w-3.5 h-3.5 max-sm:w-3 max-sm:h-3 text-red-400/70 transform rotate-30 pointer-events-none' />
      </button>

      {/* 右侧删除按钮 */}
      <div className='absolute top-2 right-2 z-20 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity'>
        <button
          type='button'
          onClick={handleDeleteClick}
          className='p-1 sm:p-1.5 rounded-full bg-white/60 hover:bg-white hover:scale-110 backdrop-blur-sm shadow-sm'
          title='删除'
        >
          <Trash2 className='w-3.5 h-3.5 max-sm:w-3 max-sm:h-3 text-red-400' />
        </button>
      </div>

      {/* 内容区 */}
      <div className='px-1 py-4 flex-1 overflow-hidden tiptap tiptap-compact'>{parse(tagHtml)}</div>

      {/* 底部时间 */}
      <div className='flex items-center gap-1 mt-2 text-[11px] max-sm:text-[10px] font-medium opacity-60'>
        <Clock className='w-3 h-3 max-sm:w-2.5 max-sm:h-2.5' />
        <span>{formatRelativeTime(tag.updatedAt) || formatRelativeTime(tag.createdAt)}</span>
      </div>
    </div>
  )
})
