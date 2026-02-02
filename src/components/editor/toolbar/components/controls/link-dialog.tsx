import type { Editor } from '@tiptap/react'
import { Link as LinkIcon, Unlink } from 'lucide-react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useToolbarItem } from '../../../hooks/useToolbarItem'

interface LinkDialogProps {
  editor: Editor | null
  title?: string
  className?: string
}

export const LinkDialog = memo<LinkDialogProps>(({ editor, title = '链接', className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')

  const { isActive, canRun } = useToolbarItem(editor, 'link')

  /** Dialog 关闭后只负责 focus，不做任何内容修改 */
  const focusAfterCloseRef = useRef(false)

  /** 打开 Dialog 时同步选区 */
  useEffect(() => {
    if (!editor || !isOpen) return

    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to)

    if (isActive) {
      const attrs = editor.getAttributes('link')
      setUrl(attrs.href || '')
      setText(selectedText || '')
    } else {
      setUrl('')
      setText(selectedText || '')
    }
  }, [editor, isOpen, isActive])

  const handleOpen = useCallback(() => {
    if (canRun) setIsOpen(true)
  }, [canRun])

  /** Dialog 状态变化统一处理 */
  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open)

      if (!open && focusAfterCloseRef.current) {
        requestAnimationFrame(() => {
          editor?.chain().focus().run()
          focusAfterCloseRef.current = false
        })
      }
    },
    [editor]
  )

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setUrl('')
    setText('')
  }, [])

  /** 提交：先写内容（不 focus） */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!editor || !url.trim()) return

      const href = url.trim()
      const contentText = text.trim()

      if (contentText && !isActive) {
        editor.chain().insertContent(`<a href="${href}">${contentText}</a>`).run()
      } else {
        editor.chain().setLink({ href }).run()
      }

      // 标记关闭后需要 focus
      focusAfterCloseRef.current = true
      handleClose()
    },
    [editor, url, text, isActive, handleClose]
  )

  /** 移除链接 */
  const handleRemoveLink = useCallback(() => {
    if (!editor) return

    editor.chain().unsetLink().run()

    focusAfterCloseRef.current = true
    handleClose()
  }, [editor, handleClose])

  const isValidUrl = (value: string) => {
    try {
      new URL(value)
      return true
    } catch {
      return /^https?:\/\/.+/.test(value) || /^\//.test(value) || /^mailto:/.test(value)
    }
  }

  return (
    <>
      <button
        type='button'
        onClick={handleOpen}
        disabled={!canRun}
        title={title}
        aria-label={title}
        aria-pressed={isActive}
        className={cn(
          'inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors',
          'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          isActive && 'bg-blue-100 text-blue-600 hover:bg-blue-200',
          className
        )}
      >
        <LinkIcon className='w-3.5 h-3.5' />
      </button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>{isActive ? '编辑链接' : '添加链接'}</DialogTitle>
          </DialogHeader>
          <DialogDescription className='sr-only'>链接编辑对话框</DialogDescription>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <Label htmlFor='link-url'>链接地址</Label>
              <Input
                id='link-url'
                type='url'
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder='https://example.com'
                className='mt-1'
                autoFocus
              />
            </div>

            {!isActive && (
              <div>
                <Label htmlFor='link-text'>显示文本</Label>
                <Input
                  id='link-text'
                  type='text'
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder='链接文本'
                  className='mt-1'
                />
              </div>
            )}

            <DialogFooter className='flex justify-between'>
              <div>
                {isActive && (
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleRemoveLink}
                    className='text-red-600 hover:text-red-700'
                  >
                    <Unlink className='w-4 h-4 mr-2' />
                    移除链接
                  </Button>
                )}
              </div>

              <div className='flex gap-2'>
                <Button type='button' variant='outline' onClick={handleClose}>
                  取消
                </Button>
                <Button
                  type='submit'
                  disabled={!url.trim() || !isValidUrl(url.trim())}
                  className='text-white'
                >
                  {isActive ? '更新' : '添加'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
})

LinkDialog.displayName = 'LinkDialog'
