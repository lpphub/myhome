export type StorageType =
  | 'closet'
  | 'shoe-rack'
  | 'bookshelf'
  | 'cabinet'
  | 'drawer'
  | 'hanger'
  | 'other'

export type SortType =
  | 'utilization-desc'
  | 'utilization-asc'
  | 'count-desc'
  | 'count-asc'
  | 'name-asc'
  | 'name-desc'
  | 'date-desc'
  | 'date-asc'

export interface Storage {
  id: string
  name: string
  type: StorageType
  capacity: number
  itemCount: number
  utilization: number
  lastOrganized?: string
  tags?: string[]
  items: StorageItem[]
  createdAt: string
  updatedAt: string
  image?: string
  description?: string
  location?: string
}

export interface StorageItem {
  id: string
  storagePointId: string
  name: string
  type: string
  quantity: number
  description?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface AddStorageForm {
  name: string
  type: StorageType
  capacity: number
}

export const STORAGE_TYPE_LABELS: Record<StorageType, string> = {
  closet: '衣柜',
  'shoe-rack': '鞋架',
  bookshelf: '书架',
  cabinet: '柜子',
  drawer: '抽屉',
  hanger: '衣架',
  other: '其他',
}
