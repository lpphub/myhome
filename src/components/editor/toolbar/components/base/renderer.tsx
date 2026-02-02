import type { Editor } from '@tiptap/react'
import { memo } from 'react'
import type { ToolbarConfig, ToolbarMode } from '@/components/editor/types'
import { BubbleToolbar } from './bubble'
import { StickyToolbar } from './sticky'

export interface ToolbarRendererProps {
  /** 编辑器实例 */
  editor: Editor | null
  /** 工具栏配置 */
  config: ToolbarConfig
  /** 自定义类名 */
  className?: string
}

/**
 * 验证工具栏模式是否有效
 * @param mode - 要验证的模式
 * @returns 有效的工具栏模式，无效时返回 'sticky'
 */
function validateMode(mode: ToolbarMode): ToolbarMode {
  const validModes: ToolbarMode[] = ['sticky', 'bubble']
  return validModes.includes(mode) ? mode : 'sticky'
}

/**
 * 工具栏渲染器组件
 * 根据模式切换不同的工具栏显示方式
 *
 * 支持两种模式：
 * - sticky: 粘性定位在编辑器顶部（默认模式）
 * - bubble: 选择文本时出现在选择附近
 *
 * 错误处理：
 * - 对于无效模式值默认为 'sticky' 模式
 * - 编辑器不存在时不渲染工具栏
 * - 配置错误时使用默认工具栏
 */
export const ToolbarRenderer = memo<ToolbarRendererProps>(({ editor, config, className }) => {
  // 如果编辑器不存在，不渲染任何工具栏
  if (!editor) {
    return null
  }

  try {
    // 验证配置对象
    const safeConfig = config || { mode: 'sticky', items: [] }

    // 验证并清理模式参数
    const validatedMode = validateMode(safeConfig.mode)

    // 如果模式无效，记录警告
    if (validatedMode !== safeConfig.mode) {
      console.warn(`Invalid toolbar mode "${safeConfig.mode}", falling back to "sticky" mode`)
    }

    // 根据模式渲染对应的工具栏组件
    switch (validatedMode) {
      case 'bubble':
        return <BubbleToolbar editor={editor} config={safeConfig} className={className} />

      default:
        // 默认使用 sticky 模式，保持向后兼容性
        // 使用 StickyToolbar 组件，确保不破坏现有功能
        return <StickyToolbar editor={editor} config={safeConfig} className={className} />
    }
  } catch (error) {
    // 捕获任何渲染错误，回退到默认工具栏
    console.error('Error rendering toolbar:', error)
    return (
      <StickyToolbar editor={editor} config={{ mode: 'sticky', items: [] }} className={className} />
    )
  }
})

ToolbarRenderer.displayName = 'ToolbarRenderer'
