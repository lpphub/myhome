import { useState } from 'react'
import { MoreHorizontal, Edit2, Trash2, Copy } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import type { Tag } from '@/types/space'

interface TagCardProps {
  tag: Tag
}

const ROTATIONS = [-1.5, 1, -0.5, 0.5, 1.5, -1, 0, -0.5] as const

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  yellow: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-200/50',
    text: 'text-yellow-800',
    dot: 'bg-yellow-500',
  },
  sky: { bg: 'bg-sky-100', border: 'border-sky-200/50', text: 'text-sky-800', dot: 'bg-sky-500' },
  mint: {
    bg: 'bg-emerald-100',
    border: 'border-emerald-200/50',
    text: 'text-emerald-800',
    dot: 'bg-emerald-500',
  },
  rose: {
    bg: 'bg-rose-100',
    border: 'border-rose-200/50',
    text: 'text-rose-800',
    dot: 'bg-rose-500',
  },
  violet: {
    bg: 'bg-violet-100',
    border: 'border-violet-200/50',
    text: 'text-violet-800',
    dot: 'bg-violet-500',
  },
  orange: {
    bg: 'bg-orange-100',
    border: 'border-orange-200/50',
    text: 'text-orange-800',
    dot: 'bg-orange-500',
  },
  gray: {
    bg: 'bg-zinc-100',
    border: 'border-zinc-200/50',
    text: 'text-zinc-800',
    dot: 'bg-zinc-500',
  },
}

export function TagCard({ tag }: TagCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const colors = COLOR_MAP[tag.color] || COLOR_MAP.yellow
  const rotation = ROTATIONS[tag.id.charCodeAt(tag.id.length - 1) % ROTATIONS.length]

  const formatDate = (date: string) => {
    const d = new Date(date)
    return `${d.getMonth() + 1}/${d.getDate()}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, rotate: rotation * 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ rotate: rotation * 0.5 }}
      className={cn(
        'relative group bg-white rounded-sm shadow-md transition-all duration-300',
        'hover:shadow-xl hover:-translate-y-1',
        colors.bg,
        colors.border,
        isMenuOpen && 'ring-2 ring-coral-300'
      )}
    >
      <div className='p-4 relative'>
        <div
          className={cn(
            'absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-white/30 via-white/50 to-white/30 rounded-t-sm'
          )}
        />

        <div className='flex items-start justify-between gap-2 mb-2'>
          <h4 className={cn('font-medium text-base leading-snug', colors.text)}>{tag.title}</h4>
          <div className='relative'>
            <button
              type='button'
              onClick={e => {
                e.stopPropagation()
                setIsMenuOpen(!isMenuOpen)
              }}
              className={cn(
                'p-1 rounded transition-all',
                isHovered || isMenuOpen ? 'opacity-100' : 'opacity-0',
                'hover:bg-black/5 text-warmGray-400 hover:text-warmGray-600'
              )}
            >
              <MoreHorizontal className='w-4 h-4' />
            </button>

            <AnimatePresence>
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
                    exit={{ opacity: 0, scale: 0.95 }}
                    className='absolute right-0 top-full mt-1 w-28 bg-white rounded-lg shadow-lg border border-warmGray-200 py-1 z-20'
                  >
                    <button
                      type='button'
                      onClick={e => {
                        e.stopPropagation()
                        setIsMenuOpen(false)
                      }}
                      className='w-full flex items-center gap-2 px-3 py-1.5 text-xs text-warmGray-700 hover:bg-warmGray-50'
                    >
                      <Edit2 className='w-3.5 h-3.5' />
                      编辑
                    </button>
                    <button
                      type='button'
                      onClick={e => {
                        e.stopPropagation()
                        setIsMenuOpen(false)
                      }}
                      className='w-full flex items-center gap-2 px-3 py-1.5 text-xs text-warmGray-700 hover:bg-warmGray-50'
                    >
                      <Copy className='w-3.5 h-3.5' />
                      复制
                    </button>
                    <button
                      type='button'
                      onClick={e => {
                        e.stopPropagation()
                        setIsMenuOpen(false)
                      }}
                      className='w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50'
                    >
                      <Trash2 className='w-3.5 h-3.5' />
                      删除
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {tag.content && (
          <p className={cn('text-sm leading-relaxed opacity-80 mb-3', colors.text)}>
            {tag.content}
          </p>
        )}

        <div className={cn('flex items-center justify-between')}>
          <div className='flex items-center gap-1.5'>
            <span className={cn('w-2 h-2 rounded-full', colors.dot)} />
            <span className={cn('text-xs opacity-60', colors.text)}>
              {formatDate(tag.createdAt)}
            </span>
          </div>
        </div>

        <div
          className={cn(
            'absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/10 rounded-full blur-[1px]',
            colors.dot
          )}
        />
      </div>
    </motion.div>
  )
}
