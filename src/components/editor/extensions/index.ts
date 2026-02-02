import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { TableKit } from '@tiptap/extension-table'
import TextAlign from '@tiptap/extension-text-align'
import { Color, TextStyle } from '@tiptap/extension-text-style'
import { CharacterCount, Placeholder } from '@tiptap/extensions'
import type { Extensions } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export interface ExtensionOptions {
  placeholder?: string
  characterLimit?: number
}

/**
 * 创建默认扩展集合
 */
export const createExtensions = (options: ExtensionOptions = {}): Extensions => {
  const { placeholder, characterLimit } = options

  const extensions: Extensions = [
    // 基础套件 (包含常用扩展)
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4, 5, 6] },
      codeBlock: { HTMLAttributes: { class: 'rounded-md bg-slate-100 p-4' } },
      link: {
        openOnClick: false,
        HTMLAttributes: { class: 'text-blue underline cursor-pointer', target: '_blank' },
      },
      blockquote: { HTMLAttributes: { class: 'font-bold' } },
    }),

    // 文本样式
    TextStyle.configure({
      HTMLAttributes: { style: 'font-family: inherit; color: inherit;' },
    }),
    Color,

    // 文本对齐
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),

    // 高亮
    Highlight.configure({ multicolor: true }),

    // 图片
    Image.configure({
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        class: 'rounded-md shadow-md my-4',
      },
    }),

    // 任务列表
    TaskList.configure({ HTMLAttributes: { class: 'list-none pl-0' } }),
    TaskItem.configure({ nested: true }),

    // 表格
    TableKit.configure({
      table: {
        resizable: true,
        HTMLAttributes: { class: 'my-4 border-collapse border border-slate-300' },
      },
      tableCell: {
        HTMLAttributes: { class: 'border border-slate-300 p-2' },
      },
      tableHeader: {
        HTMLAttributes: { class: 'border border-slate-300 p-2 bg-slate-50 font-semibold' },
      },
    }),

    // 字符计数
    CharacterCount.configure({ limit: characterLimit }),
  ]

  // 占位符
  if (placeholder) {
    extensions.push(
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          'before:content-[attr(data-placeholder)] before:text-slate-400 before:float-left before:h-0 before:pointer-events-none',
      })
    )
  }

  return extensions
}

/**
 * 合并扩展
 */
export const mergeExtensions = (
  defaultExtensions: Extensions,
  customExtensions?: Extensions
): Extensions => {
  if (!customExtensions || customExtensions.length === 0) {
    return defaultExtensions
  }

  const customExtensionNames = new Set(customExtensions.map(ext => ext.name))

  const filteredDefaults = defaultExtensions.filter(ext => !customExtensionNames.has(ext.name))

  return [...filteredDefaults, ...customExtensions]
}
