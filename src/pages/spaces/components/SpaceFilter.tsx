import { Search, Tag } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SortType } from '@/types/spaces'

const SORT_OPTIONS: Array<{ value: SortType; label: string }> = [
  { value: 'utilization-desc', label: '利用率 高-低' },
  { value: 'utilization-asc', label: '利用率 低-高' },
  { value: 'count-desc', label: '物品数量 多-少' },
  { value: 'count-asc', label: '物品数量 少-多' },
  { value: 'name-asc', label: '名称 A-Z' },
  { value: 'name-desc', label: '名称 Z-A' },
  { value: 'date-desc', label: '最新整理' },
  { value: 'date-asc', label: '最早整理' },
]

interface SpaceFilterProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  sortType: SortType
  onSortChange: (type: SortType) => void
  tags: Array<{ id: string; name: string }>
  selectedTags: string[]
  onTagToggle: (tag: string) => void
}

export function SpaceFilter({
  searchTerm,
  onSearchChange,
  sortType,
  onSortChange,
  tags,
  selectedTags,
  onTagToggle,
}: SpaceFilterProps) {
  return (
    <div className='border-cream-200 mb-6 p-4'>
      <div className='flex flex-col md:flex-row gap-4 items-center'>
        <div className='flex-1 w-full md:w-auto relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-warmGray-400' />
          <Input
            placeholder='搜索收纳空间...'
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className='pl-10 border-warmGray-300 focus:border-honey-400'
          />
        </div>

        <Select value={sortType} onValueChange={onSortChange}>
          <SelectTrigger className='w-40 border-warmGray-300 focus:border-honey-400'>
            <SelectValue placeholder='排序' />
          </SelectTrigger>
          <SelectContent className='bg-white border-honey-200 shadow-warm-sm min-w-(--radix-select-trigger-width)'>
            {SORT_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tag Filters */}
      <div className='mt-4 pt-4 border-t border-almond-200'>
        <p className='text-sm text-gray-600 mb-3 flex items-center'>
          <Tag className='w-4 h-4 mr-2' />
          按标签筛选:
        </p>
        <div className='flex flex-wrap gap-2'>
          {tags.slice(0, 8).map(tag => (
            <button
              type='button'
              key={tag.id}
              onClick={() => onTagToggle(tag.name)}
              className={`px-3 py-2 text-sm rounded-xl border transition-all duration-200 ${
                selectedTags.includes(tag.name)
                  ? 'bg-linear-to-r from-coral-100 to-coral-200 text-coral-700 border-coral-300 shadow-sm'
                  : 'bg-white/80 text-gray-600 border-almond-200 hover:border-coral-300 hover:bg-coral-50'
              }`}
            >
              #{tag.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
