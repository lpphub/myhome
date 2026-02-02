import type { Editor, Extensions } from '@tiptap/react'
import type { LucideIcon } from 'lucide-react'

// ==================== 编辑器相关类型 ====================

export interface EditorProps {
  /** 初始内容 (HTML 或 JSON) */
  content?: string | Record<string, unknown>
  /** 占位符文本 */
  placeholder?: string
  /** 是否可编辑 */
  editable?: boolean
  /** 是否自动聚焦 */
  autoFocus?: boolean
  /** 自定义扩展 */
  extensions?: Extensions
  /** 自定义类名 */
  className?: string
  /** 是否显示工具栏 */
  showToolbar?: boolean
  /** 工具栏配置 - 预设模式或自定义模式二选一 */
  toolbar?: ToolbarPreset | ToolbarConfig
  /** 内容变化回调 */
  onChange?: (content: EditorOutput) => void
  /** 聚焦回调 */
  onFocus?: (editor: Editor) => void
  /** 失焦回调 */
  onBlur?: (editor: Editor) => void
  /** 编辑器创建完成回调 */
  onReady?: (editor: Editor) => void
  /** 字数限制 */
  characterLimit?: number
}

export interface EditorRef {
  /** 获取编辑器实例 */
  getEditor: () => Editor | null
  /** 获取内容 */
  getContent: () => EditorOutput | null
  /** 设置内容 */
  setContent: (content: string | Record<string, unknown>) => void
  /** 清空内容 */
  clearContent: () => void
  /** 聚焦 */
  focus: () => void
  /** 插入内容 */
  insertContent: (content: string) => void
}

export interface EditorOutput {
  /** HTML 格式内容 */
  html: string
  /** JSON 格式内容 */
  json: Record<string, unknown>
  /** 纯文本内容 */
  text: string
  /** 字符数 */
  characterCount?: number
  /** 单词数 */
  wordCount?: number
}

// ==================== 工具栏相关类型 ====================

export type ToolbarMode = 'sticky' | 'bubble'
export type ToolbarPreset = 'simple' | 'article' | 'full'

export type ToolbarItemType = 'button' | 'select' | 'divider' | 'custom'
export type ToolbarActionType =
  | 'undo'
  | 'redo'
  | 'heading'
  | 'list'
  | 'blockquote'
  | 'codeBlock'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'highlight'
  | 'link'
  | 'alignLeft'
  | 'alignCenter'
  | 'alignRight'
  | 'alignJustify'
  | 'clearFormat'

export interface ToolbarSelectOption {
  label: string
  value: string | number
  icon?: LucideIcon
}

export interface ToolbarItem {
  /** 唯一标识 */
  id: string
  /** 类型 */
  type: ToolbarItemType
  /** 操作类型 */
  action?: ToolbarActionType
  /** 图标 */
  icon?: LucideIcon
  /** 标题/提示 */
  title?: string
  /** 快捷键提示 */
  shortcut?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 下拉选项 (type 为 select 时) */
  options?: ToolbarSelectOption[]
  /** 自定义点击处理 */
  onClick?: (editor: Editor) => void
}

// ==================== 工具栏配置类型 ====================

/**
 * 工具栏配置
 * 统一的工具栏配置接口，包含模式和项目
 */
export interface ToolbarConfig {
  /** 工具栏显示模式 */
  mode: ToolbarMode
  /** 工具栏项目 */
  items: ToolbarItem[]
}

/**
 * 工具栏组件属性
 * 用于工具栏组件的 props 类型
 */
export interface ToolbarProps {
  /** 编辑器实例 */
  editor: Editor | null
  /** 配置 */
  config?: ToolbarConfig
  /** 自定义类名 */
  className?: string
}
