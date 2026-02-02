import type { Editor } from '@tiptap/react'
import { memo } from 'react'
import { useListSelect } from '@/components/editor/hooks/useListSelect'
import type { ToolbarSelectOption } from '@/components/editor/types'
import { ToolbarSelect } from '../primitives'

interface ListSelectProps {
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
 * 列表选择器组件
 * 独立管理列表类型的状态
 */
export const ListSelect = memo<ListSelectProps>(
  ({ editor, options, title = '列表', className }) => {
    const { currentType, isActive, setType } = useListSelect(editor)

    // 当没有选择列表时，显示第一个选项但不激活
    const displayValue = currentType || options[0]?.value

    return (
      <ToolbarSelect
        options={options}
        value={displayValue}
        placeholder={title}
        isActive={isActive}
        onChange={value => setType(String(value))}
        className={className}
      />
    )
  }
)

ListSelect.displayName = 'ListSelect'
