import { ChevronDown, List, Plus } from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useClickOutside } from '@/hooks'
import { cn } from '@/lib/utils'
import { useSpaceId } from '@/pages/spaces/hooks/useSpaceLocal'
import { useSpaceQuery } from '@/pages/spaces/hooks/useSpaces'
import type { Space } from '@/types/spaces'
import { getInitial } from '@/utils/string'

interface SpaceSwitcherProps {
  currentSpace?: Space
  onCreateSpace?: () => void
}

export function SpaceSwitcher({ currentSpace, onCreateSpace }: SpaceSwitcherProps) {
  const navigate = useNavigate()
  const { setSpaceId } = useSpaceId()
  const { data: spaces } = useSpaceQuery()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useClickOutside(ref, () => setIsOpen(false), isOpen)

  const handleSelect = (space: Space) => {
    setSpaceId(space.id)
    navigate('/tags')
    setIsOpen(false)
  }

  const handleCreateSpace = () => {
    setIsOpen(false)
    onCreateSpace?.()
  }

  const handleViewSpaces = () => {
    setIsOpen(false)
    navigate('/spaces')
  }

  return (
    <div ref={ref} className='relative'>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors text-muted-foreground hover:text-coral-400 cursor-pointer'
        )}
      >
        <span className='text-sm max-w-24 truncate'>{currentSpace?.name || '选择空间'}</span>
        <ChevronDown className={cn('w-3 h-3 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className='absolute top-full right-0 mt-2 w-30 rounded-lg bg-white border border-honey-200 shadow-lg transition-all z-80'>
          <div className='p-0'>
            {spaces?.map(space => (
              <button
                type='button'
                key={space.id}
                onClick={() => handleSelect(space)}
                className={cn(
                  'w-full flex items-center px-3 py-2 text-xs transition-colors rounded-md',
                  space.id === currentSpace?.id
                    ? 'bg-coral-50 text-coral-700'
                    : 'hover:bg-red-50/50'
                )}
              >
                <span className='w-4 h-4 rounded-full bg-honey-100 flex items-center justify-center text-xs text-coral-400'>
                  {getInitial(space.name)}
                </span>
                <span className='flex-1 truncate'>{space.name}</span>
              </button>
            ))}

            <button
              type='button'
              onClick={handleViewSpaces}
              className='w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors'
            >
              <List className='w-4 h-4' /> 空间列表
            </button>

            <button
              type='button'
              onClick={handleCreateSpace}
              className='w-full flex items-center gap-2 px-3 py-2 text-sm text-coral-600 hover:bg-coral-50 rounded-md transition-colors'
            >
              <Plus className='w-4 h-4' /> 新建空间
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
