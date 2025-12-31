import { Tag } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { TAG_COLOR_CLASSES, type Category, type TagFormData } from '@/types/tags'

interface TagFormDialogProps {
  isOpen: boolean
  onClose: () => void
  initialData: TagFormData | null
  categories: Category[]
  actions: {
    addTag: (tag: TagFormData) => void
    updateTag?: (tag: TagFormData) => void
  }
}

export function TagFormDialog({
  isOpen,
  onClose,
  initialData,
  categories,
  actions,
}: TagFormDialogProps) {
  const resetForm = useCallback(
    (): TagFormData => ({
      id: initialData?.id || 0,
      name: '',
      category: initialData?.category || 'storage',
      color: initialData?.color || 'lemon',
      description: '',
    }),
    [initialData]
  )
  const isEditing = Boolean(initialData?.id && initialData.id > 0)
  const [formData, setFormData] = useState<TagFormData>(resetForm())

  useEffect(() => {
    if (!isOpen) return
    if (initialData?.name) {
      setFormData({ ...initialData })
    } else {
      setFormData(resetForm())
    }
  }, [isOpen, initialData, resetForm])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    const payload: TagFormData = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description?.trim(),
    }

    if (isEditing && actions.updateTag) {
      actions.updateTag(payload)
    } else {
      actions.addTag(payload)
    }
    handleClose()
  }

  const handleClose = () => {
    setFormData(resetForm())
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md bg-white border-honey-200 rounded-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-warmGray-800'>
            {isEditing ? '编辑便签' : '添加新便签'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? '修改便签信息' : '创建一个新的分类便签'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4 mt-4'>
          <div className='space-y-2'>
            <Label htmlFor='tag' className='flex items-center gap-2'>
              <Tag className='w-4 h-4 text-warmGray-500' />
              便签名称 *
            </Label>
            <Input
              id='tag'
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder='例如：卧室、零食等'
              className='border-warmGray-300 focus:border-honey-400'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='category' className='flex items-center gap-2'>
              <Tag className='w-4 h-4 text-warmGray-500' />
              分类 *
            </Label>
            <Select
              value={formData.category}
              onValueChange={value => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger id='category' className='border-warmGray-300 focus:border-honey-400'>
                <SelectValue placeholder='选择分类' />
              </SelectTrigger>
              <SelectContent className='bg-white border-honey-200 shadow-warm-sm w-64'>
                {categories.map(category => (
                  <SelectItem key={category.code} value={category.code}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label className='flex items-center gap-2'>
              <Tag className='w-4 h-4 text-warmGray-500' />
              便签颜色
            </Label>
            <div className='grid grid-cols-4 gap-2'>
              {Object.keys(TAG_COLOR_CLASSES).map(color => (
                <button
                  key={color}
                  type='button'
                  onClick={() => setFormData({ ...formData, color })}
                  className={`h-12 rounded-lg border-2 transition-all ${
                    formData.color === color
                      ? 'border-honey-400 ring-2 ring-honey-200 ring-offset-1'
                      : 'border-transparent hover:border-honey-300'
                  } ${TAG_COLOR_CLASSES[color].bg}`}
                >
                  {formData.color === color && (
                    <svg
                      className='w-6 h-6 mx-auto text-current opacity-60'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <title>已选择</title>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description' className='flex items-center gap-2'>
              <Tag className='w-4 h-4 text-warmGray-500' />
              描述
            </Label>
            <Textarea
              id='description'
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder='可选：添加一些描述信息'
              rows={3}
              className='border-warmGray-300 focus:border-honey-400 resize-none'
            />
          </div>

          <div className='flex gap-2 pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              className='flex-1 border-honey-200 text-warmGray-700 hover:bg-honey-50'
            >
              取消
            </Button>
            <Button
              type='submit'
              disabled={!formData.name.trim()}
              className='flex-1 bg-linear-to-r from-honey-400 to-honey-500 hover:from-honey-500 hover:to-honey-600 text-white'
            >
              {isEditing ? '保存修改' : '添加便签'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
