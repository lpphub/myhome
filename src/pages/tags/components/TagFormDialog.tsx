import { Check } from 'lucide-react'
import { memo, useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { TAG_COLOR_CLASSES, type TagFormData } from '@/types/tags'

/* =======================================================
 * ColorSelect Component
 * ======================================================= */
interface ColorSelectProps {
  value: string
  onChange: (color: string) => void
}

const ColorSelect = memo(({ value, onChange }: ColorSelectProps) => {
  return (
    <div className='flex items-center gap-2'>
      {Object.entries(TAG_COLOR_CLASSES).map(([colorKey, colorData]) => {
        const isSelected = value === colorKey
        return (
          <button
            key={colorKey}
            type='button'
            onClick={() => onChange(colorKey)}
            className={cn(
              'relative w-6 h-6 rounded-full transition-all duration-200',
              'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-honey-400',
              colorData.classes,
              isSelected && 'ring-2 ring-offset-1 ring-honey-400 scale-110'
            )}
            title={colorData.name}
          >
            {isSelected && (
              <Check className='w-3.5 h-3.5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-current opacity-70' />
            )}
          </button>
        )
      })}
    </div>
  )
})

/* =======================================================
 * TagFormDialog Component
 * ======================================================= */
export interface TagFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: TagFormData) => void
  initialData?: TagFormData
}

export const TagFormDialog = ({ open, onClose, onSubmit, initialData }: TagFormDialogProps) => {
  const [content, setContent] = useState('')
  const [color, setColor] = useState('lemon')

  const isEditing = Boolean(initialData?.id)

  // Reset form when dialog opens
  useEffect(() => {
    if (!open) return

    if (initialData) {
      const desc = initialData.description || ''
      setContent(`${initialData.name}${desc ? `\n${desc}` : ''}`)
      setColor(initialData.color || 'lemon')
    } else {
      setContent('')
      setColor('lemon')
    }
  }, [open, initialData])

  // Parse content into title and description
  const parseContent = useCallback((text: string) => {
    const lines = text.split('\n')
    const title = lines[0]?.trim() || ''
    const description = lines.slice(1).join('\n').trim() || undefined
    return { title, description }
  }, [])

  const handleSubmit = useCallback(() => {
    const { title, description } = parseContent(content)

    if (!title) {
      return
    }

    onSubmit({
      id: initialData?.id,
      name: title,
      description,
      color,
      group: initialData?.group || 'default',
    })
  }, [content, color, initialData, parseContent, onSubmit])

  return (
    <Dialog open={open} onOpenChange={open => !open && onClose()}>
      <DialogContent
        className='sm:max-w-lg bg-white border-honey-200 rounded-lg p-0 overflow-hidden'
        // onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader className='px-4 pt-4 pb-1 pr-12'>
          <DialogTitle className='text-xl font-bold text-foreground'>
            {isEditing ? '编辑便签' : '新建便签'}
          </DialogTitle>
          <DialogDescription className='text-sm text-muted-foreground'>
            第一行是标题，下面是描述内容
          </DialogDescription>
        </DialogHeader>

        <div className='px-4 pb-4'>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder='标题...'
            className={cn(
              'w-full min-h-50 max-h-100 p-4 rounded-md',
              'border border-border hover:border-honey-300',
              'focus:border-honey-400 focus:ring-1 focus:ring-honey-200',
              'bg-transparent resize-none focus:outline-none',
              'text-sm leading-relaxed transition-all duration-200'
            )}
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          />

          <div className='mt-4 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <span className='text-sm text-muted-foreground'>颜色</span>
              <ColorSelect value={color} onChange={setColor} />
            </div>

            <div className='flex gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                className='border-honey-300 text-foreground hover:bg-honey-100'
              >
                取消
              </Button>
              <Button
                type='button'
                onClick={handleSubmit}
                className='bg-primary/80 hover:bg-primary text-white transition-all'
              >
                {isEditing ? '保存' : '创建'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
