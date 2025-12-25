import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { MapPin, Package, Tag, Wallet } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'
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
import { Textarea as TextareaInput } from '@/components/ui/textarea'
import type { Item } from '@/types/items'
import { ITEM_CATEGORY_LABELS, ITEM_STATUS_LABELS } from '@/types/items'

const itemSchema = z.object({
  name: z.string().min(1, '请输入物品名称'),
  category: z.enum(['clothing', 'electronics', 'books', 'kitchen', 'decor', 'other']),
  type: z.string().min(1, '请输入物品类型'),
  quantity: z.number().min(1, '请输入数量'),
  price: z.number().optional(),
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

  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      category: 'other',
      type: '',
      quantity: 1,
      price: undefined,
      description: '',
      status: 'active',
      location: '',
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ItemFormData) => {
      return Promise.resolve({
        id: Date.now().toString(),
        storagePointId: '',
        ...data,
        tags: [],
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
        className='w-full sm:w-130 bg-linear-to-br from-white via-cream-50/90 to-honey-50/60 border-l-honey-200!'
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

        <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-5 py-4 px-2'>
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
            <Label htmlFor='item-category' className='flex items-center gap-2'>
              <Tag className='w-4 h-4 text-warmGray-500' />
              物品分类
            </Label>
            <Select
              value={form.watch('category')}
              onValueChange={value => form.setValue('category', value as ItemFormData['category'])}
            >
              <SelectTrigger className='w-full border-warmGray-300 focus:border-honey-400'>
                <SelectValue placeholder='选择物品分类' />
              </SelectTrigger>
              <SelectContent className='bg-white border-honey-200 shadow-warm-sm min-w-(--radix-select-trigger-width)'>
                {Object.entries(ITEM_CATEGORY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.category && (
              <p className='text-sm text-coral-500'>{form.formState.errors.category.message}</p>
            )}
          </div>

          <div className='grid gap-3'>
            <Label htmlFor='item-type' className='flex items-center gap-2'>
              <Tag className='w-4 h-4 text-warmGray-500' />
              物品类型
            </Label>
            <Input
              id='item-type'
              placeholder='例如：上衣、iPhone 15...'
              {...form.register('type')}
              className={
                form.formState.errors.type
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-warmGray-300 focus:border-honey-400'
              }
            />
            {form.formState.errors.type && (
              <p className='text-sm text-coral-500'>{form.formState.errors.type.message}</p>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='grid gap-3'>
              <Label htmlFor='item-quantity' className='flex items-center gap-2'>
                <Package className='w-4 h-4 text-warmGray-500' />
                数量
              </Label>
              <Input
                id='item-quantity'
                type='number'
                placeholder='1'
                {...form.register('quantity', { valueAsNumber: true })}
                className={
                  form.formState.errors.quantity
                    ? 'border-red-500 ring-1 ring-red-500'
                    : 'border-warmGray-300 focus:border-honey-400'
                }
              />
              {form.formState.errors.quantity && (
                <p className='text-sm text-coral-500'>{form.formState.errors.quantity.message}</p>
              )}
            </div>

            <div className='grid gap-3'>
              <Label htmlFor='item-price' className='flex items-center gap-2'>
                <Wallet className='w-4 h-4 text-warmGray-500' />
                价格（元）
              </Label>
              <Input
                id='item-price'
                type='number'
                placeholder='0'
                {...form.register('price', { valueAsNumber: true })}
                className='border-warmGray-300 focus:border-honey-400'
              />
            </div>
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
              <SelectContent className='bg-white border-honey-200 shadow-warm-sm min-w-(--radix-select-trigger-width)'>
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
              <Tag className='w-4 h-4 text-warmGray-500' />
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

          <SheetFooter className='pt-4'>
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
