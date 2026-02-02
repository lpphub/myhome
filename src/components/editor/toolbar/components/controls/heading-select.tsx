import type { Editor } from '@tiptap/react'
import { memo } from 'react'
import { useHeadingSelect, type HeadingLevel } from '@/components/editor/hooks/useHeadingSelect'
import type { ToolbarSelectOption } from '@/components/editor/types'
import { ToolbarSelect } from '../primitives'

interface HeadingSelectProps {
  /** 编辑器实例 */
  editor: Editor | null
  /** 选项配置 */
  options: ToolbarSelectOption[]
  /** 标题 */
  title?: string
  /** 自定义类名 */
  className?: string
}

/**
 * 标题选择器组件
 * 独立管理标题级别的状态
 */
export const HeadingSelect = memo<HeadingSelectProps>(
  ({ editor, options, title = '标题', className }) => {
    const { currentLevel, isActive, setLevel } = useHeadingSelect(editor)

    // 如果没有选择标题，显示第一个选项的值但不高亮
    const displayValue = currentLevel || options[0]?.value

    return (
      <ToolbarSelect
        options={options}
        value={displayValue}
        placeholder={title}
        isActive={isActive}
        onChange={value => setLevel(value as HeadingLevel)}
        className={className}
      />
    )
  }
)

HeadingSelect.displayName = 'HeadingSelect'
