import { Clock, Crown, Edit2, Handshake, Pin, Tag, Users } from 'lucide-react'
import { useCallback } from 'react'
import type { useNavigate } from 'react-router'
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
  currentUserId: number
  onEdit: (space: Space) => void
  onOpenMemberDialog: (space: Space) => void
  onTogglePin: (id: number) => void
  navigateTo: ReturnType<typeof useNavigate>
}

export function SpaceCard({
  space,
  currentUserId,
  onEdit,
  onTogglePin,
  onOpenMemberDialog,
  navigateTo,
}: SpaceCardProps) {
  const isOwner = currentUserId === space.owner
  const isPinned = space.pin

  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onEdit(space)
    },
    [onEdit, space]
  )

  const handleTogglePin = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onTogglePin(space.id)
    },
    [onTogglePin, space.id]
  )

  const handleOpenMembers = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onOpenMemberDialog(space)
    },
    [onOpenMemberDialog, space]
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
      {/* 右上按钮 */}
      <div className='absolute top-4 right-4 flex gap-2 z-20'>
        <button
          type='button'
          onClick={handleEdit}
          className='p-1.5 rounded-full bg-gray-100 text-gray-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-gray-200 transition-all'
          title='编辑'
        >
          <Edit2 className='w-4 h-4 text-primary' />
        </button>
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

      {/* 左上标识 */}
      <div className='absolute top-4 left-4 z-20'>
        {isOwner ? (
          <Crown className='w-5 h-5 text-yellow-500 bg-white rounded-full p-0.5 shadow-sm' />
        ) : (
          <Handshake className='w-5 h-5 text-primary bg-white rounded-full p-0.5 shadow-sm' />
        )}
      </div>

      {/* 图标 + 名称 */}
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

      {/* 标签 / 更新时间 / 成员 */}
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
            onClick={handleOpenMembers}
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
