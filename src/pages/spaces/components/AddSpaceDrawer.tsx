import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Archive, FileText, Image as ImageIcon, Ruler, Tag as TagIcon, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import type { StorageSchema } from '@/types/spaces'
import type { Tag } from '@/types/tags'
import { TAG_COLOR_CLASSES } from '@/types/tags'

const MOCK_TAGS: Tag[] = [
  {
    id: 1,
    name: '衣物',
    category: 'type',
    color: 'honey',
    itemCount: 10,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 2,
    name: '家具',
    category: 'type',
    color: 'lemon',
    itemCount: 5,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 3,
    name: '卧室',
    category: 'room',
    color: 'coral',
    itemCount: 8,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 4,
    name: '厨房',
    category: 'room',
    color: 'lavender',
    itemCount: 6,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 5,
    name: '客厅',
    category: 'room',
    color: 'cream',
    itemCount: 4,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 6,
    name: '电器',
    category: 'type',
    color: 'pink',
    itemCount: 3,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 7,
    name: '厨具',
    category: 'type',
    color: 'mint',
    itemCount: 7,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 8,
    name: '日常',
    category: 'functional',
    color: 'honey',
    itemCount: 9,
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
]

const storageFormSchema = z.object({
  name: z.string().min(1, '请输入收纳点名称'),
  capacity: z.number().min(1, '请输入容量'),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  image: z
    .string()
    .optional()
    .refine(val => !val || /^https?:\/\/|^data:image\//.test(val), '请输入有效的图片URL'),
})

type StorageFormValues = z.infer<typeof storageFormSchema>

interface AddSpaceDrawerProps {
  onAddStorage: (storage: StorageSchema) => void
}

export function AddSpaceDrawer({ onAddStorage }: AddSpaceDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [imagePreview, setImagePreview] = useState<string>('')

  const storageForm = useForm<StorageFormValues>({
    resolver: zodResolver(storageFormSchema),
    defaultValues: {
      name: '',
      capacity: 20,
      description: '',
      tags: [],
      image: '',
    },
  })

  const { mutate: mutateStorage, isPending: isStoragePending } = useMutation({
    mutationFn: (data: StorageFormValues) => {
      const formDataWithTags = {
        ...data,
        tags: selectedTags,
        image: imagePreview || data.image,
      }
      return Promise.resolve({
        id: Date.now(),
        ...formDataWithTags,
        itemCount: 0,
        utilization: 0,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as StorageSchema)
    },
    onSuccess: storage => {
      onAddStorage(storage)
      toast.success('收纳空间添加成功！')
      setIsOpen(false)
      handleReset()
    },
    onError: error => {
      toast.error('添加失败，请重试')
      console.error(error)
    },
  })

  const onStorageSubmit = (data: StorageFormValues) => {
    mutateStorage(data)
  }

  const handleReset = () => {
    storageForm.reset()
    setSelectedTags([])
    setImagePreview('')
  }

  const handleTagToggle = (tagName: string) => {
    setSelectedTags(prev =>
      prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
    )
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = event => {
        const base64 = event.target?.result as string
        setImagePreview(base64)
        storageForm.setValue('image', base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview('')
    storageForm.setValue('image', '')
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      handleReset()
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
        className='flex flex-col overflow-hidden w-full sm:w-130 bg-linear-to-br from-white via-cream-50/90 to-honey-50/60 border-l-honey-200!'
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

        <form
          onSubmit={storageForm.handleSubmit(onStorageSubmit)}
          className='flex-1 overflow-y-auto grid gap-5 px-2'
        >
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

          <div className='grid gap-3'>
            <Label className='flex items-center gap-2'>
              <TagIcon className='w-4 h-4 text-warmGray-500' />
              标签
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type='button'
                  variant='outline'
                  className='w-full justify-between border-warmGray-300 focus:border-honey-400'
                >
                  {selectedTags.length > 0 ? `已选择 ${selectedTags.length} 个标签` : '选择标签'}
                  <TagIcon className='w-4 h-4 opacity-50' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='bg-white border-honey-200 shadow-warm-sm w-64'>
                {MOCK_TAGS.map(tag => (
                  <DropdownMenuCheckboxItem
                    key={tag.id}
                    checked={selectedTags.includes(tag.name)}
                    onCheckedChange={() => handleTagToggle(tag.name)}
                  >
                    <div
                      className={`flex items-center gap-2 ${TAG_COLOR_CLASSES[tag.color].bg} px-2 py-1 rounded`}
                    >
                      <span className={TAG_COLOR_CLASSES[tag.color].text}>{tag.name}</span>
                    </div>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {selectedTags.length > 0 && (
              <div className='flex flex-wrap gap-2 mt-2'>
                {selectedTags.map(tag => (
                  <Badge
                    key={tag}
                    variant='outline'
                    className='flex items-center gap-1 bg-honey-100 text-honey-700 border-honey-200'
                  >
                    #{tag}
                    <button
                      type='button'
                      onClick={() => handleTagToggle(tag)}
                      className='ml-1 hover:text-red-500'
                    >
                      <X className='w-3 h-3' />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className='grid gap-3'>
            <Label className='flex items-center gap-2'>
              <ImageIcon className='w-4 h-4 text-warmGray-500' />
              图片
            </Label>
            {imagePreview ? (
              <div className='relative'>
                <img
                  src={imagePreview}
                  alt='预览'
                  className='w-full h-48 object-cover rounded-lg border border-warmGray-200'
                />
                <Button
                  type='button'
                  variant='destructive'
                  size='sm'
                  onClick={handleRemoveImage}
                  className='absolute top-2 right-2'
                >
                  <X className='w-4 h-4 mr-1' />
                  删除
                </Button>
              </div>
            ) : (
              <div className='border-2 border-dashed border-warmGray-300 rounded-lg p-6'>
                <div className='flex flex-col items-center gap-4'>
                  <ImageIcon className='w-12 h-12 text-warmGray-400' />
                  <div className='text-center'>
                    <p className='text-sm text-warmGray-600 mb-2'>上传图片</p>
                    <Input
                      type='file'
                      accept='image/*'
                      onChange={handleImageFileChange}
                      className='max-w-xs mx-auto'
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <SheetFooter className='mt-auto pt-4'>
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
