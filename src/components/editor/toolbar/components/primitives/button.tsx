import type { Editor } from '@tiptap/react'
import type { LucideIcon } from 'lucide-react'
import type React from 'react'
import { forwardRef, memo, useCallback } from 'react'
import { useToolbarItem } from '@/components/editor/hooks/useToolbarItem'
import type { ToolbarActionType } from '@/components/editor/types'
import { formatShortcut } from '@/components/editor/utils'
import { cn } from '@/lib/utils'

interface ToolbarButtonProps {
  /** 编辑器实例 */
  editor: Editor | null
  /** 操作类型 */
  action: ToolbarActionType
  /** 图标 */
  icon: LucideIcon
  /** 标题 */
  title?: string
  /** 快捷键 */
  shortcut?: string
  /** 自定义类名 */
  className?: string
  /** 自定义点击处理 */
  onClick?: (editor: Editor) => void
}

/**
 * 工具栏按钮组件
 * 每个按钮独立订阅自己的状态，避免整体重渲染
 */
export const ToolbarButton = memo(
  forwardRef<HTMLButtonElement, ToolbarButtonProps>(
    ({ editor, action, icon: Icon, title, shortcut, className, onClick }, ref) => {
      const { isActive, canRun, run } = useToolbarItem(editor, action)

      const handleClick = useCallback(
        (e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()

          if (!editor || !canRun) return

          // 如果有自定义点击处理，优先使用
          if (onClick) {
            onClick(editor)
          } else {
            run()
          }
        },
        [editor, canRun, onClick, run]
      )

      const tooltipText = shortcut ? `${title} (${formatShortcut(shortcut)})` : title

      return (
        <button
          ref={ref}
          type='button'
          onClick={handleClick}
          disabled={!canRun}
          title={tooltipText}
          className={cn(
            'inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors',
            'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            isActive && 'bg-blue-100 text-blue-600 hover:bg-blue-200',
            className
          )}
          aria-label={title}
          aria-pressed={isActive}
        >
          <Icon className='w-3.5 h-3.5' />
        </button>
      )
    }
  )
)

ToolbarButton.displayName = 'ToolbarButton'
