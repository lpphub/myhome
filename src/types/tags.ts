export type TagColor = 'lemon' | 'coral' | 'lavender' | 'honey' | 'cream' | 'pink' | 'mint'

export type SortByType =
  | 'custom'
  | 'name-asc'
  | 'name-desc'
  | 'count-asc'
  | 'count-desc'
  | 'date-desc'

export interface Tag {
  id: number
  label: string
  category: string
  color: TagColor
  itemCount: number
  description?: string
  createdAt: string
  updatedAt: string
  sortOrder?: number
}

export interface TagCategory {
  id: number
  code: string
  name: string
  icon: string
  description: string
}

export interface TagFormData {
  label: string
  category: string
  color: TagColor
  description?: string
}

export interface ReorderRequest {
  fromId: number
  toId?: number
  toCategory: string
  toIndex?: number
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
  { value: 'custom', label: '自定义' },
  { value: 'name-asc', label: '名称 A-Z' },
  { value: 'name-desc', label: '名称 Z-A' },
  { value: 'count-asc', label: '物品数 少-多' },
  { value: 'count-desc', label: '物品数 多-少' },
  { value: 'date-desc', label: '创建时间 最新' },
]

export interface TagActions {
  onReorder: (params: ReorderRequest) => void
  onEdit: (tag: Tag) => void
  onDelete: (tagId: number) => void
  onAddTagClick?: (category: string) => void
}
