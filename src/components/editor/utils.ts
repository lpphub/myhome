import { generateHTML } from '@tiptap/core'
import type { Editor } from '@tiptap/react'
import { createExtensions } from './extensions'
import type { EditorOutput } from './types'

/**
 * 获取编辑器内容
 * @param editor - 编辑器实例
 * @returns 包含 HTML、JSON、文本、字符数和单词数的对象
 */
export const getEditorContent = (editor: Editor | null): EditorOutput | null => {
  if (!editor) return null

  const html = editor.getHTML()
  const json = editor.getJSON()
  const text = editor.getText()

  // 使用 CharacterCount 扩展获取统计
  const characterCount = editor.storage.characterCount?.characters() ?? text.length
  const wordCount = editor.storage.characterCount?.words() ?? countWords(text)

  return {
    html,
    json,
    text,
    characterCount,
    wordCount,
  }
}

/**
 * 解析编辑器内容，返回 HTML、JSON 和纯文本
 * @param content - 编辑器内容（JSON 字符串或对象）
 * @returns 包含 HTML、JSON 和纯文本的对象
 */
export const parseEditorContent = (content: string): EditorOutput => {
  if (!content) return { html: '', json: {}, text: '' }

  try {
    const doc = typeof content === 'string' ? JSON.parse(content) : content
    const extensions = createExtensions()

    const html = generateHTML(doc, extensions)

    const text = generateText(doc)

    return { html, json: doc, text }
  } catch {
    return { html: '', json: {}, text: '' }
  }
}

function generateText(node: Record<string, unknown>): string {
  if (!node) return ''

  let result = ''

  if (node.text) {
    result += node.text
  }

  if (node.content && Array.isArray(node.content)) {
    for (const child of node.content) {
      result += generateText(child)
    }
  }

  return result
}

/**
 * 计算单词数
 */
export const countWords = (text: string): number => {
  if (!text) return 0

  // 处理中文和英文混合
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || []
  const englishWords = text
    .replace(/[\u4e00-\u9fa5]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)

  return chineseChars.length + englishWords.length
}

/**
 * 防抖函数
 */
// biome-ignore lint/suspicious/noExplicitAny: 允许使用 any 类型，因为 T 是一个泛型参数，无法确定具体类型
export const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * 节流函数
 */
// biome-ignore lint/suspicious/noExplicitAny: 允许使用 any 类型，因为 T 是一个泛型参数，无法确定具体类型
export const throttle = <T extends (...args: any[]) => void>(fn: T, limit: number) => {
  let inThrottle = false
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * 格式化快捷键显示
 */
export const formatShortcut = (shortcut: string): string => {
  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform)

  return shortcut
    .replace(/Mod/g, isMac ? '⌘' : 'Ctrl')
    .replace(/Alt/g, isMac ? '⌥' : 'Alt')
    .replace(/Shift/g, isMac ? '⇧' : 'Shift')
}
