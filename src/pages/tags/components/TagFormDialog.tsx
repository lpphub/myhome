import { zodResolver } from '@hookform/resolvers/zod'
import { Tag } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
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
import { type Category, TAG_COLOR_CLASSES, type TagFormData } from '@/types/tags'

const tagFormSchema = z.object({
  name: z.string().min(1, '请输入便签名称').max(20, '便签名称最多20个字符'),
  category: z.string().min(1, '请选择分类'),
  color: z.enum(['lemon', 'coral', 'lavender', 'honey', 'cream', 'pink', 'mint']),
  description: z.string().optional(),
})

type TagFormValues = z.infer<typeof tagFormSchema>

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

export const TagFormDialog = ({
  isOpen,
  onClose,
  initialData,
  categories,
  actions,
}: TagFormDialogProps) => {
  const isEditing = Boolean(initialData?.id && initialData.id > 0)

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      name: '',
      category: 'storage',
      color: 'lemon',
      description: '',
    },
  })

  useEffect(() => {
    if (!isOpen) return
    if (initialData) {
      form.reset({
        name: initialData.name,
        category: initialData.category,
        color: (initialData.color as TagFormValues['color']) || 'lemon',
        description: initialData.description || '',
      })
    } else {
      form.reset()
    }
  }, [isOpen, initialData, form])

  const handleClose = useCallback(() => {
    form.reset()
    onClose()
  }, [onClose, form])

  const handleSubmit = useCallback(
    (data: TagFormValues) => {
      const payload: TagFormData = {
        id: initialData?.id,
        name: data.name.trim(),
        category: data.category,
        color: data.color,
        description: data.description?.trim(),
      }

      if (isEditing && actions.updateTag) {
        actions.updateTag(payload)
      } else {
        actions.addTag(payload)
      }
      handleClose()
    },
    [initialData?.id, isEditing, actions.updateTag, actions.addTag, handleClose]
  )

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

        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 mt-4'>
          <div className='space-y-2'>
            <Label htmlFor='tag' className='flex items-center gap-2'>
              <Tag className='w-4 h-4 text-warmGray-500' />
              便签名称 *
            </Label>
            <Input
              id='tag'
              placeholder='例如：卧室、零食等'
              {...form.register('name')}
              className={
                form.formState.errors.name
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-warmGray-300 focus:border-honey-400'
              }
            />
            {form.formState.errors.name && (
              <p className='text-sm text-coral-500'>{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='category' className='flex items-center gap-2'>
              <Tag className='w-4 h-4 text-warmGray-500' />
              分类 *
            </Label>
            <Select
              value={form.watch('category')}
              onValueChange={value => form.setValue('category', value)}
              disabled={isEditing}
            >
              <SelectTrigger
                id='category'
                className={
                  form.formState.errors.category
                    ? 'border-red-500 ring-1 ring-red-500'
                    : 'border-warmGray-300 focus:border-honey-400'
                }
              >
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
            {form.formState.errors.category && (
              <p className='text-sm text-coral-500'>{form.formState.errors.category.message}</p>
            )}
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
                  onClick={() => form.setValue('color', color as TagFormValues['color'])}
                  className={`h-12 rounded-lg border transition-all ${
                    form.watch('color') === color
                      ? 'border-honey-400 ring-1 ring-honey-200'
                      : 'border-transparent hover:border-honey-300'
                  } ${TAG_COLOR_CLASSES[color].bg}`}
                >
                  {form.watch('color') === color && (
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
              placeholder='可选：添加一些描述信息'
              rows={3}
              {...form.register('description')}
              className={
                form.formState.errors.description
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-warmGray-300 focus:border-honey-400 resize-none'
              }
            />
            {form.formState.errors.description && (
              <p className='text-sm text-coral-500'>{form.formState.errors.description.message}</p>
            )}
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
              disabled={!form.formState.isValid}
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
