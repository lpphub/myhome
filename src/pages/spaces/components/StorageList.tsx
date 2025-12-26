import { Archive, Clock, Edit2, Package } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { StorageSchema } from '@/types/spaces'

interface StorageListProps {
  storages: StorageSchema[]
}

export function StorageList({ storages }: StorageListProps) {
  const StorageCard = ({ point }: { point: StorageSchema }) => {
    const [isHovered, setIsHovered] = useState(false)

    const formatLastOrganized = (date?: string) => {
      if (!date) return '未整理'
      const diff = Date.now() - new Date(date).getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      if (days === 0) return '今天'
      if (days === 1) return '昨天'
      if (days < 7) return `${days}天前`
      if (days < 30) return `${Math.floor(days / 7)}周前`
      return `${Math.floor(days / 30)}个月前`
    }

    const getUtilizationColor = (utilization: number) => {
      if (utilization < 70) return '#34d399'
      if (utilization < 85) return '#fbbf24'
      return '#f87171'
    }

    const getUtilizationTextColor = (utilization: number) => {
      if (utilization < 70) return 'text-emerald-600'
      if (utilization < 85) return 'text-amber-600'
      return 'text-red-600'
    }

    return (
      <Card
        className='bg-white border-cream-200 shadow-soft card-hover cursor-pointer relative overflow-hidden group'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className='aspect-square bg-linear-to-br from-gray-50 to-gray-100 relative mx-4 mt-1 mb-0 rounded-lg'>
          {point.image ? (
            <img
              src={point.image}
              alt={point.name}
              className='w-full h-full object-cover rounded-lg'
            />
          ) : (
            <div className='flex items-center justify-center h-full'>
              <Package className='w-12 h-12 text-warmGray-400' />
            </div>
          )}
        </div>

        <CardContent className='p-4 pt-2'>
          <div className='flex items-start justify-between mb-2'>
            <div className='flex-1'>
              <h3 className='font-semibold text-warmGray-800 text-lg'>{point.name}</h3>
              {point.description && (
                <p className='text-sm text-warmGray-600 mt-1 line-clamp-2'>{point.description}</p>
              )}
            </div>
          </div>

          <div className='space-y-3'>
            <div className='flex items-center gap-3 text-xs'>
              <div className='flex items-center gap-1 whitespace-nowrap'>
                <Package className='w-3 h-3 text-warmGray-600' />
                <span className='text-warmGray-600'>{point.itemCount}</span>
              </div>
              <Progress
                value={point.utilization}
                className='h-2 flex-1'
                indicatorColor={getUtilizationColor(point.utilization)}
              />
              <span
                className={`font-medium whitespace-nowrap ${getUtilizationTextColor(point.utilization)}`}
              >
                {point.utilization}%
              </span>
            </div>

            <div className='flex items-center gap-2 text-xs text-warmGray-600'>
              <Clock className='w-3 h-3' />
              <span>距离上次整理：{formatLastOrganized(point.lastOrganized)}</span>
            </div>

            {point.tags && point.tags.length > 0 && (
              <div className='flex gap-1 flex-wrap'>
                {point.tags.map(tag => (
                  <Badge
                    key={tag}
                    variant='outline'
                    className='text-xs bg-honey-200 text-gray-600 border-gray-200'
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div
            className={`absolute top-2 right-2 flex gap-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <Button
              size='icon'
              variant='ghost'
              className='h-8 w-8'
              onClick={e => {
                e.stopPropagation()
              }}
            >
              <Edit2 className='w-4 h-4' />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card className='border-cream-200'>
      <CardContent className='p-4'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center space-x-3'>
            <Archive className='w-5 h-5 text-warmGray-600' />
            <div>
              <h3 className='text-lg font-semibold text-warmGray-800'>收纳空间</h3>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            <div className='w-3 h-3 bg-emerald-400 rounded-full' />
            <span className='text-xs text-gray-600'>宽敞</span>
            <div className='w-3 h-3 bg-amber-400 rounded-full' />
            <span className='text-xs text-gray-600'>刚好</span>
            <div className='w-3 h-3 bg-red-400 rounded-full' />
            <span className='text-xs text-gray-600'>拥挤</span>
          </div>
        </div>
        {storages.length === 0 ? (
          <div className='text-center py-12 text-warmGray-500'>
            <Archive className='w-16 h-16 mx-auto mb-4 opacity-50' />
            <p>还没有收纳空间</p>
            <p className='text-sm'>点击右上角按钮添加吧</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {storages.map(storage => (
              <StorageCard key={storage.id} point={storage} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
