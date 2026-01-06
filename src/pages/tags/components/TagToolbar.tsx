import { Check, Plus, Search, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface TagToolbarProps {
  onAddGroup: (groupName: string) => void
  onSearch?: (keyword: string) => void
}

export const TagToolbar = ({ onAddGroup, onSearch }: TagToolbarProps) => {
  const [isAdding, setIsAdding] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [searchValue, setSearchValue] = useState('')

  const handleAddGroup = () => {
    const name = groupName.trim()
    if (!name) {
      setIsAdding(false)
      setGroupName('')
      return
    }
    onAddGroup(name)
    setGroupName('')
    setIsAdding(false)
  }

  const handleCancel = () => {
    setGroupName('')
    setIsAdding(false)
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    onSearch?.(value)
  }

  return (
    <div className='flex items-center justify-between rounded-xl px-4 min-h-18 shadow-warm-sm mb-6'>
      <div className='flex items-center gap-3 flex-1 max-w-md'>
        <Search className='w-4 h-4 text-warmGray-400 shrink-0' />
        <div className='relative flex-1'>
          <Input
            className='border-0 shadow-none focus-visible:ring-0 h-auto text-sm placeholder:text-warmGray-400 pr-8'
            placeholder='搜索便签名称'
            value={searchValue}
            onChange={e => handleSearchChange(e.target.value)}
          />
          {searchValue && (
            <button
              type='button'
              className='absolute right-2 top-1/2 -translate-y-1/2 text-warmGray-400 hover:text-warmGray-600'
              onClick={() => handleSearchChange('')}
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>
      </div>

      <div className='flex items-center gap-2'>
        {isAdding ? (
          <>
            <Input
              autoFocus
              className='w-40 h-8 text-sm'
              placeholder='请输入分组名称'
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleAddGroup()
                if (e.key === 'Escape') handleCancel()
              }}
            />
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 hover:bg-honey-200 hover:text-lemon-700'
              onClick={handleAddGroup}
            >
              <Check className='w-4 h-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 hover:bg-coral-100 hover:text-coral-600'
              onClick={handleCancel}
            >
              <X className='w-4 h-4' />
            </Button>
          </>
        ) : (
          <Button
            className='bg-linear-to-r from-honey-400 to-honey-600 text-white hover:from-honey-500 hover:to-honey-700 shadow-warm-sm'
            onClick={() => setIsAdding(true)}
          >
            <Plus className='w-4 h-4 mr-1' />
            新建分组
          </Button>
        )}
      </div>
    </div>
  )
}
