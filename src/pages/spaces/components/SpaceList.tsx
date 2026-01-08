import { Clock, Edit2, FileText, Plus } from 'lucide-react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router'
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

  // 3D tilt effect on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 15 // Max ~5deg rotation
    const rotateY = (centerX - x) / 15

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = ''
  }

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={() => navigate(`/tags/${space.id}`)}
      onKeyDown={e => e.key === 'Enter' && navigate(`/tags/${space.id}`)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative bg-white rounded-2xl p-6 cursor-pointer
                 transition-all duration-200 ease-out select-none overflow-hidden
                 shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                 border-2 ${colorClass?.classes.split(' ')[1]}
                 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]
                 hover:border-opacity-80
                 will-change-transform`}
    >
      {onEdit && (
        <button
          type='button'
          onClick={handleEditClick}
          className='absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200
                     transition-colors duration-200 z-20'
          title='编辑'
        >
          <Edit2 className='w-4 h-4 text-gray-600' />
        </button>
      )}

      {/* Icon container - colored background with white border effect */}
      <div className='flex justify-center mb-4'>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center
                        shadow-sm group-hover:shadow-md transition-all duration-200
                        ${colorClass?.classes.split(' ')[0]}`}
        >
          <span className='text-2xl'>{space.icon}</span>
        </div>
      </div>

      {/* Content - centered layout */}
      <div className='flex flex-col h-full'>
        <h3 className='font-semibold text-lg text-gray-800 text-center mb-2'>{space.name}</h3>

        {space.description && (
          <p className='text-sm text-gray-600 text-center line-clamp-2 mb-4'>{space.description}</p>
        )}

        {/* Meta info row - spread like CTA, pushed to bottom */}
        <div className='flex items-center justify-between text-sm mt-auto pt-2'>
          {space.tagCount !== undefined && (
            <div className='flex items-center gap-1.5 text-gray-600'>
              <FileText className='w-4 h-4' />
              <span>{space.tagCount}张</span>
            </div>
          )}
          <div className='flex items-center gap-1.5 text-gray-600'>
            <Clock className='w-4 h-4' />
            <span>{formatDate(space.updatedAt)}</span>
          </div>
        </div>
      </div>
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
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {spaces.map((space, index) => (
        <div
          key={space.id}
          className='animate-in fade-in zoom-in-95 duration-300'
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <SpaceCard space={space} onEdit={onEdit} />
        </div>
      ))}
      {/* Add Space button with matching style */}
      <button
        type='button'
        onClick={onAdd}
        className='group w-full bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                   border-2 border-dashed border-gray-200 overflow-hidden
                   transition-all duration-200 cursor-pointer
                   hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]
                   hover:border-gray-300
                   animate-in fade-in zoom-in-95'
        style={{ animationDelay: `${spaces.length * 50}ms` }}
      >
        <div className='p-6 flex flex-col items-center justify-center text-center min-h-46'>
          <div
            className='w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4
                          transition-colors group-hover:bg-gray-200'
          >
            <Plus className='w-6 h-6 text-primary' />
          </div>
          <h3 className='font-semibold text-gray-800'>新建空间</h3>
          {spaces.length === 0 && (
            <p className='text-gray-600 text-sm mt-1'>开始记录你的美好生活</p>
          )}
        </div>
      </button>
    </div>
  )
}
