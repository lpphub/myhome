import { Clock, Crown, Edit2, Handshake, Pin, Plus, Tag, Users } from 'lucide-react'
import { memo, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useTogglePinSpace } from '@/pages/spaces/hooks/useSpaces'
import type { Space } from '@/types/spaces'

const formatDate = (date: string) => {
  const diff = Date.now() - new Date(date).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  return `${Math.floor(days / 30)}个月前`
}

interface SpaceCardProps {
  space: Space
  onEdit?: (space: Space) => void
  navigateTo: ReturnType<typeof useNavigate>
  togglePin: (id: number) => void
  onOpenMemberDialog?: (space: Space) => void
  currentUserId: number
}

const SpaceCard = memo(
  ({ space, onEdit, navigateTo, togglePin, onOpenMemberDialog, currentUserId }: SpaceCardProps) => {
    const isPinned = space.pin
    const isOwner = space.owner === currentUserId

    const handleShowCollaborators = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        onOpenMemberDialog?.(space)
      },
      [onOpenMemberDialog, space]
    )

    const handleTogglePin = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        togglePin(space.id)
      },
      [space.id, togglePin]
    )

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
        onClick={() => navigateTo(`/tags?spaceId=${space.id}`)}
        onKeyDown={e => e.key === 'Enter' && navigateTo(`/tags?spaceId=${space.id}`)}
        className='group relative bg-white rounded-2xl p-6
                  transition-all duration-300 ease-out select-none
                  border-2 border-primary/20 hover:border-primary
                  shadow-[6px_6px_0_0_#ff8c4233,inset_0_-4px_0_0_#00000008]
                  hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#ff8c4233,inset_0_-4px_0_0_#00000008]
                  min-h-60 flex flex-col justify-between'
      >
        <div className='absolute top-4 right-4 flex gap-2 z-20'>
          {onEdit && (
            <button
              type='button'
              onClick={handleEditClick}
              className='p-1.5 rounded-full bg-gray-100 text-gray-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-gray-200 transition-all'
              title='编辑'
            >
              <Edit2 className='w-4 h-4 text-primary' />
            </button>
          )}
          <button
            type='button'
            onClick={handleTogglePin}
            className={`p-1.5 rounded-full transition-all ${
              isPinned
                ? 'bg-secondary text-primary'
                : 'bg-gray-100 text-gray-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-gray-200'
            }`}
            title={isPinned ? '取消便签墙' : '设为便签墙'}
          >
            <Pin className='w-4 h-4 transform rotate-45' />
          </button>
        </div>

        <div className='absolute top-4 left-4 z-20'>
          {isOwner ? (
            <Crown className='w-5 h-5 text-yellow-500 bg-white rounded-full p-0.5 shadow-sm' />
          ) : (
            <Handshake className='w-5 h-5 text-primary bg-white rounded-full p-0.5 shadow-sm' />
          )}
        </div>

        <div className='flex items-start gap-4'>
          <div className='w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center shrink-0'>
            <span className='text-3xl'>{space.icon}</span>
          </div>

          <div className='flex-1 min-w-0'>
            <h3 className='font-semibold text-gray-900 text-lg mb-2'>{space.name}</h3>
          </div>
        </div>

        {space.description && (
          <p className='text-sm text-gray-600 line-clamp-2 leading-relaxed'>{space.description}</p>
        )}

        <div className='flex items-center justify-between mt-4 pt-3 border-t border-gray-100'>
          <div className='flex items-center gap-3'>
            {space.tagCount !== undefined && (
              <div className='flex items-center gap-1.5 text-sm font-medium text-gray-700'>
                <Tag className='w-4 h-4 text-primary' />
                <span className='text-primary'>{space.tagCount}</span>
              </div>
            )}
            <div className='flex items-center gap-1.5 text-sm text-gray-500'>
              <Clock className='w-4 h-4 text-primary' />
              <span className='text-primary'>{formatDate(space.updatedAt)}</span>
            </div>
          </div>
          {space.memberCount !== undefined && (
            <button
              type='button'
              onClick={handleShowCollaborators}
              className='flex items-center gap-1.5 text-sm font-medium cursor-pointer'
              title='协作成员'
            >
              <Users className='w-4 h-4 text-primary' />
              <span className='text-primary'>{space.memberCount}</span>
            </button>
          )}
        </div>
      </div>
    )
  }
)

interface SpaceListProps {
  spaces: Space[]
  onAdd: () => void
  onEdit?: (space: Space) => void
  onOpenMemberDialog?: (space: Space) => void
  currentUserId: number
}

export function SpaceList({
  spaces,
  onAdd,
  onEdit,
  onOpenMemberDialog,
  currentUserId,
}: SpaceListProps) {
  const navigate = useNavigate()
  const togglePin = useTogglePinSpace()

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {spaces.map((space, index) => {
        const delay = Math.floor(index / 5) * 50
        return (
          <div
            key={space.id}
            className='animate-in fade-in zoom-in-95 duration-300'
            style={{ animationDelay: `${delay}ms` }}
          >
            <SpaceCard
              space={space}
              onEdit={onEdit}
              navigateTo={navigate}
              togglePin={togglePin.mutate}
              onOpenMemberDialog={onOpenMemberDialog}
              currentUserId={currentUserId}
            />
          </div>
        )
      })}
      <button
        type='button'
        onClick={onAdd}
        className='group relative bg-white rounded-2xl p-6
                   border-2 border-primary/20 hover:border-primary
                   shadow-[6px_6px_0_0_#ff8c4233,inset_0_-4px_0_0_#00000008]
                   hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#ff8c4233,inset_0_-4px_0_0_#00000008]
                   overflow-hidden transition-all duration-300 ease-out cursor-pointer
                   animate-in fade-in zoom-in-95 min-h-50 flex flex-col justify-center'
        style={{ animationDelay: `${Math.floor(spaces.length / 5) * 50}ms` }}
      >
        <div className='flex flex-col items-center gap-3'>
          <div
            className='w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center
                          transition-colors group-hover:bg-gray-200'
          >
            <Plus className='w-5 h-5 text-primary' />
          </div>
          <h3 className='font-semibold text-gray-900 text-base'>新建空间</h3>
          {spaces.length === 0 && <p className='text-sm text-gray-600'>开始记录你的美好生活</p>}
        </div>
      </button>
    </div>
  )
}
