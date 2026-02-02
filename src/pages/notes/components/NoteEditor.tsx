import { Fullscreen, Minimize } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Editor } from '@/components/editor'
import type { EditorRef } from '@/components/editor/types'
import { Button } from '@/components/ui/button'
import { useSpace } from '@/pages/spaces/contexts/SpaceContext'
import type { NoteFormData } from '@/types/notes'

/* ---------- types ---------- */

export interface NoteEditorRef {
  clearContent: () => void
}

interface NoteEditorProps {
  id?: number
  initialContent?: string
  onSave: (data: NoteFormData) => void
  enableFullscreen?: boolean
  onCancel?: () => void
}

type EditorRefObject = React.RefObject<EditorRef | null>

/* ---------- component ---------- */

export const NoteEditor = forwardRef<NoteEditorRef, NoteEditorProps>(
  ({ id, initialContent = '', onSave, onCancel, enableFullscreen }, ref) => {
    const editorRef = useRef<EditorRef>(null)
    const fullscreenEditorRef = useRef<EditorRef>(null)

    const { spaceId } = useSpace()

    const [content, setContent] = useState(initialContent)
    const [isFullscreen, setIsFullscreen] = useState(false)

    /* ---------- utils ---------- */

    const getEditorContent = (ref: EditorRefObject) => ref.current?.getContent()

    const clearEditor = (ref: EditorRefObject) => {
      ref.current?.clearContent()
    }

    const clearAll = () => {
      clearEditor(editorRef)
      clearEditor(fullscreenEditorRef)
      setContent('')
    }

    const syncToEditor = (ref: EditorRefObject, html: string) => {
      setTimeout(() => {
        ref.current?.setContent(html)
      }, 100)
    }

    const saveFromEditor = (ref: EditorRefObject) => {
      const output = getEditorContent(ref)
      if (!output) return

      onSave({
        id,
        spaceId,
        content: JSON.stringify(output.json),
      })

      clearAll()
      setIsFullscreen(false)
    }

    /* ---------- imperative api ---------- */

    useImperativeHandle(ref, () => ({
      clearContent: clearAll,
    }))

    /* ---------- handlers ---------- */

    const handleSave = () => {
      saveFromEditor(editorRef)
    }

    const handleFullscreen = () => {
      const html = getEditorContent(editorRef)?.html || ''
      setContent(html)
      setIsFullscreen(true)
    }

    const handleMinimize = () => {
      const html = getEditorContent(fullscreenEditorRef)?.html || ''
      setContent(html)
      setIsFullscreen(false)
      syncToEditor(editorRef, html)
    }

    const handleFullscreenSave = () => {
      saveFromEditor(fullscreenEditorRef)
    }

    /* ---------- render ---------- */

    return (
      <>
        {/* 普通编辑器 */}
        <div className='mb-4 bg-white border border-card rounded-sm shadow-sm overflow-hidden'>
          <Editor
            ref={editorRef}
            content={content}
            toolbar='full'
            className='border-none min-h-50 max-h-125'
          />

          <div className='flex justify-between p-2'>
            {enableFullscreen ? (
              <Button
                variant='ghost'
                className='hover:text-primary'
                onClick={handleFullscreen}
                title='全屏'
              >
                <Fullscreen className='w-4 h-4' />
              </Button>
            ) : (
              <div />
            )}

            <div className='flex gap-1'>
              {onCancel && (
                <Button variant='outline' onClick={onCancel}>
                  取消
                </Button>
              )}
              <Button onClick={handleSave} className='text-white'>
                保存
              </Button>
            </div>
          </div>
        </div>

        {/* 全屏编辑器 */}
        <AnimatePresence>
          {isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='fixed inset-0 z-50 bg-background flex flex-col items-center'
            >
              <div className='flex-1 w-full max-w-4xl overflow-auto'>
                <Editor
                  ref={fullscreenEditorRef}
                  content={content}
                  toolbar='full'
                  className='h-full'
                  autoFocus
                />
              </div>

              <div className='flex justify-between items-center px-4 py-3 w-full max-w-4xl'>
                <Button
                  variant='ghost'
                  onClick={handleMinimize}
                  title='最小化'
                  className='hover:text-primary'
                >
                  <Minimize className='w-4 h-4 mr-2' />
                </Button>

                <Button onClick={handleFullscreenSave} className='text-white'>
                  保存
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  }
)

NoteEditor.displayName = 'NoteEditor'
