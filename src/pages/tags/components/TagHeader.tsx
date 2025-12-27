import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TagHeaderProps {
  onAddTag: () => void
}

export function TagHeader({ onAddTag }: TagHeaderProps) {
  return (
    <div className='flex items-center justify-between mb-6'>
      <div>
        <h1 className='text-3xl font-bold text-warmGray-800 mb-1'>标签管理</h1>
        <p className='text-warmGray-500'>整理和分类你的所有便签</p>
      </div>
      <Button
        onClick={onAddTag}
        className='bg-linear-to-r from-honey-400 to-honey-500 hover:from-honey-500 hover:to-honey-600 text-white shadow-warm-md hover:shadow-warm-lg transition-all duration-300 flex items-center gap-2'
      >
        <Plus className='w-5 h-5' />
        添加便签
      </Button>
    </div>
  )
}
