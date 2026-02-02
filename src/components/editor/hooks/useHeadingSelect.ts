import type { Editor } from '@tiptap/react'
import { useEditorState } from '@tiptap/react'
import { useCallback, useMemo } from 'react'

export type HeadingLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface HeadingSelectState {
  currentLevel: HeadingLevel
  isActive: boolean
  setLevel: (level: HeadingLevel) => void
}

export const useHeadingSelect = (editor: Editor | null): HeadingSelectState => {
  // 当前标题级别
  const currentLevel =
    useEditorState<HeadingLevel>({
      editor,
      selector: ({ editor }) => {
        if (!editor) return 0
        return editor.getAttributes('heading')?.level ?? 0
      },
    }) ?? 0

  // 是否处于标题状态
  const isActive = currentLevel > 0

  // 设置标题级别
  const setLevel = useCallback(
    (level: HeadingLevel) => {
      if (!editor) return

      if (level === 0 || currentLevel === level) {
        editor.chain().focus().clearNodes().setParagraph().run()
      } else {
        editor
          .chain()
          .focus()
          .clearNodes()
          .setHeading({ level })
          .run()
      }
    },
    [editor, currentLevel]
  )

  return useMemo(
    () => ({
      currentLevel,
      isActive,
      setLevel,
    }),
    [currentLevel, isActive, setLevel]
  )
}
