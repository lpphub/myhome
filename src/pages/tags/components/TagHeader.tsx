import { Plus, Tag as TagIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Tag } from '@/types/tags'
import { AddTagDialog } from './AddTagDialog'

interface TagHeaderProps {
  onAddTag: (tag: Tag) => void
}

export function TagHeader({ onAddTag }: TagHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='flex items-center justify-between mb-8'>
      <div className='flex items-center space-x-4'>
        <div className='w-16 h-16 bg-lavender-100 rounded-2xl flex items-center justify-center'>
          <TagIcon className='w-8 h-8 text-lavender-600' />
        </div>
        <div>
          <h1 className='text-3xl font-bold text-warmGray-600 mb-2'>便签墙</h1>
          <p className='text-warmGray-400'>让收纳更加井井有条</p>
        </div>
      </div>

      <div className='flex items-center gap-3'>
        <Button
          onClick={() => setIsOpen(true)}
          className='bg-linear-to-r from-honey-400 to-honey-600 text-white hover:from-honey-500 hover:to-honey-700 shadow-warm-sm'
        >
          <Plus className='w-4 h-4 mr-1' />
          添加便签
        </Button>
        <AddTagDialog open={isOpen} onOpenChange={setIsOpen} onAddTag={onAddTag} />
      </div>
    </div>
  )
}
