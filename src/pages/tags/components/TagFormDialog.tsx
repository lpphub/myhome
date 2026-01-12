import { Check } from 'lucide-react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { TextEditor, type TextEditorHandle, type TextState } from '@/components/TextEditor'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { TAG_COLOR_CLASSES, type TagFormData } from '@/types/tags'

/* ============ ColorSelect ============ */
interface ColorSelectProps {
  value: string
  onChange: (color: string) => void
}

export const ColorSelect = memo(({ value, onChange }: ColorSelectProps) => {
  return (
    <div className='flex items-center gap-2'>
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
  )
})

/* =========== TagFormDialog ============ */
export interface TagFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: TagFormData) => void
  initialData?: TagFormData
}

export const TagFormDialog = ({ open, onClose, onSubmit, initialData }: TagFormDialogProps) => {
  const [text, setText] = useState<TextState>({ title: '', description: '' })
  const [color, setColor] = useState<string>('lemon')
  const editorRef = useRef<TextEditorHandle>(null)

  const isEditing = Boolean(initialData?.id)

  /* ---------- 初始化 ---------- */
  useEffect(() => {
    if (!open) return
    if (initialData) {
      setText({ title: initialData.name ?? '', description: initialData.description ?? '' })
      setColor(initialData.color || 'lemon')
    } else {
      setText({ title: '', description: '' })
      setColor('lemon')
    }

    // focus 标题，光标在末尾
    requestAnimationFrame(() => {
      const input = document.querySelector<HTMLInputElement>('input[placeholder="标题"]')
      if (input) {
        const len = input.value.length
        input.setSelectionRange(len, len)
        input.focus()
      }
    })
  }, [open, initialData])

  /* ---------- 提交 ---------- */
  const handleSubmit = useCallback(() => {
    if (!editorRef.current?.validate()) return

    onSubmit({
      id: initialData?.id,
      name: text.title.trim(),
      description: text.description.trim() || undefined,
      color,
      group: initialData?.group || 'default',
    })
  }, [text, color, initialData, onSubmit])

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className='sm:max-w-lg p-0 overflow-hidden'>
        <DialogTrigger onClick={e => e.currentTarget.blur()} />
        <DialogHeader className='px-4 pt-4 pb-1 pr-12'>
          <DialogTitle className='text-xl font-bold'>
            {isEditing ? '编辑便签' : '新建便签'}
          </DialogTitle>
          <DialogDescription>请输入便签标题和描述</DialogDescription>
        </DialogHeader>

        <div className='px-4 pb-4 space-y-4'>
          {/* 文本编辑区 */}
          <TextEditor ref={editorRef} text={text} onChange={setText} required />

          {/* 颜色选择 */}
          <div className='flex items-center justify-between'>
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
