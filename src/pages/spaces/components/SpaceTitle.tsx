import { Archive } from 'lucide-react'
import type { Room, Storage } from '@/types/spaces'
import { AddSpaceDrawer } from './AddSpaceDrawer'

interface SpaceTitleProps {
  onAddRoom: (room: Room) => void
  onAddStorage: (storage: Storage) => void
  rooms: Room[]
}

export function SpaceTitle({ onAddRoom, onAddStorage, rooms }: SpaceTitleProps) {
  return (
    <div className='flex items-center justify-between mb-8'>
      <div className='flex items-center space-x-4'>
        <div className='w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center'>
          <Archive className='w-8 h-8 text-pink-600' />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-warmGray-600 mb-2'>家庭空间</h1>
          <p className='text-warmGray-400'>每个空间都承载着生活的美好</p>
        </div>
      </div>
      <AddSpaceDrawer onAddRoom={onAddRoom} onAddStorage={onAddStorage} rooms={rooms} />
    </div>
  )
}
