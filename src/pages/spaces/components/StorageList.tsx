import {
  Archive,
  ArrowUpDown,
  Calendar,
  Clock,
  Edit2,
  Hash,
  LayoutGrid,
  Package,
} from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import type { Room, SortType, Storage } from '@/types/spaces'
import { getRoomStatus, getRoomStatusColor, STORAGE_TYPE_LABELS } from '@/types/spaces'

const SORT_OPTIONS: Array<{
  type: SortType
  label: string
  icon: React.ReactNode
}> = [
  { type: 'utilization-desc', label: '利用率 ↓', icon: <LayoutGrid className='w-4 h-4' /> },
  { type: 'utilization-asc', label: '利用率 ↑', icon: <LayoutGrid className='w-4 h-4' /> },
  { type: 'count-desc', label: '物品数量 ↓', icon: <Hash className='w-4 h-4' /> },
  { type: 'count-asc', label: '物品数量 ↑', icon: <Hash className='w-4 h-4' /> },
  { type: 'name-asc', label: '名称 A-Z', icon: <ArrowUpDown className='w-4 h-4' /> },
  { type: 'name-desc', label: '名称 Z-A', icon: <ArrowUpDown className='w-4 h-4' /> },
  { type: 'date-desc', label: '最新整理', icon: <Calendar className='w-4 h-4' /> },
  { type: 'date-asc', label: '最早整理', icon: <Calendar className='w-4 h-4' /> },
]

interface StorageListProps {
  room: Room
  sortedStorages: Storage[]
  sortType: SortType
  onChangeSortType: (type: SortType) => void
}

export function StorageList({
  room,
  sortedStorages,
  sortType,
  onChangeSortType,
}: StorageListProps) {
  const SortDropdown = ({
    sortType: sortTypeValue,
    onChangeSortType: handleChangeSortType,
  }: {
    sortType: SortType
    onChangeSortType: (type: SortType) => void
  }) => {
    const currentSort = SORT_OPTIONS.find(opt => opt.type === sortTypeValue)

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='sm' className='gap-2'>
            {currentSort?.icon}
            <span className='text-sm text-muted-foreground'>{currentSort?.label}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-40'>
          <DropdownMenuLabel>排序方式</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {SORT_OPTIONS.map(option => (
            <DropdownMenuItem
              key={option.type}
              onClick={() => handleChangeSortType(option.type)}
              className={sortTypeValue === option.type ? 'bg-accent' : ''}
            >
              <span className='flex items-center gap-2'>
                {option.icon}
                {option.label}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const StorageCard = ({ point }: { point: Storage }) => {
    const [isHovered, setIsHovered] = useState(false)

    const status = getRoomStatus(point.utilization)
    const statusColor = getRoomStatusColor(status)

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
              <Badge
                variant={
                  statusColor === 'lemon' ? 'lemon' : statusColor === 'honey' ? 'honey' : 'coral'
                }
                className='text-xs'
              >
                {STORAGE_TYPE_LABELS[point.type]}
              </Badge>
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-warmGray-600'>
                {point.itemCount} / {point.capacity}
              </span>
              <span
                className={
                  statusColor === 'lemon'
                    ? 'font-medium text-lemon-700'
                    : statusColor === 'honey'
                      ? 'font-medium text-honey-700'
                      : 'font-medium text-coral-700'
                }
              >
                {point.utilization}%
              </span>
            </div>

            <Progress
              value={point.utilization}
              className='h-2'
              indicatorColor={
                statusColor === 'lemon'
                  ? '#a3e01f'
                  : statusColor === 'honey'
                    ? '#dfaa50'
                    : '#ff7250'
              }
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
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center space-x-3'>
            <Archive className='w-5 h-5 text-warmGray-600' />
            <div>
              <h3 className='text-lg font-semibold text-warmGray-800'>收纳空间</h3>
              <p className='text-sm text-warmGray-500 mt-1'>
                {room.name} · {sortedStorages.length} 个收纳点
              </p>
            </div>
          </div>
          <SortDropdown sortType={sortType} onChangeSortType={onChangeSortType} />
        </div>
        {sortedStorages.length === 0 ? (
          <div className='text-center py-12 text-warmGray-500'>
            <Archive className='w-16 h-16 mx-auto mb-4 opacity-50' />
            <p>还没有收纳空间</p>
            <p className='text-sm'>点击右上角按钮添加吧</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {sortedStorages.map(storage => (
              <StorageCard key={storage.id} point={storage} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
