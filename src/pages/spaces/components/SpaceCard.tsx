import { Clock } from 'lucide-react'
import { useNavigate } from 'react-router'
import type { Space } from '@/types/spaces'

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

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={() => navigate('/tags')}
      onKeyDown={e => e.key === 'Enter' && navigate('/tags')}
      className='group bg-white rounded-lg shadow-sm border border-border p-6 text-center
                 cursor-pointer transition-all duration-300 select-none
                 hover:shadow-lg hover:-translate-y-1 hover:border-border focus:outline-none focus:ring-2 focus:ring-coral-300 focus:ring-offset-2'
    >
      <span className='text-5xl mb-4 block'>{space.icon}</span>
      <h3 className='font-semibold text-foreground text-lg mb-2'>{space.name}</h3>
      <div className='flex items-center justify-center gap-1 text-sm text-foreground'>
        <Clock className='w-3.5 h-3.5' />
        <span>最近：{formatDate(space.updatedAt)}</span>
      </div>
      {space.noteCount !== undefined && (
        <p className='text-sm text-foreground mt-1'>{space.noteCount} 张便签</p>
      )}
    </div>
  )
}
