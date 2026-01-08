import { Clock, Edit2, Plus } from 'lucide-react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { cn } from '@/lib/utils'
import { SPACE_COLOR_CLASSES, type Space } from '@/types/spaces'

interface SpaceCardProps {
  space: Space
  onEdit?: (space: Space) => void
}

function SpaceCard({ space, onEdit }: SpaceCardProps) {
  const navigate = useNavigate()
  const colorClass = SPACE_COLOR_CLASSES[space.color]

  const formatDate = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return '今天'
    if (days === 1) return '昨天'
    if (days < 7) return `${days}天前`
    if (days < 30) return `${Math.floor(days / 7)}周前`
    return `${Math.floor(days / 30)}个月前`
  }

  const handleEditClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      onEdit?.(space)
    },
    [onEdit, space]
  )

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={() => navigate(`/tags/${space.id}`)}
      onKeyDown={e => e.key === 'Enter' && navigate(`/tags/${space.id}`)}
      className={cn(
        'group relative rounded-lg shadow-sm border p-6 text-center cursor-pointer transition-all duration-300 select-none',
        'hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2',
        colorClass?.classes
      )}
      style={
        {
          '--tw-ring-color': colorClass ? `var(--color-${space.color}-300)` : undefined,
        } as React.CSSProperties
      }
    >
      {onEdit && (
        <button
          type='button'
          onClick={handleEditClick}
          className={cn(
            'absolute top-2 right-2 p-1 rounded-full bg-white/50 hover:bg-white hover:scale-110',
            'shadow-sm transition-all duration-200 z-20',
            'opacity-100 sm:opacity-0 sm:group-hover:opacity-100'
          )}
          title='编辑'
        >
          <Edit2 className='w-3 h-3 text-foreground' />
        </button>
      )}
      <span className='text-5xl mb-4 block'>{space.icon}</span>
      <h3 className='font-semibold text-foreground text-lg mb-2'>{space.name}</h3>
      <div className='flex items-center justify-center gap-1 text-sm text-foreground'>
        <Clock className='w-3.5 h-3.5' />
        <span>最近：{formatDate(space.updatedAt)}</span>
      </div>
      {space.tagCount !== undefined && (
        <p className='text-sm text-foreground mt-1'>{space.tagCount} 张便签</p>
      )}
    </div>
  )
}

interface SpaceListProps {
  spaces: Space[]
  onAdd: () => void
  onEdit?: (space: Space) => void
}

export function SpaceList({ spaces, onAdd, onEdit }: SpaceListProps) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
      {spaces.map((space, index) => (
        <div
          key={space.id}
          className='animate-in fade-in zoom-in-95 duration-300'
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <SpaceCard space={space} onEdit={onEdit} />
        </div>
      ))}
      <button
        type='button'
        onClick={onAdd}
        className='group w-full bg-white rounded-lg shadow-sm border border-border border-dashed
                   overflow-hidden transition-all duration-300 cursor-pointer
                   hover:shadow-lg hover:border-border hover:border-solid
                   animate-in fade-in zoom-in-95'
        style={{ animationDelay: `${spaces.length * 50}ms` }}
      >
        <div className='p-6 flex flex-col items-center justify-center text-center min-h-40'>
          <div className='w-16 h-16 bg-muted-background rounded-full flex items-center justify-center mb-4 transition-colors group-hover:bg-border'>
            <Plus className='w-8 h-8 text-foreground transition-colors group-hover:text-foreground' />
          </div>
          <h3 className='font-semibold text-foreground transition-colors group-hover:text-foreground'>
            新建空间
          </h3>
          {spaces.length === 0 && <p className='text-foreground text-sm'>开始记录你的美好生活</p>}
        </div>
      </button>
    </div>
  )
}
