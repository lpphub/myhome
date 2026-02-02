import { memo } from 'react'
import type { ToolbarItem, ToolbarProps } from '@/components/editor/types'
import { cn } from '@/lib/utils'
import { HeadingSelect, HighlightPopover, LinkDialog, ListSelect } from '../controls'
import { ToolbarButton, ToolbarDivider } from '../primitives'

/**
 * 粘性定位工具栏组件
 * 滚动时固定在容器顶部
 * 每个工具栏项目独立订阅状态，避免整体重渲染
 */
export const StickyToolbar = memo<ToolbarProps>(({ editor, config, className }) => {
  if (!editor || !config) return null

  const { items } = config

  return (
    <div
      className={cn(
        'sticky top-0 z-10 flex flex-wrap items-center gap-1 px-2 py-1 bg-slate-50 border-b border-slate-200',
        className
      )}
    >
      {items.map((item: ToolbarItem) => {
        // 分隔符
        if (item.type === 'divider') {
          return <ToolbarDivider key={item.id} />
        }

        // 按钮类型
        if (item.type === 'button' && item.icon && item.action) {
          return (
            <ToolbarButton
              key={item.id}
              editor={editor}
              action={item.action}
              icon={item.icon}
              title={item.title}
              shortcut={item.shortcut}
              onClick={item.onClick}
            />
          )
        }

        // 选择器类型
        if (item.type === 'select' && item.options) {
          // 标题选择器
          if (item.action === 'heading') {
            return (
              <HeadingSelect
                key={item.id}
                editor={editor}
                options={item.options}
                title={item.title}
              />
            )
          }

          // 列表选择器
          if (item.action === 'list') {
            return (
              <ListSelect key={item.id} editor={editor} options={item.options} title={item.title} />
            )
          }
        }

        // 内置自定义组件
        if (item.type === 'custom') {
          if (item.id === 'highlight') {
            return <HighlightPopover key={item.id} editor={editor} title={item.title} />
          }
          if (item.id === 'link') {
            return <LinkDialog key={item.id} editor={editor} title={item.title} />
          }
        }

        return null
      })}
    </div>
  )
})

StickyToolbar.displayName = 'StickyToolbar'
