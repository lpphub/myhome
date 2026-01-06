import { Clock, Edit2, MoreHorizontal, Trash2 } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { cn } from '@/lib/utils'
import type { Space } from '@/types/space'

interface SpaceCardProps {
  space: Space
}

const COLOR_MAP: Record<string, string> = {
  honey: 'from-honey-200 to-honey-300',
  coral: 'from-coral-200 to-coral-300',
  lavender: 'from-lavender-200 to-lavender-300',
  lemon: 'from-lemon-200 to-lemon-300',
  mint: 'from-teal-200 to-teal-300',
  cream: 'from-cream-200 to-cream-300',
  pink: 'from-pink-200 to-pink-300',
}

export function SpaceCard({ space }: SpaceCardProps) {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
      className='group relative bg-white rounded-2xl shadow-sm border border-warmGray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-warmGray-300'
    >
      <div className={cn('h-24 bg-linear-to-br', COLOR_MAP[space.color] || COLOR_MAP.honey)}>
        <div className='h-full flex items-center justify-center'>
          <span className='text-5xl'>{space.icon}</span>
        </div>
      </div>

      <div className='p-4'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <h3 className='font-semibold text-warmGray-800 text-lg mb-1'>{space.name}</h3>
            {space.description && (
              <p className='text-sm text-warmGray-500 line-clamp-1'>{space.description}</p>
            )}
          </div>
          <div className='relative'>
            <button
              type='button'
              onClick={e => {
                e.stopPropagation()
                setIsMenuOpen(!isMenuOpen)
              }}
              className='p-1.5 rounded-lg hover:bg-warmGray-100 text-warmGray-400 hover:text-warmGray-600 transition-colors opacity-0 group-hover:opacity-100'
            >
              <MoreHorizontal className='w-4 h-4' />
            </button>
            {isMenuOpen && (
              <>
                <div
                  role='button'
                  tabIndex={0}
                  className='fixed inset-0 z-10 cursor-default'
                  onClick={e => {
                    e.stopPropagation()
                    setIsMenuOpen(false)
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Escape') setIsMenuOpen(false)
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className='absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-lg border border-warmGray-200 py-1 z-20'
                >
                  <button
                    type='button'
                    onClick={e => {
                      e.stopPropagation()
                    }}
                    className='w-full flex items-center gap-2 px-3 py-2 text-sm text-warmGray-700 hover:bg-warmGray-50'
                  >
                    <Edit2 className='w-4 h-4' />
                    重命名
                  </button>
                  <button
                    type='button'
                    onClick={e => {
                      e.stopPropagation()
                    }}
                    className='w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50'
                  >
                    <Trash2 className='w-4 h-4' />
                    删除
                  </button>
                </motion.div>
              </>
            )}
          </div>
        </div>

        <div className='flex items-center gap-1 mt-3 text-xs text-warmGray-400'>
          <Clock className='w-3.5 h-3.5' />
          <span>更新于 {formatDate(space.updatedAt)}</span>
        </div>
      </div>
    </motion.div>
  )
}
