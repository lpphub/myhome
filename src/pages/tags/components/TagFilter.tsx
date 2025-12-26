import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SortByType, TagCategory } from '@/types/tags'
import { SORT_OPTIONS } from '@/types/tags'

interface TagFilterProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedCategory: TagCategory | 'all'
  onSelectCategory: (category: TagCategory | 'all') => void
  sortBy: SortByType
  onSortChange: (sortBy: SortByType) => void
}

export function TagFilter({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
}: TagFilterProps) {
  return (
    <div className='border-cream-200 mb-6 p-4'>
      <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
        <div className='w-full md:w-64 relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-warmGray-400' />
          <Input
            placeholder='搜索便签...'
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className='pl-10 border-warmGray-300 focus:border-honey-400'
          />
        </div>

        <div className='flex gap-4 w-full md:w-auto'>
          <Select value={selectedCategory} onValueChange={onSelectCategory}>
            <SelectTrigger className='w-32 border-warmGray-300 focus:border-honey-400'>
              <SelectValue placeholder='分类' />
            </SelectTrigger>
            <SelectContent className='bg-white border-honey-200 shadow-warm-sm min-w-(--radix-select-trigger-width)'>
              <SelectItem value='all'>全部</SelectItem>
              <SelectItem value='room'>房间</SelectItem>
              <SelectItem value='type'>类型</SelectItem>
              <SelectItem value='functional'>功能</SelectItem>
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
        </div>
      </div>
    </div>
  )
}
