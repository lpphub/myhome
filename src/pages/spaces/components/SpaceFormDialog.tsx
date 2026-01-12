import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SPACE_ICONS, type Space, type SpaceForm } from '@/types/spaces'

export const spaceSchema = z.object({
  name: z.string().min(1, '请输入空间名称').max(20),
  icon: z.string(),
  description: z.string().optional(),
})

export type SpaceFormValues = z.infer<typeof spaceSchema>

interface SpaceFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: SpaceForm) => void
  initialData?: Space
  onDelete?: (id: number) => void
}

export const SpaceFormDialog = ({
  open,
  onClose,
  initialData,
  onSubmit,
  onDelete,
}: SpaceFormDialogProps) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  const form = useForm<SpaceFormValues>({
    resolver: zodResolver(spaceSchema),
  })

  /* ---------- 编辑态判断 ---------- */
  const isEditing = Boolean(initialData?.id)

  /* ---------- 编辑态注入默认值 ---------- */
  useEffect(() => {
    if (!open) return

    form.reset({
      name: initialData?.name ?? '',
      icon: initialData?.icon ?? '🏠',
      description: initialData?.description ?? '',
    })
  }, [open, initialData, form])

  /* ---------- submit ---------- */
  const handleSubmit = (values: SpaceFormValues) => {
    onSubmit({
      id: initialData?.id,
      name: values.name.trim(),
      icon: values.icon,
      description: values.description?.trim(),
    })
  }

  const handleDeleteConfirm = () => {
    if (initialData?.id && onDelete) {
      onDelete(initialData.id)
      setShowDeleteAlert(false)
      onClose()
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={open => {
          if (!open) onClose()
        }}
      >
        <DialogContent
          onOpenAutoFocus={e => e.preventDefault()}
          className='sm:max-w-md bg-white border-honey-200 rounded-lg max-h-[90vh] overflow-y-auto'
        >
          <DialogTrigger onClick={e => e.currentTarget.blur()} />
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold text-foreground'>
              {isEditing ? '编辑空间' : '新建空间'}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? '修改空间信息' : '创建一个新的生活空间'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 mt-4'>
            <div className='space-y-2'>
              <Label htmlFor='name' className='flex items-center gap-2'>
                空间名称 *
              </Label>
              <Input
                id='name'
                autoFocus
                placeholder='输入空间名称'
                {...form.register('name')}
                className={
                  form.formState.errors.name
                    ? 'border-red-500 ring-1 ring-red-500'
                    : 'border-border focus:border-coral-400'
                }
              />
              {form.formState.errors.name && (
                <p className='text-sm text-coral-500'>{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label>选择图标 *</Label>
              <Controller
                name='icon'
                control={form.control}
                render={({ field }) => (
                  <div className='grid grid-cols-10 gap-2'>
                    {SPACE_ICONS.map(icon => (
                      <button
                        key={icon}
                        type='button'
                        onClick={() => field.onChange(icon)}
                        className={`w-9 h-9 rounded-lg text-xl flex items-center justify-center transition-all ${
                          field.value === icon
                            ? 'bg-coral-100 ring-1 ring-coral-300 scale-110'
                            : 'hover:bg-muted-background'
                        }`}
                      >
                        {icon}
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
                placeholder='添加空间描述...'
                rows={3}
                {...form.register('description')}
                className={
                  form.formState.errors.description
                    ? 'border-red-500 ring-1 ring-red-500 scrollbar-hide'
                    : 'border-border focus:border-coral-400 resize-none field-sizing-fixed! scrollbar-hide'
                }
              />
              {form.formState.errors.description && (
                <p className='text-sm text-coral-500'>
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className='flex gap-2 pt-2'>
              {isEditing && onDelete && (
                <Button
                  type='button'
                  variant='ghost'
                  onClick={() => setShowDeleteAlert(true)}
                  className='flex-1 text-red-500 hover:text-red-600 hover:bg-red-50'
                >
                  <Trash2 className='w-4 h-4 mr-1.5' />
                  删除空间
                </Button>
              )}
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                className='flex-1 border-honey-300 text-foreground hover:bg-honey-100'
              >
                取消
              </Button>
              <Button
                type='submit'
                disabled={form.formState.isSubmitting}
                className='flex-1 bg-primary/80 hover:bg-primary text-white transition-all'
              >
                {isEditing ? '保存修改' : '创建空间'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className='max-w-md'>
          <AlertDialogHeader>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-red-100'>
                <AlertCircle className='h-5 w-5 text-red-600' />
              </div>
              <AlertDialogTitle className='text-lg'>确认删除空间？</AlertDialogTitle>
            </div>
            <AlertDialogDescription className='ml-13 pl-2'>
              此操作无法撤销，空间内的所有便签也将被删除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='border-honey-300 text-foreground hover:bg-honey-100'>
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className='bg-red-500 hover:bg-red-600 text-white'
            >
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
