import { EditorContent } from '@tiptap/react'
import { forwardRef, useCallback, useImperativeHandle, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { useEditor } from './hooks/useEditor'
import { ToolbarRenderer } from './toolbar/components/base/renderer'
import { resolveToolbarConfig } from './toolbar/config'
import type { EditorProps, EditorRef } from './types'

/**
 * 重构后的编辑器组件
 *
 * 主要改进：
 * 1. 支持多种工具栏显示模式（pin、bubble）
 * 2. 清晰的预设和自定义配置系统
 * 3. 工具栏项目独立订阅状态，避免整体重渲染
 * 4. 保持向后兼容性
 * 5. 更清晰的组件职责分离
 */
export const Editor = forwardRef<EditorRef, EditorProps>((props, ref) => {
  const {
    content,
    placeholder = '开始输入内容...',
    editable = true,
    autoFocus = false,
    extensions,
    className,
    showToolbar = true,
    toolbar,
    characterLimit,
    onChange,
    onFocus,
    onBlur,
    onReady,
  } = props

  const { editor, getContent, setContent, clearContent, insertContent } = useEditor({
    content,
    placeholder,
    editable,
    autoFocus,
    extensions,
    characterLimit,
    onChange,
    onFocus,
    onBlur,
    onReady,
  })

  useImperativeHandle(
    ref,
    () => ({
      getEditor: () => editor,
      getContent,
      setContent,
      clearContent,
      insertContent,
      focus: () => {
        if (editor) {
          editor.chain().focus().run()
        }
      },
    }),
    [editor, getContent, setContent, clearContent, insertContent]
  )

  // 解析工具栏配置
  const toolbarConfig = useMemo(() => {
    return resolveToolbarConfig(toolbar)
  }, [toolbar])

  const handleEditorClick = useCallback(() => {
    if (editor) {
      // 只是简单地聚焦编辑器，让 TipTap 自己处理光标位置
      // TipTap 会根据点击位置自动定位光标
      editor.chain().focus().run()
    }
  }, [editor])

  const handleEditorKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleEditorClick()
      }
    },
    [handleEditorClick]
  )

  return (
    <div
      className={cn(
        'flex flex-col',
        editable ? 'bg-white' : 'bg-slate-50 cursor-not-allowed',
        className
      )}
    >
      {/* 工具栏渲染器 - 根据模式切换不同的工具栏显示方式 */}
      {showToolbar && editable && <ToolbarRenderer editor={editor} config={toolbarConfig} />}

      {/* 编辑区域 */}
      <div
        role='button'
        tabIndex={0}
        onClick={handleEditorClick}
        onKeyDown={handleEditorKeyDown}
        className='flex-1 px-3 py-2 overflow-y-auto overflow-x-hidden'
      >
        <EditorContent editor={editor} className='tiptap' />
      </div>
    </div>
  )
})

Editor.displayName = 'Editor'
