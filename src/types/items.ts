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
  id: number
  storageId: number
  name: string
  quantity: number
  description?: string
  tags?: string[]
  status: ItemStatus
  image?: string
  location?: string
  purchaseDate?: string
  createdAt: string
  updatedAt: string
}

export interface RecentActivity {
  id: number
  action: string
  itemName: string
  timestamp: string
  icon: React.ReactNode
}

export const ITEM_STATUS_LABELS: Record<ItemStatus, string> = {
  active: '使用中',
  inactive: '闲置',
  lost: '丢失',
  donated: '已捐赠',
}

export const SORT_OPTIONS: { value: SortByType; label: string }[] = [
  { value: 'name-asc', label: '名称 A-Z' },
  { value: 'name-desc', label: '名称 Z-A' },
  { value: 'date-asc', label: '添加时间 早-晚' },
  { value: 'date-desc', label: '添加时间 晚-早' },
  { value: 'quantity-asc', label: '数量 少-多' },
  { value: 'quantity-desc', label: '数量 多-少' },
]
