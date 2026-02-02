import { Clock, Crown, Handshake, Tag, Trash2, Users } from 'lucide-react'
import { memo, useCallback } from 'react'
import type { useNavigate } from 'react-router'
import { useAuth } from '@/hooks'
import { useDeleteSpace } from '@/pages/spaces/hooks/useSpaces'
import type { Space } from '@/types/spaces'
import { formatRelativeTime } from '@/utils/date'
import { getInitial } from '@/utils/string'

interface SpaceCardProps {
  space: Space
  onOpenMemberDialog: (space: Space) => void
  navigateTo: ReturnType<typeof useNavigate>
}

export const SpaceCard = memo(function SpaceCard({
  space,
  onOpenMemberDialog,
  navigateTo,
}: SpaceCardProps) {
  const { user } = useAuth()
  const isOwner = user?.id === space.owner
  const deleteSpace = useDeleteSpace()

  const handleOpenMembers = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onOpenMemberDialog(space)
    },
    [onOpenMemberDialog, space]
  )

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      deleteSpace.mutate(space.id)
    },
    [deleteSpace, space.id]
  )

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={() => navigateTo(`/tags?spaceId=${space.id}`)}
      onKeyDown={e => e.key === 'Enter' && navigateTo(`/tags?spaceId=${space.id}`)}
      className='group relative bg-white rounded-lg px-3 py-2
                 transition-all duration-200 ease-out select-none
                 border border-primary/20 hover:border-primary
                 shadow-[2px_2px_0_0_#ff8c4233]
                 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#ff8c4233]
                 min-h-36 flex flex-col'
    >
      <div className='absolute top-2 left-2 z-20'>
        {isOwner ? (
          <Crown className='w-3.5 h-3.5 text-yellow-500 bg-white rounded-full p-0.5 shadow-sm' />
        ) : (
          <Handshake className='w-3.5 h-3.5 text-primary bg-white rounded-full p-0.5 shadow-sm' />
        )}
      </div>

      <div className='flex items-center gap-1 mt-1.5 pr-2'>
        <div className='w-8 h-8 rounded-md bg-linear-to-br from-coral-100 to-honey-100 flex items-center justify-center shrink-0 shadow-sm'>
          <span className='text-base font-bold text-coral-600'>{getInitial(space.name)}</span>
        </div>
        <div className='flex-1 min-w-0 flex items-center'>
          <h3 className='font-medium text-foreground text-base truncate'>{space.name}</h3>
        </div>
        <button
          type='button'
          onClick={handleDelete}
          className='opacity-0 group-hover:opacity-100 ml-auto p-0.5 text-gray-400 hover:text-red-500 transition-all'
          title='删除空间'
        >
          <Trash2 className='w-3.5 h-3.5' />
        </button>
      </div>

      {space.description && (
        <p className='text-sm text-foreground/70 line-clamp-2 mt-2'>{space.description}</p>
      )}

      <div className='flex items-center justify-between mt-auto pt-2 border-t border-gray-100 gap-2'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-0.5 text-xs text-muted'>
            <Clock className='w-3 h-3' />
            <span>{formatRelativeTime(space.updatedAt)}</span>
          </div>

          {space.tagCount !== undefined && (
            <div className='flex items-center gap-0.5 text-xs text-muted'>
              <Tag className='w-3 h-3' />
              <span>{space.tagCount}</span>
            </div>
          )}
        </div>
        {space.memberCount !== undefined && (
          <button
            type='button'
            onClick={handleOpenMembers}
            className='flex items-center gap-0.5 text-xs text-muted hover:text-primary cursor-pointer'
            title='协作成员'
          >
            <Users className='w-3 h-3' />
            <span>{space.memberCount}</span>
          </button>
        )}
      </div>
    </div>
  )
})
