import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Group, Tag as TagType } from '@/types/space'

interface SpaceSidebarProps {
  groups: Group[]
  tags: TagType[]
  isCollapsed: boolean
  onToggle: () => void
  activeGroupId: string | null
  onGroupClick: (groupId: string) => void
}

export function SpaceSidebar({
  groups,
  tags,
  isCollapsed,
  onToggle,
  activeGroupId,
  onGroupClick,
}: SpaceSidebarProps) {
  const getGroupTagCount = (groupId: string) => {
    return tags.filter(tag => tag.groupId === groupId).length
  }

  if (isCollapsed) {
    return (
      <div className='w-14 flex-shrink-0 bg-white border-r border-warmGray-200 flex flex-col items-center py-4'>
        <button
          type='button'
          onClick={onToggle}
          className='p-2 rounded-lg hover:bg-warmGray-100 text-warmGray-500 mb-4'
        >
          <ChevronRight className='w-5 h-5' />
        </button>
        <div className='space-y-2'>
          {groups.map(group => (
            <button
              key={group.id}
              type='button'
              onClick={() => onGroupClick(group.id)}
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all',
                activeGroupId === group.id ? 'bg-coral-100' : 'hover:bg-warmGray-100'
              )}
              title={group.name}
            >
              {group.id === 'default' ? '📝' : '📁'}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.aside
      initial={{ width: 240 }}
      animate={{ width: 240 }}
      exit={{ width: 0 }}
      className='flex-shrink-0 bg-white border-r border-warmGray-200 flex flex-col'
    >
      <div className='p-4 border-b border-warmGray-200'>
        <div className='flex items-center justify-between'>
          <span className='text-sm font-medium text-warmGray-500'>导航</span>
          <button
            type='button'
            onClick={onToggle}
            className='p-1.5 rounded-lg hover:bg-warmGray-100 text-warmGray-400 hover:text-warmGray-600 transition-colors'
          >
            <ChevronLeft className='w-4 h-4' />
          </button>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto py-2'>
        <div className='px-2 space-y-1'>
          <button
            type='button'
            onClick={() => onGroupClick('all')}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
              activeGroupId === 'all'
                ? 'bg-coral-50 text-coral-700 font-medium'
                : 'text-warmGray-700 hover:bg-warmGray-50'
            )}
          >
            <Layers className='w-4 h-4' />
            <span className='flex-1 text-left'>全部便签</span>
            <span className='text-xs text-warmGray-400'>{tags.length}</span>
          </button>
        </div>

        <div className='mt-4 px-2'>
          <div className='flex items-center justify-between px-3 mb-2'>
            <span className='text-xs font-medium text-warmGray-400 uppercase tracking-wider'>
              分组
            </span>
          </div>
          <div className='space-y-1'>
            {groups.map(group => (
              <button
                key={group.id}
                type='button'
                onClick={() => onGroupClick(group.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                  activeGroupId === group.id
                    ? 'bg-coral-50 text-coral-700 font-medium'
                    : 'text-warmGray-700 hover:bg-warmGray-50'
                )}
              >
                <span className='text-base'>{group.id === 'default' ? '📝' : '📁'}</span>
                <span className='flex-1 text-left truncate'>{group.name}</span>
                <span className='text-xs text-warmGray-400'>{getGroupTagCount(group.id)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
