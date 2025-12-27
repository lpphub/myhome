import { Tag as TagIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
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
import type { Tag, TagCategoryCode, TagColor } from '@/types/tags'
import { TAG_COLOR_CLASSES, TAG_COLOR_LABELS } from '@/types/tags'

interface AddTagDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTag: (tag: Tag) => void
  onUpdateTag?: (tag: Tag) => void
  editingTag?: Tag | null
  defaultCategory?: TagCategoryCode
}

const PRESET_COLORS: TagColor[] = ['lemon', 'coral', 'lavender', 'honey', 'cream', 'pink', 'mint']

export function AddTagDialog({
  open,
  onOpenChange,
  onAddTag,
  onUpdateTag,
  editingTag,
  defaultCategory,
}: AddTagDialogProps) {
  const isEditing = !!editingTag
  const [label, setLabel] = useState('')
  const [category, setCategory] = useState<TagCategoryCode>('storage')
  const [color, setColor] = useState<TagColor>('lemon')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (open) {
      if (editingTag) {
        setLabel(editingTag.label)
        setCategory(editingTag.category)
        setColor(editingTag.color)
        setDescription(editingTag.description || '')
      } else if (defaultCategory) {
        setCategory(defaultCategory)
      } else {
        setLabel('')
        setCategory('storage')
        setColor('lemon')
        setDescription('')
      }
    }
  }, [open, editingTag, defaultCategory])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!label.trim()) return

    const tagData: Tag = {
      id: editingTag?.id ?? Date.now(),
      label: label.trim(),
      category,
      color,
      itemCount: editingTag?.itemCount ?? 0,
      description: description.trim() || undefined,
      createdAt: editingTag?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (isEditing && onUpdateTag) {
      onUpdateTag(tagData)
    } else {
      onAddTag(tagData)
    }
  }

  const handleClose = () => {
    setLabel('')
    setCategory('storage')
    setColor('lemon')
    setDescription('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md bg-white border-honey-200 rounded-2xl'>
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
            <Label htmlFor='label' className='flex items-center gap-2'>
              <TagIcon className='w-4 h-4 text-warmGray-500' />
              便签名称 *
            </Label>
            <Input
              id='label'
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder='例如：卧室、零食等'
              className='border-warmGray-300 focus:border-honey-400'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='category' className='flex items-center gap-2'>
              <TagIcon className='w-4 h-4 text-warmGray-500' />
              分类 *
            </Label>
            <Select value={category} onValueChange={value => setCategory(value as TagCategoryCode)}>
              <SelectTrigger id='category' className='border-warmGray-300 focus:border-honey-400'>
                <SelectValue placeholder='选择分类' />
              </SelectTrigger>
              <SelectContent className='bg-white border-honey-200 shadow-warm-sm w-64'>
                <SelectItem value='storage'>收纳分类</SelectItem>
                <SelectItem value='todo'>待办事项</SelectItem>
                <SelectItem value='other'>其他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label className='flex items-center gap-2'>
              <TagIcon className='w-4 h-4 text-warmGray-500' />
              便签颜色
            </Label>
            <div className='grid grid-cols-4 gap-2'>
              {PRESET_COLORS.map(presetColor => (
                <button
                  key={presetColor}
                  type='button'
                  onClick={() => setColor(presetColor)}
                  className={`h-12 rounded-lg border-2 transition-all ${
                    color === presetColor
                      ? 'border-honey-400 ring-2 ring-honey-200 ring-offset-1'
                      : 'border-transparent hover:border-honey-300'
                  } ${TAG_COLOR_CLASSES[presetColor].bg}`}
                  title={TAG_COLOR_LABELS[presetColor]}
                >
                  {color === presetColor && (
                    <svg
                      className='w-6 h-6 mx-auto text-current opacity-60'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      aria-hidden='true'
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
            <p className='text-xs text-warmGray-500 mt-1'>已选择: {TAG_COLOR_LABELS[color]}</p>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description' className='flex items-center gap-2'>
              <TagIcon className='w-4 h-4 text-warmGray-500' />
              描述
            </Label>
            <Textarea
              id='description'
              value={description}
              onChange={e => setDescription(e.target.value)}
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
              disabled={!label.trim()}
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
