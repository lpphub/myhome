import { LayoutGrid, List, Package, Search, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ViewMode } from '@/types/items'

interface FilterState {
  searchTerm: string
  onSearchChange: (term: string) => void
  tags: Array<{ id: string; name: string }>
  selectedTags: string[]
  onTagToggle: (tag: string) => void
}

interface ViewState {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

interface ItemToolbarProps {
  filter: FilterState
  view: ViewState
  onAddItem: () => void
}

export function ItemToolbar({ filter, view, onAddItem }: ItemToolbarProps) {
  return (
    <div className='border-cream-200 mb-6 py-4'>
      <div className='flex flex-col md:flex-row gap-4 items-center'>
        <div className='flex-1 w-full md:w-auto relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-warmGray-400' />
          <Input
            placeholder='搜索物品名称、描述...'
            value={filter.searchTerm}
            onChange={e => filter.onSearchChange(e.target.value)}
            className='pl-10 border-warmGray-300 focus:border-honey-400'
          />
        </div>

        <div className='flex gap-3 items-center'>
          <div className='flex items-center border border-warmGray-300 rounded-md overflow-hidden'>
            <button
              type='button'
              onClick={() => view.onViewModeChange('card')}
              className={`p-2 ${view.viewMode === 'card' ? 'bg-honey-100 text-honey-700' : 'bg-white text-warmGray-500 hover:bg-cream-50'}`}
            >
              <LayoutGrid className='w-4 h-4' />
            </button>
            <button
              type='button'
              onClick={() => view.onViewModeChange('list')}
              className={`p-2 ${view.viewMode === 'list' ? 'bg-honey-100 text-honey-700' : 'bg-white text-warmGray-500 hover:bg-cream-50'}`}
            >
              <List className='w-4 h-4' />
            </button>
          </div>

          <Button
            className='bg-linear-to-r from-honey-400 to-honey-600 text-white hover:from-honey-500 hover:to-honey-700 shadow-warm-sm'
            onClick={onAddItem}
          >
            <Package className='w-4 h-4 mr-1' />
            添加物品
          </Button>
        </div>
      </div>

      {filter.tags.length > 0 && (
        <div className='mt-4 pt-4'>
          <p className='text-sm text-gray-600 mb-3 flex items-center'>
            <Tag className='w-4 h-4 mr-2' />
            按便签筛选:
          </p>
          <div className='flex flex-wrap gap-2'>
            {filter.tags.slice(0, 8).map(tag => (
              <button
                type='button'
                key={tag.id}
                onClick={() => filter.onTagToggle(tag.name)}
                className={`px-3 py-2 text-sm rounded-xl border transition-all duration-200 ${
                  filter.selectedTags.includes(tag.name)
                    ? 'bg-linear-to-r from-coral-100 to-coral-200 text-coral-700 border-coral-300 shadow-sm'
                    : 'bg-white/80 text-gray-600 border-almond-200 hover:border-coral-300 hover:bg-coral-50'
                }`}
              >
                #{tag.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
