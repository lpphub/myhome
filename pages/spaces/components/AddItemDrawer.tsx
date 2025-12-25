import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useSpacesStore } from '@/stores/useSpacesStore'
import type { StorageItem } from '@/types/spaces'

const itemSchema = z.object({
  name: z.string().min(1, '请输入物品名称'),
  type: z.string().min(1, '请选择物品类型'),
  quantity: z.number().min(1, '请输入物品数量'),
  description: z.string().optional(),
})

type ItemFormData = z.infer<typeof itemSchema>

const ITEM_TYPES = ['衣物', '鞋履', '书籍', '文具', '电子产品', '厨具', '装饰品', '其他']

export function AddItemDrawer() {
  const { isAddItemDrawerOpen, setAddItemDrawerOpen, activeStoragePointId, addItemToStoragePoint } =
    useSpacesStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      type: '其他',
      quantity: 1,
      description: '',
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ItemFormData) => {
      const item: StorageItem = {
        id: Date.now().toString(),
        storagePointId: activeStoragePointId || '',
        name: data.name,
        type: data.type,
        quantity: data.quantity,
        description: data.description,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return item
    },
    onSuccess: data => {
      if (activeStoragePointId) {
        addItemToStoragePoint(activeStoragePointId, data)
      }
      toast.success('物品添加成功！')
      reset()
      setAddItemDrawerOpen(false)
    },
    onError: error => {
      toast.error('添加失败，请重试')
      console.error(error)
    },
  })

  const onSubmit = (data: ItemFormData) => {
    mutate(data)
  }

  const handleClose = () => {
    reset()
    setAddItemDrawerOpen(false)
  }

  return (
    <Sheet open={isAddItemDrawerOpen} onOpenChange={handleClose}>
      <SheetContent side='bottom' className='h-[80vh] md:h-auto md:side-right md:w-[500px]'>
        <SheetHeader>
          <SheetTitle>添加物品</SheetTitle>
          <SheetDescription>添加新的物品到收纳点</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-6 py-4'>
          <div className='grid gap-3'>
            <Label htmlFor='item-name'>物品名称</Label>
            <Input
              id='item-name'
              placeholder='例如：T恤、书本...'
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}
          </div>

          <div className='grid gap-3'>
            <Label htmlFor='item-type'>物品类型</Label>
            <select
              {...register('type')}
              className='border-input bg-background flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {ITEM_TYPES.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.type && <p className='text-sm text-red-500'>{errors.type.message}</p>}
          </div>

          <div className='grid gap-3'>
            <Label htmlFor='item-quantity'>数量</Label>
            <Input
              id='item-quantity'
              type='number'
              min='1'
              {...register('quantity', { valueAsNumber: true })}
              className={errors.quantity ? 'border-red-500' : ''}
            />
            {errors.quantity && <p className='text-sm text-red-500'>{errors.quantity.message}</p>}
          </div>

          <div className='grid gap-3'>
            <Label htmlFor='item-description'>备注（可选）</Label>
            <Textarea
              id='item-description'
              placeholder='添加一些备注...'
              {...register('description')}
            />
          </div>

          <SheetFooter className='pt-4'>
            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending ? '添加中...' : '确认添加'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
