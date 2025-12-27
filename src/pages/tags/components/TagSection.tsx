import { Home, Tag as TagIcon } from 'lucide-react'
import { motion } from 'motion/react'
import type { Tag, TagCategory } from '@/types/tags'
import { TagNote } from './TagNote'

interface TagSectionProps {
  title: string
  category: TagCategory
  tags: (Tag & { sortableId?: string })[]
  isDragOver?: boolean
  onDeleteTag?: (tagId: number) => void
  onEditTag?: (tag: Tag) => void
}

export function TagSection({
  title,
  category,
  tags,
  isDragOver = false,
  onDeleteTag,
  onEditTag,
}: TagSectionProps) {
  return (
    <motion.div
      className='mb-8'
      animate={{
        scale: isDragOver ? 1.02 : 1,
      }}
      style={{
        backgroundColor: isDragOver ? 'rgba(255, 243, 224, 0.3)' : 'transparent',
      }}
      transition={{ duration: 0.2 }}
    >
      <div className='flex items-center mb-4 px-1'>
        <div className='flex items-center gap-2'>
          <div className='w-10 h-10 rounded-xl bg-linear-to-br from-honey-100 to-honey-200 flex items-center justify-center'>
            {category === 'room' ? (
              <Home className='w-5 h-5 text-honey-600' />
            ) : (
              <TagIcon className='w-5 h-5 text-coral-500' />
            )}
          </div>
          <div>
            <h2 className='text-lg font-bold text-warmGray-800'>{title}</h2>
            <p className='text-sm text-warmGray-500'>{tags.length} 个便签</p>
          </div>
        </div>
      </div>

      <div className='flex flex-wrap gap-4'>
        {tags.map(tag => (
          <TagNote
            key={tag.id}
            tag={tag}
            sortableId={tag.sortableId}
            onDelete={onDeleteTag}
            onEdit={onEditTag}
          />
        ))}

        {tags.length === 0 && (
          <div className='w-full py-12 text-center text-warmGray-400 bg-white/50 rounded-2xl border-2 border-dashed border-cream-300'>
            <TagIcon className='w-12 h-12 mx-auto mb-3 opacity-50' aria-hidden='true' />
            <p className='font-medium'>暂无便签</p>
            <p className='text-sm mt-1'>点击右上角按钮添加第一个便签</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
