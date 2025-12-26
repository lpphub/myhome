import { Archive, Clock, Edit2, Package } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { Storage } from '@/types/spaces'
import { STORAGE_TYPE_LABELS } from '@/types/spaces'

interface StorageListProps {
  storages: Storage[]
}

export function StorageList({ storages }: StorageListProps) {
  const StorageCard = ({ point }: { point: Storage }) => {
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
      if (utilization < 70) return '#a3e01f' // lemon
      if (utilization < 85) return '#dfaa50' // honey
      return '#ff7250' // coral
    }

    const getUtilizationTextColor = (utilization: number) => {
      if (utilization < 70) return 'text-lemon-700'
      if (utilization < 85) return 'text-honey-700'
      return 'text-coral-700'
    }

    return (
      <Card
        className='bg-linear-to-br from-honey-50 to-coral-50 border-cream-400 shadow-soft card-hover cursor-pointer relative overflow-hidden group'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className='p-4'>
          <div className='flex items-start justify-between mb-3'>
            <div className='flex-1'>
              <div className='flex items-center gap-2 mb-1'>
                <Package className='w-5 h-5 text-warmGray-600' />
                <h3 className='font-semibold text-warmGray-800'>{point.name}</h3>
              </div>
              <Badge variant='outline' className='text-xs'>
                {STORAGE_TYPE_LABELS[point.type]}
              </Badge>
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-warmGray-600'>
                {point.itemCount} / {point.capacity}
              </span>
              <span className={`font-medium ${getUtilizationTextColor(point.utilization)}`}>
                {point.utilization}%
              </span>
            </div>

            <Progress
              value={point.utilization}
              className='h-2'
              indicatorColor={getUtilizationColor(point.utilization)}
            />
          </div>

          <div className='flex items-center gap-2 mt-3 text-xs text-warmGray-600'>
            <Clock className='w-3 h-3' />
            <span>距离上次整理：{formatLastOrganized(point.lastOrganized)}</span>
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
        <div className='flex items-center space-x-3 mb-4'>
          <Archive className='w-5 h-5 text-warmGray-600' />
          <div>
            <h3 className='text-lg font-semibold text-warmGray-800'>收纳空间</h3>
            <p className='text-sm text-warmGray-500 mt-1'>{storages.length} 个收纳点</p>
          </div>
        </div>
        {storages.length === 0 ? (
          <div className='text-center py-12 text-warmGray-500'>
            <Archive className='w-16 h-16 mx-auto mb-4 opacity-50' />
            <p>还没有收纳空间</p>
            <p className='text-sm'>点击右上角按钮添加吧</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {storages.map(storage => (
              <StorageCard key={storage.id} point={storage} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
