import { Camera } from 'lucide-react'
import type { Item } from '@/types/items'
import { AddItemDrawer } from './AddItemDrawer'

interface ItemTitleProps {
  onAddItem: (item: Item) => void
}

export function ItemTitle({ onAddItem }: ItemTitleProps) {
  return (
    <div className='flex items-center justify-between mb-8'>
      <div className='flex items-center space-x-4'>
        <div className='w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center'>
          <Camera className='w-8 h-8 text-pink-600' />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-warmGray-600 mb-2'>物品收纳</h1>
          <p className='text-warmGray-400'>记录每一个珍爱的物品</p>
        </div>
      </div>
      <AddItemDrawer onAddItem={onAddItem} />
    </div>
  )
}
