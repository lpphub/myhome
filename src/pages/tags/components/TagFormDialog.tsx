import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
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
import { type Group, TAG_COLOR_CLASSES, type TagFormData } from '@/types/tags'

export const tagSchema = z.object({
  name: z.string().min(1, '请输入便签名称').max(20),
  group: z.string().min(1, '请选择分组'),
  color: z.enum(['lemon', 'coral', 'lavender', 'honey', 'cream', 'macaron-pink', 'mint-green']),
  description: z.string().optional(),
})

export type TagFormValues = z.infer<typeof tagSchema>

interface TagFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: TagFormData) => void
  initialData?: TagFormData
  groups: Group[]
}

export const TagFormDialog = ({ open, onClose, initialData, groups, onSubmit }: TagFormProps) => {
  const defaultValues: TagFormValues = {
    name: '',
    group: 'default',
    color: 'lemon',
    description: '',
  }

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues,
  })

  /* ---------- 编辑态注入默认值 ---------- */
  const isEditing = Boolean(initialData?.id)

  useEffect(() => {
    if (!open) return

    form.reset(
      initialData
        ? {
            name: initialData.name,
            group: initialData.group,
            color: initialData.color as TagFormValues['color'],
            description: initialData.description ?? '',
          }
        : defaultValues
    )
  }, [open, initialData, form])

  /* ---------- submit ---------- */
  const handleSubmit = (values: TagFormValues) => {
    onSubmit({
      id: initialData?.id,
      name: values.name.trim(),
      group: values.group,
      color: values.color,
      description: values.description?.trim(),
    })

    handleClose()
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={open => {
        if (!open) handleClose()
      }}
    >
      <DialogContent
        onOpenAutoFocus={e => e.preventDefault()}
        className='sm:max-w-md bg-white border-honey-200 rounded-lg max-h-[90vh] overflow-y-auto'
      >
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-foreground'>
            {isEditing ? '编辑便签' : '添加新便签'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? '修改便签信息' : '创建一个新的分类便签'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 mt-4'>
          <div className='space-y-2'>
            <Label htmlFor='tag' className='flex items-center gap-2'>
              便签名称 *
            </Label>
            <Input
              id='tag'
              autoFocus
              placeholder='例如：卧室、零食等'
              {...form.register('name')}
              className={
                form.formState.errors.name
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-border focus:border-honey-400'
              }
            />
            {form.formState.errors.name && (
              <p className='text-sm text-coral-500'>{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='group' className='flex items-center gap-2'>
              分组 *
            </Label>
            <Controller
              name='group'
              control={form.control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isEditing}>
                  <SelectTrigger>
                    <SelectValue placeholder='选择分组' />
                  </SelectTrigger>
                  <SelectContent className='bg-white border-honey-200 shadow-sm w-64'>
                    {groups.map(g => (
                      <SelectItem key={g.code} value={g.code}>
                        {g.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.group && (
              <p className='text-sm text-coral-500'>{form.formState.errors.group.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label>便签颜色</Label>
            <Controller
              name='color'
              control={form.control}
              render={({ field }) => (
                <div className='grid grid-cols-4 gap-2'>
                  {Object.entries(TAG_COLOR_CLASSES).map(([color]) => (
                    <button
                      key={color}
                      type='button'
                      onClick={() => field.onChange(color)} // ✅ 正确触发 onChange
                      className={`h-12 rounded-lg border transition-all ${
                        field.value === color
                          ? 'border-honey-400 ring-1 ring-honey-200' // ✅ 选中状态
                          : 'border-transparent hover:border-honey-300'
                      } ${TAG_COLOR_CLASSES[color].classes}`}
                    >
                      {field.value === color && (
                        <svg
                          className='w-6 h-6 mx-auto text-current opacity-60'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                          aria-hidden='true'
                        >
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
              )}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description' className='flex items-center gap-2'>
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
                  : 'border-border focus:ring-honey-200 resize-none'
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
              className='flex-1 border-honey-200 text-foreground hover:bg-honey-50'
            >
              取消
            </Button>
            <Button
              type='submit'
              disabled={form.formState.isSubmitting}
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
