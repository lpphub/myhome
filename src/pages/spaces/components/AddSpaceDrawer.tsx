import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Archive, Home, Ruler, Tag } from 'lucide-react'
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
import {
  type AddRoomForm as AddRoomFormType,
  type AddStorageForm as AddStorageFormType,
  ROOM_TYPE_LABELS,
  type Room,
  STORAGE_TYPE_LABELS,
  type Storage,
} from '@/types/spaces'

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

const storageSchema = z.object({
  name: z.string().min(1, '请输入收纳点名称'),
  type: z.enum(['closet', 'shoe-rack', 'bookshelf', 'cabinet', 'drawer', 'hanger', 'other']),
  roomId: z.string().min(1, '请选择所属房间'),
  capacity: z.number().min(1, '请输入容量'),
})

type RoomFormData = z.infer<typeof roomSchema>
type StorageFormData = z.infer<typeof storageSchema>
type AddType = 'room' | 'storage'

interface AddSpaceDrawerProps {
  onAddRoom: (room: Room) => void
  onAddStorage: (storage: Storage) => void
  rooms: Room[]
}

export function AddSpaceDrawer({ onAddRoom, onAddStorage, rooms }: AddSpaceDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [addType, setAddType] = useState<AddType>('room')

  const roomForm = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: '',
      type: 'bedroom',
      area: 10,
    },
  })

  const storageForm = useForm<StorageFormData>({
    resolver: zodResolver(storageSchema),
    defaultValues: {
      name: '',
      type: 'cabinet',
      roomId: rooms.length > 0 ? rooms[0].id : '',
      capacity: 20,
    },
  })

  const { mutate: mutateRoom, isPending: isRoomPending } = useMutation({
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
      roomForm.reset()
    },
    onError: error => {
      toast.error('添加失败，请重试')
      console.error(error)
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

  const onRoomSubmit = (data: RoomFormData) => {
    mutateRoom(data as AddRoomFormType)
  }

  const onStorageSubmit = (data: StorageFormData) => {
    mutateStorage(data as AddStorageFormType)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      if (addType === 'room') {
        roomForm.reset()
      } else {
        storageForm.reset({
          ...storageForm.getValues(),
          roomId: rooms.length > 0 ? rooms[0].id : '',
        })
      }
    }
  }

  const handleTypeChange = (type: AddType) => {
    setAddType(type)
    roomForm.reset()
    storageForm.reset({
      name: '',
      type: 'cabinet',
      roomId: rooms.length > 0 ? rooms[0].id : '',
      capacity: 20,
    })
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
              {addType === 'room' ? (
                <Home className='w-5 h-5 text-honey-600' />
              ) : (
                <Archive className='w-5 h-5 text-honey-600' />
              )}
            </div>
            <div>
              <SheetTitle className='text-warmGray-800'>
                {addType === 'room' ? '添加新房间' : '添加收纳空间'}
              </SheetTitle>
              <SheetDescription>
                {addType === 'room' ? '创建一个温馨的收纳空间' : '为房间添加收纳点'}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className='flex gap-2 py-4 px-2 mb-2'>
          <Button
            type='button'
            variant={addType === 'room' ? 'default' : 'outline'}
            size='sm'
            onClick={() => handleTypeChange('room')}
            className={
              addType === 'room'
                ? 'bg-honey-500 text-white hover:bg-honey-600'
                : 'border-honey-300 text-honey-700 hover:bg-honey-50'
            }
          >
            <Home className='w-4 h-4 mr-1' />
            添加房间
          </Button>
          <Button
            type='button'
            variant={addType === 'storage' ? 'default' : 'outline'}
            size='sm'
            onClick={() => handleTypeChange('storage')}
            className={
              addType === 'storage'
                ? 'bg-honey-500 text-white hover:bg-honey-600'
                : 'border-honey-300 text-honey-700 hover:bg-honey-50'
            }
          >
            <Archive className='w-4 h-4 mr-1' />
            添加收纳
          </Button>
        </div>

        {addType === 'room' ? (
          <form onSubmit={roomForm.handleSubmit(onRoomSubmit)} className='grid gap-5 py-2 px-2'>
            <div className='grid gap-3'>
              <Label htmlFor='room-name' className='flex items-center gap-2'>
                <Home className='w-4 h-4 text-warmGray-500' />
                房间名称
              </Label>
              <Input
                id='room-name'
                placeholder='例如：主卧、客厅...'
                {...roomForm.register('name')}
                className={
                  roomForm.formState.errors.name
                    ? 'border-red-500 ring-1 ring-red-500'
                    : 'border-warmGray-300 focus:border-honey-400'
                }
              />
              {roomForm.formState.errors.name && (
                <p className='text-sm text-coral-500'>{roomForm.formState.errors.name.message}</p>
              )}
            </div>

            <div className='grid gap-3'>
              <Label htmlFor='room-type' className='flex items-center gap-2'>
                <Tag className='w-4 h-4 text-warmGray-500' />
                房间类型
              </Label>
              <Select
                value={roomForm.watch('type')}
                onValueChange={value => roomForm.setValue('type', value as RoomFormData['type'])}
              >
                <SelectTrigger className='w-full border-warmGray-300 focus:border-honey-400'>
                  <SelectValue placeholder='选择房间类型' />
                </SelectTrigger>
                <SelectContent className='bg-white border-honey-200 shadow-warm-sm min-w-(--radix-select-trigger-width)'>
                  {Object.entries(ROOM_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {roomForm.formState.errors.type && (
                <p className='text-sm text-coral-500'>{roomForm.formState.errors.type.message}</p>
              )}
            </div>

            <div className='grid gap-3'>
              <Label htmlFor='room-area' className='flex items-center gap-2'>
                <Ruler className='w-4 h-4 text-warmGray-500' />
                房间面积 (㎡)
              </Label>
              <Input
                id='room-area'
                type='number'
                placeholder='例如：15'
                {...roomForm.register('area', { valueAsNumber: true })}
                className={
                  roomForm.formState.errors.area
                    ? 'border-red-500 ring-1 ring-red-500'
                    : 'border-warmGray-300 focus:border-honey-400'
                }
              />
              {roomForm.formState.errors.area && (
                <p className='text-sm text-coral-500'>{roomForm.formState.errors.area.message}</p>
              )}
            </div>

            <SheetFooter className='pt-4'>
              <Button
                type='submit'
                className='w-full bg-linear-to-r from-honey-400 to-honey-600 text-white hover:from-honey-500 hover:to-honey-700 shadow-warm-sm'
                disabled={isRoomPending}
              >
                {isRoomPending ? '添加中...' : '确认添加'}
              </Button>
            </SheetFooter>
          </form>
        ) : (
          <form
            onSubmit={storageForm.handleSubmit(onStorageSubmit)}
            className='grid gap-5 py-2 px-2'
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
                <p className='text-sm text-coral-500'>
                  {storageForm.formState.errors.name.message}
                </p>
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
                <p className='text-sm text-coral-500'>
                  {storageForm.formState.errors.type.message}
                </p>
              )}
            </div>

            <div className='grid gap-3'>
              <Label htmlFor='storage-roomId' className='flex items-center gap-2'>
                <Home className='w-4 h-4 text-warmGray-500' />
                所属房间
              </Label>
              {rooms.length === 0 ? (
                <div className='p-3 bg-honey-50 rounded-lg border border-honey-200'>
                  <p className='text-sm text-honey-700'>请先添加房间</p>
                </div>
              ) : (
                <>
                  <Select
                    value={storageForm.watch('roomId')}
                    onValueChange={value => storageForm.setValue('roomId', value)}
                  >
                    <SelectTrigger className='w-full border-warmGray-300 focus:border-honey-400'>
                      <SelectValue placeholder='选择所属房间' />
                    </SelectTrigger>
                    <SelectContent className='bg-white border-honey-200 shadow-warm-sm min-w-(--radix-select-trigger-width)'>
                      {rooms.map(room => (
                        <SelectItem key={room.id} value={room.id}>
                          <div className='flex items-center gap-2'>
                            <span>{room.name}</span>
                            <Badge variant='outline' className='text-xs'>
                              {ROOM_TYPE_LABELS[room.type]}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {storageForm.formState.errors.roomId && (
                    <p className='text-sm text-coral-500'>
                      {storageForm.formState.errors.roomId.message}
                    </p>
                  )}
                </>
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

            <SheetFooter className='pt-4'>
              <Button
                type='submit'
                className='w-full bg-linear-to-r from-honey-400 to-honey-600 text-white hover:from-honey-500 hover:to-honey-700 shadow-warm-sm'
                disabled={isStoragePending || rooms.length === 0}
              >
                {isStoragePending ? '添加中...' : '确认添加'}
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
}
