import { Search } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SortByType } from '@/types/tags'
import { SORT_OPTIONS } from '@/types/tags'

interface TagFilterProps {
  onSearchChange?: (term: string) => void
  onSelectCategory?: (category: 'all' | string) => void
  onSortChange?: (sortBy: SortByType) => void
}

export function TagFilter({ onSearchChange, onSelectCategory, onSortChange }: TagFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all')
  const [sortBy, setSortBy] = useState<SortByType>('date-desc')

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    onSearchChange?.(term)
  }

  const handleSelectCategory = (category: 'all' | string) => {
    setSelectedCategory(category)
    onSelectCategory?.(category)
  }

  const handleSortChange = (newSortBy: SortByType) => {
    setSortBy(newSortBy)
    onSortChange?.(newSortBy)
  }

  return (
    <div className='border-cream-200 mb-6 p-4'>
      <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
        <div className='w-full md:w-64 relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-warmGray-400' />
          <Input
            placeholder='搜索便签...'
            value={searchTerm}
            onChange={e => handleSearchChange(e.target.value)}
            className='pl-10 border-warmGray-300 focus:border-honey-400'
          />
        </div>

        <div className='flex gap-4 w-full md:w-auto'>
          <Select
            value={selectedCategory}
            onValueChange={value => handleSelectCategory(value as 'all' | string)}
          >
            <SelectTrigger className='w-32 border-warmGray-300 focus:border-honey-400'>
              <SelectValue placeholder='分类' />
            </SelectTrigger>
            <SelectContent className='bg-white border-honey-200 shadow-warm-sm min-w-(--radix-select-trigger-width)'>
              <SelectItem value='all'>全部</SelectItem>
              <SelectItem value='storage'>收纳分类</SelectItem>
              <SelectItem value='todo'>待办事项</SelectItem>
              <SelectItem value='other'>其他</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={value => handleSortChange(value as SortByType)}>
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
