import type { Editor } from '@tiptap/react'
import { useEditorState } from '@tiptap/react'
import { useCallback, useMemo } from 'react'

/**
 * 列表选择器的状态管理 Hook
 * 独立管理列表类型的状态和操作
 */
export interface ListSelectState {
  currentType: string
  isActive: boolean
  setType: (type: string) => void
}

export const useListSelect = (editor: Editor | null): ListSelectState => {
  // 独立订阅当前列表类型
  const currentType =
    useEditorState<string>({
      editor,
      selector: ({ editor }) => {
        if (!editor) return ''

        if (editor.isActive('bulletList')) return 'bullet'
        if (editor.isActive('orderedList')) return 'ordered'
        if (editor.isActive('taskList')) return 'task'
        return ''
      },
    }) ?? ''

  // 是否处于列表状态
  const isActive = currentType !== ''

  // 设置列表类型
  const setType = useCallback(
    (type: string) => {
      if (!editor) return

      const chain = editor.chain().focus()

      switch (type) {
        case 'bullet':
          chain.toggleBulletList().run()
          break
        case 'ordered':
          chain.toggleOrderedList().run()
          break
        case 'task':
          chain.toggleTaskList().run()
          break
        case '':
          // 取消列表
          if (editor.isActive('bulletList')) {
            chain.toggleBulletList().run()
          } else if (editor.isActive('orderedList')) {
            chain.toggleOrderedList().run()
          } else if (editor.isActive('taskList')) {
            chain.toggleTaskList().run()
          }
          break
      }
    },
    [editor]
  )

  return useMemo(
    () => ({
      currentType,
      isActive,
      setType,
    }),
    [currentType, isActive, setType]
  )
}
