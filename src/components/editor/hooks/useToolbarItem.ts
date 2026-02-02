import type { Editor } from '@tiptap/react'
import { useEditorState } from '@tiptap/react'
import { useCallback, useMemo } from 'react'
import type { ToolbarActionType } from '../types'

/**
 * 单个工具栏项目的状态管理 Hook
 * 每个工具栏项目独立订阅自己需要的状态，避免整体重渲染
 */
export interface ToolbarItemState {
  isActive: boolean
  canRun: boolean
  run: (options?: Record<string, unknown>) => void
}

// 状态检查映射 - 减少重复代码
const createStateSelector = (action: ToolbarActionType) => {
  const activeSelectors: Record<ToolbarActionType, (editor: Editor) => boolean> = {
    bold: editor => editor.isActive('bold'),
    italic: editor => editor.isActive('italic'),
    underline: editor => editor.isActive('underline'),
    strike: editor => editor.isActive('strike'),
    highlight: editor => editor.isActive('highlight'),
    blockquote: editor => editor.isActive('blockquote'),
    codeBlock: editor => editor.isActive('codeBlock'),
    link: editor => editor.isActive('link'),
    alignLeft: editor => editor.isActive({ textAlign: 'left' }),
    alignCenter: editor => editor.isActive({ textAlign: 'center' }),
    alignRight: editor => editor.isActive({ textAlign: 'right' }),
    alignJustify: editor => editor.isActive({ textAlign: 'justify' }),
    heading: editor => editor.isActive('heading'),
    list: editor =>
      editor.isActive('bulletList') ||
      editor.isActive('orderedList') ||
      editor.isActive('taskList'),
    undo: () => false,
    redo: () => false,
    clearFormat: () => false,
  }

  const canRunSelectors: Record<ToolbarActionType, (editor: Editor) => boolean> = {
    undo: editor => editor.can().undo(),
    redo: editor => editor.can().redo(),
    bold: editor => editor.can().toggleBold(),
    italic: editor => editor.can().toggleItalic(),
    underline: editor => editor.can().toggleUnderline(),
    strike: editor => editor.can().toggleStrike(),
    highlight: editor => editor.can().toggleHighlight(),
    blockquote: editor => editor.can().toggleBlockquote(),
    codeBlock: editor => editor.can().toggleCodeBlock(),
    alignLeft: editor => editor.can().setTextAlign('left'),
    alignCenter: editor => editor.can().setTextAlign('center'),
    alignRight: editor => editor.can().setTextAlign('right'),
    alignJustify: editor => editor.can().setTextAlign('justify'),
    clearFormat: editor => editor.can().unsetAllMarks(),
    heading: () => true,
    list: () => true,
    link: () => true,
  }

  return {
    isActive: activeSelectors[action],
    canRun: canRunSelectors[action],
  }
}

// 命令执行映射 - 减少重复代码
const createCommandRunner = (editor: Editor, action: ToolbarActionType) => {
  const commands: Record<ToolbarActionType, (options?: Record<string, unknown>) => void> = {
    undo: () => editor.chain().focus().undo().run(),
    redo: () => editor.chain().focus().redo().run(),
    bold: () => editor.chain().focus().toggleBold().run(),
    italic: () => editor.chain().focus().toggleItalic().run(),
    underline: () => editor.chain().focus().toggleUnderline().run(),
    strike: () => editor.chain().focus().toggleStrike().run(),
    highlight: () => editor.chain().focus().toggleHighlight().run(),
    blockquote: () => editor.chain().focus().toggleBlockquote().run(),
    codeBlock: () => editor.chain().focus().toggleCodeBlock().run(),
    alignLeft: () => editor.chain().focus().setTextAlign('left').run(),
    alignCenter: () => editor.chain().focus().setTextAlign('center').run(),
    alignRight: () => editor.chain().focus().setTextAlign('right').run(),
    alignJustify: () => editor.chain().focus().setTextAlign('justify').run(),
    clearFormat: () => editor.chain().focus().unsetAllMarks().clearNodes().run(),
    heading: options => {
      const level = options?.level as 1 | 2 | 3 | 4 | 5 | 6
      if (level) {
        editor.chain().focus().toggleHeading({ level }).run()
      }
    },
    list: options => {
      const type = options?.type as 'bullet' | 'ordered' | 'task'
      const chain = editor.chain().focus()
      if (type === 'bullet') {
        chain.toggleBulletList().run()
      } else if (type === 'ordered') {
        chain.toggleOrderedList().run()
      } else if (type === 'task') {
        chain.toggleTaskList().run()
      }
    },
    link: () => {
      // TODO: 实现链接功能
    },
  }

  return commands[action]
}

export const useToolbarItem = (
  editor: Editor | null,
  action: ToolbarActionType
): ToolbarItemState => {
  const selectors = useMemo(() => createStateSelector(action), [action])

  // 独立订阅当前项目的激活状态
  const isActive =
    useEditorState<boolean>({
      editor,
      selector: ({ editor }) => (editor ? selectors.isActive(editor) : false),
    }) ?? false

  // 独立订阅当前项目的可执行状态
  const canRun =
    useEditorState<boolean>({
      editor,
      selector: ({ editor }) => (editor ? selectors.canRun(editor) : false),
    }) ?? false

  // 执行命令的回调
  const run = useCallback(
    (options?: Record<string, unknown>) => {
      if (!editor || !canRun) return
      const command = createCommandRunner(editor, action)
      command(options)
    },
    [editor, action, canRun]
  )

  return useMemo(
    () => ({
      isActive,
      canRun,
      run,
    }),
    [isActive, canRun, run]
  )
}
