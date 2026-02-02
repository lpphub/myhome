import type { Editor } from '@tiptap/react'
import { Highlighter, X } from 'lucide-react'
import { memo, useCallback, useState } from 'react'
import { useToolbarItem } from '@/components/editor/hooks/useToolbarItem'
import { Popover } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface HighlightPopoverProps {
  /** 编辑器实例 */
  editor: Editor | null
  /** 标题 */
  title?: string
  /** 自定义类名 */
  className?: string
}

// 预定义的高亮颜色 - 4种颜色，一行显示
const HIGHLIGHT_COLORS = [
  { name: '黄色', value: '#fef08a', class: 'bg-yellow-200 hover:bg-yellow-300' },
  { name: '绿色', value: '#bbf7d0', class: 'bg-green-200 hover:bg-green-300' },
  { name: '蓝色', value: '#bfdbfe', class: 'bg-blue-200 hover:bg-blue-300' },
  { name: '紫色', value: '#e9d5ff', class: 'bg-purple-200 hover:bg-purple-300' },
]

/**
 * 高亮颜色选择器组件
 * 使用 Popover 展示颜色选择面板
 */
export const HighlightPopover = memo<HighlightPopoverProps>(
  ({ editor, title = '高亮', className }) => {
    const [isOpen, setIsOpen] = useState(false)
    const { isActive, canRun } = useToolbarItem(editor, 'highlight')

    const handleHighlight = useCallback(
      (color: string) => {
        if (!editor || !canRun) return

        if (isActive) {
          // 如果已经高亮，先取消高亮再应用新颜色
          editor.chain().focus().unsetHighlight().setHighlight({ color }).run()
        } else {
          // 直接应用高亮颜色
          editor.chain().focus().setHighlight({ color }).run()
        }
        setIsOpen(false)
      },
      [editor, canRun, isActive]
    )

    const handleRemoveHighlight = useCallback(() => {
      if (!editor || !canRun) return
      editor.chain().focus().unsetHighlight().run()
      setIsOpen(false)
    }, [editor, canRun])

    const trigger = (
      <button
        type='button'
        disabled={!canRun}
        title={title}
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
        <Highlighter className='w-3.5 h-3.5' />
      </button>
    )

    const content = (
      <div className='bg-white border border-slate-200 rounded-lg shadow-lg p-2'>
        <div className='flex items-center gap-2'>
          {HIGHLIGHT_COLORS.map(color => (
            <button
              key={color.value}
              type='button'
              onClick={() => handleHighlight(color.value)}
              className={cn(
                'w-6 h-6 rounded-md border border-slate-300 transition-all duration-200',
                'hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
                color.class
              )}
              title={color.name}
              aria-label={`高亮颜色：${color.name}`}
            />
          ))}

          {isActive && (
            <button
              type='button'
              onClick={handleRemoveHighlight}
              className='w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors'
              title='移除高亮'
              aria-label='移除高亮'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>
      </div>
    )

    return (
      <Popover
        trigger={trigger}
        content={content}
        open={isOpen}
        onOpenChange={setIsOpen}
        align='start'
        side='bottom'
        sideOffset={8}
      />
    )
  }
)

HighlightPopover.displayName = 'HighlightPopover'
