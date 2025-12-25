export type ItemCategory = 'clothing' | 'electronics' | 'books' | 'kitchen' | 'decor' | 'other'

export type ItemStatus = 'active' | 'inactive' | 'lost' | 'donated'

export type ViewMode = 'card' | 'list'

export type SortByType =
  | 'name-asc'
  | 'name-desc'
  | 'date-asc'
  | 'date-desc'
  | 'quantity-asc'
  | 'quantity-desc'

export type FilterStatus = 'all' | ItemStatus

export interface Item {
  id: string
  storagePointId: string
  name: string
  category: ItemCategory
  type: string
  quantity: number
  price?: number
  description?: string
  tags?: string[]
  status: ItemStatus
  image?: string
  location?: string
  purchaseDate?: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  type: ItemCategory
  count: number
  icon: React.ReactNode
}

export interface RecentActivity {
  id: string
  action: string
  itemName: string
  timestamp: string
  icon: React.ReactNode
}

export const ITEM_CATEGORY_LABELS: Record<ItemCategory, string> = {
  clothing: '衣物',
  electronics: '电子产品',
  books: '书籍',
  kitchen: '厨房用品',
  decor: '装饰品',
  other: '其他',
}

export const ITEM_STATUS_LABELS: Record<ItemStatus, string> = {
  active: '使用中',
  inactive: '闲置',
  lost: '丢失',
  donated: '已捐赠',
}

export const CATEGORY_ICONS: Record<ItemCategory, string> = {
  clothing: '👕',
  electronics: '📱',
  books: '📚',
  kitchen: '🍳',
  decor: '🎨',
  other: '📦',
}

export const SORT_OPTIONS: { value: SortByType; label: string }[] = [
  { value: 'name-asc', label: '名称 A-Z' },
  { value: 'name-desc', label: '名称 Z-A' },
  { value: 'date-asc', label: '添加时间 早-晚' },
  { value: 'date-desc', label: '添加时间 晚-早' },
  { value: 'quantity-asc', label: '数量 少-多' },
  { value: 'quantity-desc', label: '数量 多-少' },
]
