import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  CodeSquare,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  ListTodo,
  Redo,
  Strikethrough,
  TextQuote,
  Underline,
  Undo,
} from 'lucide-react'
import type { ToolbarItem } from '../../types'

/**
 * 所有可用的工具栏项目
 * 作为构建预设和自定义配置的基础
 */
export const TOOLBAR_ITEMS: Record<string, ToolbarItem> = {
  undo: {
    id: 'undo',
    type: 'button',
    action: 'undo',
    icon: Undo,
    title: '撤销',
    shortcut: 'Mod+Z',
  },
  redo: {
    id: 'redo',
    type: 'button',
    action: 'redo',
    icon: Redo,
    title: '重做',
    shortcut: 'Mod+Shift+Z',
  },
  'divider-1': { id: 'divider-1', type: 'divider' },
  heading: {
    id: 'heading',
    type: 'select',
    action: 'heading',
    title: '标题',
    icon: Heading1,
    options: [
      { label: 'H1', value: 1, icon: Heading1 },
      { label: 'H2', value: 2, icon: Heading2 },
      { label: 'H3', value: 3, icon: Heading3 },
    ],
  },
  list: {
    id: 'list',
    type: 'select',
    action: 'list',
    title: '列表',
    icon: List,
    options: [
      { label: '无序列表', value: 'bullet', icon: List },
      { label: '有序列表', value: 'ordered', icon: ListOrdered },
      { label: '任务列表', value: 'task', icon: ListTodo },
    ],
  },
  blockquote: {
    id: 'blockquote',
    type: 'button',
    action: 'blockquote',
    icon: TextQuote,
    title: '引用',
    shortcut: 'Mod+Shift+B',
  },
  codeBlock: {
    id: 'codeBlock',
    type: 'button',
    action: 'codeBlock',
    icon: CodeSquare,
    title: '代码块',
    shortcut: 'Mod+Alt+C',
  },
  'divider-2': { id: 'divider-2', type: 'divider' },
  bold: {
    id: 'bold',
    type: 'button',
    action: 'bold',
    icon: Bold,
    title: '粗体',
    shortcut: 'Mod+B',
  },
  italic: {
    id: 'italic',
    type: 'button',
    action: 'italic',
    icon: Italic,
    title: '斜体',
    shortcut: 'Mod+I',
  },
  underline: {
    id: 'underline',
    type: 'button',
    action: 'underline',
    icon: Underline,
    title: '下划线',
    shortcut: 'Mod+U',
  },
  strike: {
    id: 'strike',
    type: 'button',
    action: 'strike',
    icon: Strikethrough,
    title: '删除线',
    shortcut: 'Mod+Shift+X',
  },
  highlight: {
    id: 'highlight',
    type: 'custom',
    title: '高亮',
  },
  link: {
    id: 'link',
    type: 'custom',
    title: '链接',
  },
  'divider-3': { id: 'divider-3', type: 'divider' },
  alignLeft: {
    id: 'alignLeft',
    type: 'button',
    action: 'alignLeft',
    icon: AlignLeft,
    title: '左对齐',
  },
  alignCenter: {
    id: 'alignCenter',
    type: 'button',
    action: 'alignCenter',
    icon: AlignCenter,
    title: '居中对齐',
  },
  alignRight: {
    id: 'alignRight',
    type: 'button',
    action: 'alignRight',
    icon: AlignRight,
    title: '右对齐',
  },
  alignJustify: {
    id: 'alignJustify',
    type: 'button',
    action: 'alignJustify',
    icon: AlignJustify,
    title: '两端对齐',
  },
  'divider-4': { id: 'divider-4', type: 'divider' },
  clearFormat: {
    id: 'clearFormat',
    type: 'button',
    action: 'clearFormat',
    icon: Eraser,
    title: '清除格式',
  },
}

/**
 * 获取所有可用的工具栏项目
 * 用于构建自定义配置
 */
export { TOOLBAR_ITEMS as toolbarItems }
