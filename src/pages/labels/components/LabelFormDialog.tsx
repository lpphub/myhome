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
import { LABEL_COLOR_CLASSES, type LabelFormData } from '@/types/labels'

interface LabelFormDialogProps {
  isOpen: boolean
  onClose: () => void
  initialData?: {
    label?: LabelFormData | null
    category?: string
  }
  actions: {
    addLabel: (label: LabelFormData) => void
    updateLabel?: (label: LabelFormData) => void
  }
}

export function LabelFormDialog({ isOpen, onClose, initialData, actions }: LabelFormDialogProps) {
  const resetForm = useCallback(
    (): LabelFormData => ({
      name: '',
      category: initialData?.category || 'storage',
      color: 'lemon',
      description: '',
    }),
    [initialData?.category]
  )

  const isEditing = Boolean(initialData?.label)
  const [formData, setFormData] = useState<LabelFormData>(resetForm())

  useEffect(() => {
    if (!isOpen) return
    if (initialData?.label) {
      setFormData({ ...initialData.label })
    } else {
      setFormData(resetForm())
    }
  }, [isOpen, initialData, resetForm])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    const payload: LabelFormData = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description?.trim(),
    }

    if (isEditing && actions.updateLabel) {
      actions.updateLabel(payload)
    } else {
      actions.addLabel(payload)
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
          {/* 便签名称 */}
          <div className='space-y-2'>
            <Label htmlFor='label' className='flex items-center gap-2'>
              <Tag className='w-4 h-4 text-warmGray-500' />
              便签名称 *
            </Label>
            <Input
              id='label'
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder='例如：卧室、零食等'
              className='border-warmGray-300 focus:border-honey-400'
              required
            />
          </div>

          {/* 分类选择 */}
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
                <SelectItem value='storage'>收纳分类</SelectItem>
                <SelectItem value='todo'>待办事项</SelectItem>
                <SelectItem value='other'>其他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 便签颜色 */}
          <div className='space-y-2'>
            <Label className='flex items-center gap-2'>
              <Tag className='w-4 h-4 text-warmGray-500' />
              便签颜色
            </Label>
            <div className='grid grid-cols-4 gap-2'>
              {Object.keys(LABEL_COLOR_CLASSES).map(color => (
                <button
                  key={color}
                  type='button'
                  onClick={() => setFormData({ ...formData, color })}
                  className={`h-12 rounded-lg border-2 transition-all ${
                    formData.color === color
                      ? 'border-honey-400 ring-2 ring-honey-200 ring-offset-1'
                      : 'border-transparent hover:border-honey-300'
                  } ${LABEL_COLOR_CLASSES[color].bg}`}
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

          {/* 描述 */}
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

          {/* 按钮 */}
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
