import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
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
import { type AddRoomForm as AddRoomFormType, ROOM_TYPE_LABELS, type Room } from '@/types/spaces'

const roomSchema = z.object({
  name: z.string().min(1, '请输入房间名称'),
  type: z.enum([
    'bedroom',
    'living',
    'kitchen',
    'bathroom',
    'study',
    'balcony',
    'entrance',
    'storage',
  ]),
  area: z.number().min(1, '请输入房间面积'),
})

type RoomFormData = z.infer<typeof roomSchema>

interface AddRoomDrawerProps {
  onAddRoom: (room: Room) => void
}

export function AddRoomDrawer({ onAddRoom }: AddRoomDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: '',
      type: 'bedroom',
      area: 10,
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: AddRoomFormType) => {
      return Promise.resolve({
        id: Date.now().toString(),
        ...data,
        position: { x: 0, y: 0, width: 100, height: 100 },
        storages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Room)
    },
    onSuccess: room => {
      onAddRoom(room)
      toast.success('房间添加成功！')
      setIsOpen(false)
    },
    onError: error => {
      toast.error('添加失败，请重试')
      console.error(error)
    },
  })

  const onSubmit = (data: RoomFormData) => {
    mutate(data as AddRoomFormType)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className='text-white'>
          <Plus className='w-4 h-4 mr-1' />
          添加房间
        </Button>
      </SheetTrigger>
      <SheetContent side='right' className='w-125 sm:w-125'>
        <SheetHeader>
          <SheetTitle>添加新房间</SheetTitle>
          <SheetDescription>填写房间信息，创建新的收纳空间</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-6 py-4'>
          <div className='grid gap-3'>
            <Label htmlFor='name'>房间名称</Label>
            <Input
              id='name'
              placeholder='例如：主卧、客厅...'
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}
          </div>

          <div className='grid gap-3'>
            <Label htmlFor='type'>房间类型</Label>
            <Select
              value={watch('type')}
              onValueChange={value => setValue('type', value as RoomFormData['type'])}
            >
              <SelectTrigger>
                <SelectValue placeholder='选择房间类型' />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ROOM_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && <p className='text-sm text-red-500'>{errors.type.message}</p>}
          </div>

          <div className='grid gap-3'>
            <Label htmlFor='area'>房间面积 (㎡)</Label>
            <Input
              id='area'
              type='number'
              placeholder='例如：15'
              {...register('area', { valueAsNumber: true })}
              className={errors.area ? 'border-red-500' : ''}
            />
            {errors.area && <p className='text-sm text-red-500'>{errors.area.message}</p>}
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
