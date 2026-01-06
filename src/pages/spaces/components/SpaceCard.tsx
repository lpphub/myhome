import { Clock } from 'lucide-react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router'
import type { Space } from '@/types/space'

interface SpaceCardProps {
  space: Space
}

export function SpaceCard({ space }: SpaceCardProps) {
  const navigate = useNavigate()

  const formatDate = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return '今天'
    if (days === 1) return '昨天'
    if (days < 7) return `${days}天前`
    if (days < 30) return `${Math.floor(days / 7)}周前`
    return `${Math.floor(days / 30)}个月前`
  }

  const handleClick = () => {
    navigate(`/tags`)
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className='group relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-gray-300'
    >
      <div className='p-6 flex flex-col items-center text-center'>
        <div className='text-5xl mb-4'>{space.icon}</div>
        <h3 className='font-semibold text-gray-800 text-lg mb-2'>{space.name}</h3>
        <div className='flex items-center gap-1 text-sm text-gray-500 mb-3'>
          <Clock className='w-3.5 h-3.5' />
          <span>最近：{formatDate(space.updatedAt)}</span>
        </div>
        {space.noteCount !== undefined && (
          <div className='text-sm text-gray-400'>{space.noteCount} 张便签</div>
        )}
      </div>
    </motion.div>
  )
}
