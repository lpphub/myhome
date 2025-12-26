import { Filter, LayoutGrid, List, Search, Tag } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SortByType, ViewMode } from '@/types/items'
import { SORT_OPTIONS } from '@/types/items'

interface ItemFilterProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedStatus: string
  onSelectStatus: (status: string) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  sortBy: SortByType
  onSortChange: (sortBy: SortByType) => void
  tags: Array<{ id: string; name: string }>
  selectedTags: string[]
  onTagToggle: (tag: string) => void
}

export function ItemFilter({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onSelectStatus,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  tags,
  selectedTags,
  onTagToggle,
}: ItemFilterProps) {
  return (
    <div className='border-cream-200 mb-6 p-4'>
      <div className='flex flex-col md:flex-row gap-4 items-center'>
        <div className='flex-1 w-full md:w-auto relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-warmGray-400' />
          <Input
            placeholder='搜索物品名称、描述...'
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className='pl-10 border-warmGray-300 focus:border-honey-400'
          />
        </div>

        <div className='flex gap-3 items-center'>
          <Filter className='w-4 h-4 text-warmGray-500' />
          <Select value={selectedStatus} onValueChange={onSelectStatus}>
            <SelectTrigger className='w-32 border-warmGray-300 focus:border-honey-400'>
              <SelectValue placeholder='状态' />
            </SelectTrigger>
            <SelectContent className='bg-white border-honey-200 shadow-warm-sm min-w-(--radix-select-trigger-width)'>
              <SelectItem value='all'>全部状态</SelectItem>
              <SelectItem value='active'>使用中</SelectItem>
              <SelectItem value='inactive'>闲置</SelectItem>
              <SelectItem value='lost'>丢失</SelectItem>
              <SelectItem value='donated'>已捐赠</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={onSortChange}>
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

          <div className='flex items-center border border-warmGray-300 rounded-md overflow-hidden'>
            <button
              type='button'
              onClick={() => onViewModeChange('card')}
              className={`p-2 ${viewMode === 'card' ? 'bg-honey-100 text-honey-700' : 'bg-white text-warmGray-500 hover:bg-cream-50'}`}
            >
              <LayoutGrid className='w-4 h-4' />
            </button>
            <button
              type='button'
              onClick={() => onViewModeChange('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-honey-100 text-honey-700' : 'bg-white text-warmGray-500 hover:bg-cream-50'}`}
            >
              <List className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>

      {/* Tag Filters */}
      <div className='mt-4 pt-4 border-t border-cream-200'>
        <p className='text-sm text-warmGray-600 mb-3 flex items-center'>
          <Tag className='w-4 h-4 mr-2' />
          按标签筛选:
        </p>
        <div className='flex flex-wrap gap-2'>
          {tags.slice(0, 8).map(tag => (
            <button
              type='button'
              key={tag.id}
              onClick={() => onTagToggle(tag.name)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-all duration-200 ${
                selectedTags.includes(tag.name)
                  ? 'bg-honey-100 text-honey-700 border-honey-300'
                  : 'bg-white text-warmGray-600 border-cream-300 hover:border-honey-300 hover:bg-honey-50'
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
