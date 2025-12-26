export type SortType =
  | 'utilization-desc'
  | 'utilization-asc'
  | 'count-desc'
  | 'count-asc'
  | 'name-asc'
  | 'name-desc'
  | 'date-desc'
  | 'date-asc'

export interface StorageSchema {
  id: number
  createdAt: string
  updatedAt: string
  name: string
  capacity: number
  description?: string
  tags?: string[]
  image?: string
  itemCount: number
  utilization: number
  lastOrganized?: string
  items: StorageItem[]
}

export interface StorageForm {
  name: string
  capacity: number
  description?: string
  tags?: string[]
  image?: string
}

export interface StorageListItem {
  id: string
  name: string
  itemCount: number
  utilization: number
  tags?: string[]
  image?: string
  description?: string
  lastOrganized?: string
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
