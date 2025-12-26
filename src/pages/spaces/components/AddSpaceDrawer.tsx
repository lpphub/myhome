import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Archive, FileText, Ruler, Tag } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import type { Storage } from '@/types/spaces'
import { type AddStorageForm as AddStorageFormType, STORAGE_TYPE_LABELS } from '@/types/spaces'

const storageSchema = z.object({
  name: z.string().min(1, '请输入收纳点名称'),
  type: z.enum(['closet', 'shoe-rack', 'bookshelf', 'cabinet', 'drawer', 'hanger', 'other']),
  capacity: z.number().min(1, '请输入容量'),
  description: z.string().optional(),
  location: z.string().optional(),
})

type StorageFormData = z.infer<typeof storageSchema>

interface AddSpaceDrawerProps {
  onAddStorage: (storage: Storage) => void
}

export function AddSpaceDrawer({ onAddStorage }: AddSpaceDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const storageForm = useForm<StorageFormData>({
    resolver: zodResolver(storageSchema),
    defaultValues: {
      name: '',
      type: 'cabinet',
      capacity: 20,
      description: '',
    },
  })

  const { mutate: mutateStorage, isPending: isStoragePending } = useMutation({
    mutationFn: (data: AddStorageFormType) => {
      return Promise.resolve({
        id: Date.now().toString(),
        ...data,
        itemCount: 0,
        utilization: 0,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Storage)
    },
    onSuccess: storage => {
      onAddStorage(storage)
      toast.success('收纳空间添加成功！')
      setIsOpen(false)
      storageForm.reset()
    },
    onError: error => {
      toast.error('添加失败，请重试')
      console.error(error)
    },
  })

  const onStorageSubmit = (data: StorageFormData) => {
    mutateStorage(data as AddStorageFormType)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      storageForm.reset()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button className='bg-linear-to-r from-honey-400 to-honey-600 text-white hover:from-honey-500 hover:to-honey-700 shadow-warm-sm'>
          <Archive className='w-4 h-4 mr-1' />
          添加空间
        </Button>
      </SheetTrigger>
      <SheetContent
        side='right'
        className='w-full sm:w-130 bg-linear-to-br from-white via-cream-50/90 to-honey-50/60 border-l-honey-200!'
      >
        <SheetHeader className='border-b border-cream-200 pb-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-honey-100 rounded-lg shadow-soft'>
              <Archive className='w-5 h-5 text-honey-600' />
            </div>
            <div>
              <SheetTitle className='text-warmGray-800'>添加收纳空间</SheetTitle>
              <SheetDescription>添加收纳存放点</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={storageForm.handleSubmit(onStorageSubmit)} className='grid gap-5 py-2 px-2'>
          <div className='grid gap-3'>
            <Label htmlFor='storage-name' className='flex items-center gap-2'>
              <Archive className='w-4 h-4 text-warmGray-500' />
              收纳点名称
            </Label>
            <Input
              id='storage-name'
              placeholder='例如：衣柜、书架...'
              {...storageForm.register('name')}
              className={
                storageForm.formState.errors.name
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-warmGray-300 focus:border-honey-400'
              }
            />
            {storageForm.formState.errors.name && (
              <p className='text-sm text-coral-500'>{storageForm.formState.errors.name.message}</p>
            )}
          </div>

          <div className='grid gap-3'>
            <Label htmlFor='storage-type' className='flex items-center gap-2'>
              <Tag className='w-4 h-4 text-warmGray-500' />
              收纳类型
            </Label>
            <Select
              value={storageForm.watch('type')}
              onValueChange={value =>
                storageForm.setValue('type', value as StorageFormData['type'])
              }
            >
              <SelectTrigger className='w-full border-warmGray-300 focus:border-honey-400'>
                <SelectValue placeholder='选择收纳类型' />
              </SelectTrigger>
              <SelectContent className='bg-white border-honey-200 shadow-warm-sm min-w-(--radix-select-trigger-width)'>
                {Object.entries(STORAGE_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {storageForm.formState.errors.type && (
              <p className='text-sm text-coral-500'>{storageForm.formState.errors.type.message}</p>
            )}
          </div>

          <div className='grid gap-3'>
            <Label htmlFor='storage-capacity' className='flex items-center gap-2'>
              <Ruler className='w-4 h-4 text-warmGray-500' />
              容量
            </Label>
            <Input
              id='storage-capacity'
              type='number'
              placeholder='例如：50'
              {...storageForm.register('capacity', { valueAsNumber: true })}
              className={
                storageForm.formState.errors.capacity
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-warmGray-300 focus:border-honey-400'
              }
            />
            {storageForm.formState.errors.capacity && (
              <p className='text-sm text-coral-500'>
                {storageForm.formState.errors.capacity.message}
              </p>
            )}
          </div>

          <div className='grid gap-3'>
            <Label htmlFor='storage-description' className='flex items-center gap-2'>
              <FileText className='w-4 h-4 text-warmGray-500' />
              描述
            </Label>
            <Textarea
              id='storage-description'
              placeholder='例如：卧室左侧的衣柜，用于存放衣物...'
              {...storageForm.register('description')}
              className={
                storageForm.formState.errors.description
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-warmGray-300 focus:border-honey-400'
              }
            />
            {storageForm.formState.errors.description && (
              <p className='text-sm text-coral-500'>
                {storageForm.formState.errors.description.message}
              </p>
            )}
          </div>

          <SheetFooter className='pt-4'>
            <Button
              type='submit'
              className='w-full bg-linear-to-r from-honey-400 to-honey-600 text-white hover:from-honey-500 hover:to-honey-700 shadow-warm-sm'
              disabled={isStoragePending}
            >
              {isStoragePending ? '添加中...' : '确认添加'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
