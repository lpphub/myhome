import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { MapPin, Package, Tag as TagIcon, X } from 'lucide-react'
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
import { Textarea as TextareaInput } from '@/components/ui/textarea'
import type { Item } from '@/types/items'
import { ITEM_STATUS_LABELS } from '@/types/items'


const itemSchema = z.object({
  name: z.string().min(1, '请输入物品名称'),
  quantity: z.number().min(1, '请输入数量'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive', 'lost', 'donated']),
  location: z.string().optional(),
})

type ItemFormData = z.infer<typeof itemSchema>

interface AddItemDrawerProps {
  onAddItem: (item: Item) => void
}

export function AddItemDrawer({ onAddItem }: AddItemDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      quantity: 1,
      description: '',
      status: 'active',
      location: '',
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ItemFormData) => {
      const formDataWithTags = {
        ...data,
        tags: selectedTags,
      }
      return Promise.resolve({
        id: Date.now(),
        storageId: 0,
        ...formDataWithTags,
        image: undefined,
        purchaseDate: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Item)
    },
    onSuccess: item => {
      onAddItem(item)
      toast.success('物品添加成功！')
      setIsOpen(false)
      form.reset()
    },
    onError: error => {
      toast.error('添加失败，请重试')
      console.error(error)
    },
  })

  const onSubmit = (data: ItemFormData) => {
    mutate(data)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      form.reset()
    }
  }


  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button className='bg-linear-to-r from-honey-400 to-honey-600 text-white hover:from-honey-500 hover:to-honey-700 shadow-warm-sm'>
          <Package className='w-4 h-4 mr-1' />
          添加物品
        </Button>
      </SheetTrigger>
      <SheetContent
        side='right'
        className='flex flex-col overflow-hidden w-full sm:w-130 bg-linear-to-br from-white via-cream-50/90 to-honey-50/60 border-l-honey-200!'
      >
        <SheetHeader className='border-b border-cream-200 pb-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-honey-100 rounded-lg shadow-soft'>
              <Package className='w-5 h-5 text-honey-600' />
            </div>
            <div>
              <SheetTitle className='text-warmGray-800'>添加新物品</SheetTitle>
              <SheetDescription>记录一件新的收纳物品</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex-1 overflow-y-auto grid gap-5 px-2'
        >
          <div className='grid gap-3'>
            <Label htmlFor='item-name' className='flex items-center gap-2'>
              <Package className='w-4 h-4 text-warmGray-500' />
              物品名称
            </Label>
            <Input
              id='item-name'
              placeholder='例如：白色T恤、苹果手机...'
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

          <div className='grid gap-3'>
            <Label htmlFor='item-status' className='flex items-center gap-2'>
              <Package className='w-4 h-4 text-warmGray-500' />
              状态
            </Label>
            <Select
              value={form.watch('status')}
              onValueChange={value => form.setValue('status', value as ItemFormData['status'])}
            >
              <SelectTrigger className='w-full border-warmGray-300 focus:border-honey-400'>
                <SelectValue placeholder='选择状态' />
              </SelectTrigger>
              <SelectContent className='bg-white border-honey-200 shadow-warm-sm w-64'>
                {Object.entries(ITEM_STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    <div className='flex items-center gap-2'>
                      <span>{label}</span>
                      {value === 'active' && (
                        <Badge className='bg-lime-100 text-lime-800'>使用中</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.status && (
              <p className='text-sm text-coral-500'>{form.formState.errors.status.message}</p>
            )}
          </div>

          <div className='grid gap-3'>
            <Label htmlFor='item-location' className='flex items-center gap-2'>
              <MapPin className='w-4 h-4 text-warmGray-500' />
              存放位置
            </Label>
            <Input
              id='item-location'
              placeholder='例如：主卧衣柜第二层...'
              {...form.register('location')}
              className='border-warmGray-300 focus:border-honey-400'
            />
          </div>

          <div className='grid gap-3'>
            <Label htmlFor='item-description' className='flex items-center gap-2'>
              <TagIcon className='w-4 h-4 text-warmGray-500' />
              描述
            </Label>
            <TextareaInput
              id='item-description'
              placeholder='添加一些描述信息...'
              {...form.register('description')}
              className='border-warmGray-300 focus:border-honey-400 resize-none'
              rows={3}
            />
          </div>

          <SheetFooter className='mt-auto pt-4'>
            <Button
              type='submit'
              className='w-full bg-linear-to-r from-honey-400 to-honey-600 text-white hover:from-honey-500 hover:to-honey-700 shadow-warm-sm'
              disabled={isPending}
            >
              {isPending ? '添加中...' : '确认添加'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
