import { Archive } from 'lucide-react'
import type { Storage } from '@/types/spaces'
import { AddSpaceDrawer } from './AddSpaceDrawer'

interface SpaceHeaderProps {
  onAddStorage: (storage: Storage) => void
}

export function SpaceHeader({ onAddStorage }: SpaceHeaderProps) {
  return (
    <div className='flex items-center justify-between mb-8'>
      <div className='flex items-center space-x-4'>
        <div className='w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center'>
          <Archive className='w-8 h-8 text-amber-600' />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-warmGray-600 mb-2'>家庭空间</h1>
          <p className='text-warmGray-400'>整理收纳，让生活更有序</p>
        </div>
      </div>
      <AddSpaceDrawer onAddStorage={onAddStorage} />
    </div>
  )
}
