import { useDroppable } from '@dnd-kit/core'
import { Box, CheckSquare, MoreHorizontal, Plus } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { LabelCard } from '@/pages/labels/components/LabelCard'
import type { LabelCategory, LabelFormData } from '@/types/labels'

const ICON_MAP: Record<string, typeof Box> = {
  box: Box,
  check: CheckSquare,
  more: MoreHorizontal,
}

interface LabelSectionProps {
  category: LabelCategory
  isDragOver?: boolean
  labelActions?: {
    onDelete: (labelId: number) => void
    onEdit: (labelId: number, label: LabelFormData) => void
  }
  onAddLabelClick?: (category: string) => void
}

export function LabelSection({
  category,
  labelActions,
  isDragOver = false,
  onAddLabelClick,
}: LabelSectionProps) {
  const { setNodeRef } = useDroppable({
    id: category.code, // 👈 关键：容器自己的 id
  })

  const Icon = ICON_MAP[category.icon] || Box

  return (
    <motion.div
      ref={setNodeRef}
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
            <h2 className='text-lg font-bold text-warmGray-800'>{category.name}</h2>
            <p className='text-sm text-warmGray-500'>{category.labels.length} 个便签</p>
          </div>
        </div>
      </div>

      <div className='flex flex-wrap gap-4'>
        {/** 标签卡片 */}
        {category.labels.map(label => (
          <LabelCard key={label.id} label={label} {...labelActions} />
        ))}

        {/** 添加标签按钮 */}
        {onAddLabelClick && (
          <motion.button
            type='button'
            onClick={() => onAddLabelClick(category.code)}
            className={cn(
              'w-52 shrink-0 p-4 rounded-lg border-2 border-dashed',
              'bg-cream-100 border-cream-200',
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

        {/* 空状态下的拖拽区域 */}
        {category.labels.length === 0 && <EmptyDroppable id={category.code} />}
      </div>
    </motion.div>
  )
}

function EmptyDroppable({ id }: { id: string }) {
  const { setNodeRef } = useDroppable({ id })

  return <div ref={setNodeRef} className='w-52 h-24 shrink-0 pointer-events-none' />
}
