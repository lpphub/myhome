import { type Editor, useEditor as useTiptapEditor } from '@tiptap/react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { createExtensions, mergeExtensions } from '../extensions'
import type { EditorOutput, EditorProps } from '../types'
import { debounce, getEditorContent } from '../utils'

interface UseEditorOptions
  extends Pick<
    EditorProps,
    | 'content'
    | 'placeholder'
    | 'editable'
    | 'autoFocus'
    | 'extensions'
    | 'characterLimit'
    | 'onChange'
    | 'onFocus'
    | 'onBlur'
    | 'onReady'
  > {}

interface UseEditorReturn {
  editor: Editor | null
  getContent: () => EditorOutput | null
  setContent: (content: string | Record<string, unknown>) => void
  clearContent: () => void
  insertContent: (content: string) => void
}

/**
 * 编辑器核心 Hook
 * 专注于编辑器实例的创建和基本操作，不包含工具栏状态管理
 */
export const useEditor = (options: UseEditorOptions): UseEditorReturn => {
  const {
    content = '',
    placeholder,
    editable = true,
    autoFocus = false,
    extensions: customExtensions,
    characterLimit,
    onChange,
    onFocus,
    onBlur,
    onReady,
  } = options

  const onReadyRef = useRef(onReady)
  const onChangeRef = useRef(onChange)

  // 更新 refs
  useEffect(() => {
    onReadyRef.current = onReady
    onChangeRef.current = onChange
  }, [onReady, onChange])

  // 防抖的内容变化回调
  const debouncedOnChange = useMemo(
    () =>
      debounce((editor: Editor) => {
        const content = getEditorContent(editor)
        if (content) {
          onChangeRef.current?.(content)
        }
      }, 300),
    []
  )

  // 创建扩展
  const allExtensions = useMemo(() => {
    const defaultExtensions = createExtensions({ placeholder, characterLimit })
    return mergeExtensions(defaultExtensions, customExtensions)
  }, [placeholder, characterLimit, customExtensions])

  // 创建编辑器实例
  const editor = useTiptapEditor({
    extensions: allExtensions,
    content,
    editable,
    autofocus: autoFocus,
    onCreate: ({ editor }) => onReadyRef.current?.(editor),
    onUpdate: ({ editor }) => debouncedOnChange(editor),
    onFocus: ({ editor }) => onFocus?.(editor),
    onBlur: ({ editor }) => onBlur?.(editor),
  })

  // 同步 editable 状态
  useEffect(() => {
    if (editor && editor.isEditable !== editable) {
      editor.setEditable(editable)
    }
  }, [editor, editable])

  // 获取内容
  const getContent = useCallback(() => getEditorContent(editor), [editor])

  // 设置内容
  const setContent = useCallback(
    (newContent: string | Record<string, unknown>) => editor?.commands.setContent(newContent),
    [editor]
  )

  // 清空内容
  const clearContent = useCallback(() => editor?.commands.clearContent(), [editor])

  // 插入内容
  const insertContent = useCallback(
    (content: string) => editor?.commands.insertContent(content),
    [editor]
  )

  return {
    editor,
    getContent,
    setContent,
    clearContent,
    insertContent,
  }
}
