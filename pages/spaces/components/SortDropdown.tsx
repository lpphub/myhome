import { ArrowUpDown, Calendar, Hash, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSpacesStore } from '@/stores/useSpacesStore'
import type { SortType } from '@/types/spaces'

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

export function SortDropdown() {
  const { sortType, setSortType } = useSpacesStore()

  const currentSort = SORT_OPTIONS.find(opt => opt.type === sortType)

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
            onClick={() => setSortType(option.type)}
            className={sortType === option.type ? 'bg-accent' : ''}
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
