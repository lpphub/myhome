import { Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import type { Tag, TagFormData } from '@/types/tags'
import { ColorSelect } from './ColorSelect'

interface TagDetailDrawerProps {
  open: boolean
  tag: Tag | null
  onClose: () => void
  onUpdate: (data: TagFormData) => void
  onDelete: (id: number) => void
}

export function TagDetailDrawer({ open, tag, onClose, onUpdate, onDelete }: TagDetailDrawerProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('lemon')

  useEffect(() => {
    if (tag) {
      setName(tag.name)
      setDescription(tag.description || '')
      setColor(tag.color)
    }
  }, [tag])

  const handleSave = useCallback(() => {
    if (!tag || !name.trim()) return
    onUpdate({
      id: tag.id,
      name: name.trim(),
      description: description.trim() || undefined,
      color,
      groupId: tag.groupId,
    })
    onClose()
  }, [tag, name, description, color, onUpdate, onClose])

  const handleDelete = useCallback(() => {
    if (!tag) return
    onDelete(tag.id)
    onClose()
  }, [tag, onDelete, onClose])

  if (!tag) return null

  return (
    <Sheet open={open} onOpenChange={o => !o && onClose()}>
      <SheetContent className='flex flex-col h-full'>
        <SheetHeader className='flex flex-row items-center justify-between space-y-0 px-6 py-4 border-b'>
          <SheetTitle>便签详情</SheetTitle>
          <button
            type='button'
            onClick={handleDelete}
            className='p-2 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors'
            title='删除'
          >
            <Trash2 className='h-4 w-4' />
          </button>
        </SheetHeader>

        <SheetBody className='px-6 py-4 space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='tag-name'>名称</Label>
            <Input
              id='tag-name'
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='输入便签名称'
              maxLength={100}
            />
          </div>

          <div className='space-y-2'>
            <Label>颜色</Label>
            <ColorSelect value={color} onChange={setColor} />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='tag-description'>描述</Label>
            <Textarea
              id='tag-description'
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='添加详细描述...'
              rows={8}
            />
          </div>
        </SheetBody>

        <SheetFooter className='px-6 py-4 border-t mt-auto'>
          <Button variant='outline' onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleSave} className='bg-primary text-white hover:bg-primary/90'>
            保存
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
