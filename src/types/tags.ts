export type TagCategory = 'room' | 'type' | 'functional'

export type TagColor = 'lemon' | 'coral' | 'lavender' | 'honey' | 'cream' | 'pink' | 'mint'

export type SortByType = 'name-asc' | 'name-desc' | 'count-asc' | 'count-desc' | 'date-desc'

export interface Tag {
  id: number
  name: string
  category: TagCategory
  color: TagColor
  itemCount: number
  description?: string
  createdAt: string
  updatedAt: string
}

export const TAG_CATEGORY_LABELS: Record<TagCategory, string> = {
  room: '房间便签',
  type: '类型便签',
  functional: '功能便签',
}

export const TAG_COLOR_LABELS: Record<TagColor, string> = {
  lemon: '柠檬黄',
  coral: '珊瑚粉',
  lavender: '薰衣草',
  honey: '奶茶色',
  cream: '奶油白',
  pink: '樱花粉',
  mint: '薄荷绿',
}

export const TAG_COLOR_CLASSES: Record<TagColor, { bg: string; border: string; text: string }> = {
  lemon: {
    bg: 'bg-lemon-100',
    border: 'border-lemon-200',
    text: 'text-lemon-900',
  },
  coral: {
    bg: 'bg-coral-100',
    border: 'border-coral-200',
    text: 'text-coral-900',
  },
  lavender: {
    bg: 'bg-lavender-100',
    border: 'border-lavender-200',
    text: 'text-lavender-900',
  },
  honey: {
    bg: 'bg-honey-100',
    border: 'border-honey-200',
    text: 'text-honey-900',
  },
  cream: {
    bg: 'bg-cream-100',
    border: 'border-cream-200',
    text: 'text-cream-900',
  },
  pink: {
    bg: 'bg-pink-100',
    border: 'border-pink-200',
    text: 'text-pink-900',
  },
  mint: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-900',
  },
}

export const SORT_OPTIONS: { value: SortByType; label: string }[] = [
  { value: 'name-asc', label: '名称 A-Z' },
  { value: 'name-desc', label: '名称 Z-A' },
  { value: 'count-asc', label: '物品数 少-多' },
  { value: 'count-desc', label: '物品数 多-少' },
  { value: 'date-desc', label: '创建时间 最新' },
]
