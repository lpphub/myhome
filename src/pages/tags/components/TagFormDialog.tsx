import { Check } from 'lucide-react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Editor } from '@/components/editor'
import type { EditorRef } from '@/components/editor/types'
import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { TAG_COLOR_CLASSES, type TagFormData } from '@/types/tags'

/* ---------- ColorSelect ---------- */
interface ColorSelectProps {
  value: string
  onChange: (color: string) => void
}

const ColorSelect = memo(({ value, onChange }: ColorSelectProps) => (
  <div className='flex items-center gap-2 flex-wrap'>
    {Object.entries(TAG_COLOR_CLASSES).map(([key, color]) => {
      const selected = value === key
      return (
        <button
          key={key}
          type='button'
          title={color.name}
          onClick={() => onChange(key)}
          className={cn(
            'relative w-6 h-6 rounded-full transition-all',
            'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-honey-400',
            color.classes,
            selected && 'ring-2 ring-offset-1 ring-honey-400 scale-110'
          )}
        >
          {selected && (
            <Check className='absolute inset-1/2 w-3.5 h-3.5 -translate-x-1/2 -translate-y-1/2 opacity-70' />
          )}
        </button>
      )
    })}
  </div>
))

/* ---------- TagFormDialog ---------- */
export interface TagFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: TagFormData) => void
  initialData?: TagFormData
}

export const TagFormDialog = ({ open, onClose, onSubmit, initialData }: TagFormDialogProps) => {
  const editorRef = useRef<EditorRef>(null)
  const [color, setColor] = useState<string>('lemon')
  const isEditing = Boolean(initialData?.id)

  useEffect(() => {
    if (initialData?.color) {
      setColor(initialData.color)
    } else {
      setColor('lemon')
    }
  }, [initialData?.color])

  const handleSubmit = useCallback(() => {
    const output = editorRef.current?.getContent()
    if (!output) return

    onSubmit({
      id: initialData?.id,
      content: JSON.stringify(output.json),
      color,
      groupId: initialData?.groupId || 0,
    })
  }, [color, initialData, onSubmit])

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className='sm:max-w-lg p-0 overflow-hidden' showCloseButton={false}>
        <DialogTrigger onClick={e => e.currentTarget.blur()} />

        {/* Hidden title for accessibility - screen readers only */}
        <DialogTitle className='sr-only'>{isEditing ? '编辑便签' : '新建便签'}</DialogTitle>
        <DialogDescription className='sr-only'>编辑便签内容和颜色</DialogDescription>

        {/* TiptapEditor - full width at top */}
        <div className='px-3 min-w-0'>
          <Editor
            ref={editorRef}
            showToolbar={false}
            content={initialData?.content ? JSON.parse(initialData.content) : {}}
            className='h-75'
          />
        </div>

        {/* Color and buttons - at bottom */}
        <div className='px-4 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
          <ColorSelect value={color} onChange={setColor} />

          <div className='flex gap-2 justify-end'>
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
      </DialogContent>
    </Dialog>
  )
}
