import { useDroppable } from '@dnd-kit/core'
import { Plus, Tag } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { LabelCategory, LabelFormData } from '@/types/labels'
import { LabelCard } from './LabelCard'

export interface LabelActions {
  onDelete: (labelId: number) => void
  onEdit: (label: LabelFormData) => void
}

interface LabelSectionProps {
  labelCategory: LabelCategory
  labelActions?: LabelActions
  isDragOver?: boolean
  onAddLabelClick?: (category: string) => void
}

export function LabelSection({
  labelCategory,
  labelActions,
  isDragOver = false,
  onAddLabelClick,
}: LabelSectionProps) {
  const { setNodeRef } = useDroppable({
    id: labelCategory.code, // 容器唯一 id
  })

  return (
    <motion.div
      ref={setNodeRef}
      className='mb-4 rounded-lg'
      animate={{ scale: isDragOver ? 1.01 : 1 }}
      style={{ backgroundColor: isDragOver ? 'rgba(255, 243, 224, 0.3)' : 'transparent' }}
      transition={{ duration: 0.15 }}
    >
      {/* title */}
      <div className='flex items-center px-4 pb-2'>
        <div className='flex items-center gap-2'>
          <div className='w-10 h-10 rounded-xl bg-linear-to-br from-honey-100 to-honey-200 flex items-center justify-center'>
            <Tag className='w-5 h-5 text-honey-600' />
          </div>
          <div>
            <h2 className='text-lg font-bold text-warmGray-800'>{labelCategory.name}</h2>
            <p className='text-sm text-warmGray-500'>{labelCategory.labels.length} 个便签</p>
          </div>
        </div>
      </div>

      <div className='flex flex-wrap gap-4 px-4 pb-4'>
        {/** card */}
        {labelCategory.labels.map(label => (
          <LabelCard key={label.id} label={label} {...labelActions} />
        ))}

        {/* 添加标签按钮 */}
        {onAddLabelClick && (
          <motion.button
            type='button'
            onClick={() => onAddLabelClick(labelCategory.code)}
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

        {/* 空状态拖拽 */}
        {labelCategory.labels.length === 0 && <EmptyDroppable id={labelCategory.code} />}
      </div>
    </motion.div>
  )
}

function EmptyDroppable({ id }: { id: string }) {
  const { setNodeRef } = useDroppable({ id: `${id}-container` })
  return <div ref={setNodeRef} className='w-52 h-24 shrink-0 pointer-events-none' />
}
