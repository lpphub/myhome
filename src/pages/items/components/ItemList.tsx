import { Camera, MapPin, Package } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Item, ViewMode } from '@/types/items'
import { ITEM_STATUS_LABELS } from '@/types/items'

interface ItemListProps {
  items: Item[]
  viewMode: ViewMode
}

export function ItemList({ items, viewMode }: ItemListProps) {
  const ItemCard = ({ item, viewMode: itemViewMode }: { item: Item; viewMode: ViewMode }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'active':
          return 'bg-lime-100 text-lime-700 border-lime-200'
        case 'inactive':
          return 'bg-amber-100 text-amber-700 border-amber-200'
        case 'lost':
          return 'bg-rose-100 text-rose-700 border-rose-200'
        case 'donated':
          return 'bg-purple-100 text-purple-700 border-purple-200'
        default:
          return 'bg-gray-100 text-gray-700 border-gray-200'
      }
    }

    if (itemViewMode === 'list') {
      return (
        <Card className='bg-white border-cream-200 item-hover'>
          <CardContent className='p-4'>
            <div className='flex items-center space-x-4'>
              <div className='w-14 h-14 rounded-lg flex items-center justify-center text-3xl bg-cream-50'>
                📦
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center space-x-2 mb-1'>
                  <h3 className='font-semibold text-warmGray-800 truncate'>{item.name}</h3>
                  <Badge className={`text-xs border ${getStatusColor(item.status)}`}>
                    {ITEM_STATUS_LABELS[item.status]}
                  </Badge>
                </div>
                <p className='text-sm text-warmGray-600 truncate'>
                  {item.description || '暂无描述'}
                </p>
                <div className='flex items-center space-x-4 mt-2 text-xs text-warmGray-500'>
                  <span className='flex items-center'>
                    <Package className='w-3 h-3 mr-1' />
                    数量: {item.quantity}
                  </span>
                  <span className='flex items-center'>
                    <MapPin className='w-3 h-3 mr-1' />
                    {item.location || '未设置位置'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className='bg-white border-cream-200 cursor-pointer card-hover'>
        <CardContent className='p-4'>
          <div className='flex flex-col h-full'>
            <div className='flex items-start justify-between mb-3'>
              <div className='w-14 h-14 rounded-lg flex items-center justify-center text-3xl bg-cream-50'>
                📦
              </div>
              <Badge className={`text-xs border ${getStatusColor(item.status)}`}>
                {ITEM_STATUS_LABELS[item.status]}
              </Badge>
            </div>

            <h3 className='font-semibold text-warmGray-800 mb-2 line-clamp-2'>{item.name}</h3>

            <p className='text-sm text-warmGray-600 mb-3 line-clamp-2 flex-1'>
              {item.description || '暂无描述'}
            </p>

            <div className='flex items-center justify-between text-xs text-warmGray-500 pt-2 border-t border-cream-200'>
              <span className='flex items-center'>
                <Package className='w-3 h-3 mr-1' />
                {item.quantity}
              </span>
              <span className='flex items-center'>
                <MapPin className='w-3 h-3 mr-1' />
                {item.location || '未设置位置'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (items.length === 0) {
    return (
      <Card className='border-cream-200'>
        <CardContent className='text-center py-16 text-warmGray-500'>
          <Camera className='w-20 h-20 mx-auto mb-4 opacity-50' />
          <p className='text-lg font-medium mb-2'>暂无物品</p>
          <p className='text-sm'>点击右上角按钮添加你的第一个物品</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div
      className={
        viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'
      }
    >
      {items.map(item => (
        <ItemCard key={item.id} item={item} viewMode={viewMode} />
      ))}
    </div>
  )
}
