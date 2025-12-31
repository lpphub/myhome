import { useDroppable } from '@dnd-kit/core'
import { Plus, Tag } from 'lucide-react'
import { motion } from 'motion/react'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { TagCategory, TagFormData } from '@/types/tags'
import { TagCard } from './TagCard'

export interface TagActions {
  onDelete: (tagId: number) => void
  onEdit: (tag: TagFormData) => void
}

interface TagSectionProps {
  tagCategory: TagCategory
  tagActions?: TagActions
  isDragOver?: boolean
  onAddTagClick?: (category: string) => void
}

export function TagSection({
  tagCategory,
  tagActions,
  isDragOver = false,
  onAddTagClick,
}: TagSectionProps) {
  const { setNodeRef } = useDroppable({
    id: tagCategory.code,
  })

  const animateProps = useMemo(
    () => ({
      scale: isDragOver ? 1.01 : 1,
      backgroundColor: isDragOver ? 'rgba(255, 243, 224, 0.3)' : 'transparent',
      transition: { duration: 0.15 },
    }),
    [isDragOver]
  )

  return (
    <div ref={setNodeRef}>
      <motion.div className='mb-4 rounded-lg' animate={animateProps}>
        <div className='flex items-center px-4 pb-2'>
          <div className='flex items-center gap-2'>
            <div className='w-10 h-10 rounded-xl bg-linear-to-br from-honey-100 to-honey-200 flex items-center justify-center'>
              <Tag className='w-5 h-5 text-honey-600' />
            </div>
            <div>
              <h2 className='text-lg font-bold text-warmGray-800'>{tagCategory.name}</h2>
              <p className='text-sm text-warmGray-500'>{tagCategory.tags.length} 个便签</p>
            </div>
          </div>
        </div>

        <div className='flex flex-wrap gap-4 px-4 pb-4 min-h-24'>
          {tagCategory.tags.map(tag => (
            <TagCard key={tag.id} tag={tag} {...tagActions} />
          ))}

          {onAddTagClick && (
            <motion.button
              type='button'
              onClick={() => onAddTagClick(tagCategory.code)}
              className={cn(
                'w-52 p-4 rounded-lg border-2 border-dashed border-warmGray-200',
                'hover:border-honey-300 hover:bg-honey-50 transition-all duration-300',
                'group flex flex-col items-center justify-center',
                'text-cream-900 hover:text-honey-600'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className='mt-5 mb-1.5'>
                <Plus className='w-8 h-8 transition-transform group-hover:rotate-90 mx-auto' />
              </div>
              <span className='text-sm font-medium'>添加标签</span>
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
