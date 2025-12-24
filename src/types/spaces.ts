export type RoomType =
  | 'bedroom'
  | 'living'
  | 'kitchen'
  | 'bathroom'
  | 'study'
  | 'balcony'
  | 'entrance'
  | 'storage'

export type StorageType =
  | 'closet'
  | 'shoe-rack'
  | 'bookshelf'
  | 'cabinet'
  | 'drawer'
  | 'hanger'
  | 'other'

export type RoomStatus = 'spacious' | 'comfortable' | 'crowded'

export type SortType =
  | 'utilization-desc'
  | 'utilization-asc'
  | 'count-desc'
  | 'count-asc'
  | 'name-asc'
  | 'name-desc'
  | 'date-desc'
  | 'date-asc'

export type FilterType = 'all' | StorageType

export interface Room {
  id: string
  name: string
  type: RoomType
  area: number
  position: { x: number; y: number; width: number; height: number }
  storages: Storage[]
  createdAt: string
  updatedAt: string
}

export interface Storage {
  id: string
  roomId: string
  name: string
  type: StorageType
  capacity: number
  itemCount: number
  utilization: number
  lastOrganized?: string
  items: StorageItem[]
  createdAt: string
  updatedAt: string
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

export interface AddRoomForm {
  name: string
  type: RoomType
  area: number
}

export interface AddItemForm {
  storagePointId: string
  name: string
  type: string
  quantity: number
  description?: string
}

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  bedroom: '卧室',
  living: '客厅',
  kitchen: '厨房',
  bathroom: '卫生间',
  study: '书房',
  balcony: '阳台',
  entrance: '玄关',
  storage: '储物间',
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

export function getRoomStatus(utilization: number): RoomStatus {
  if (utilization < 70) return 'spacious'
  if (utilization < 85) return 'comfortable'
  return 'crowded'
}

export function getRoomStatusColor(status: RoomStatus): string {
  switch (status) {
    case 'spacious':
      return 'lemon'
    case 'comfortable':
      return 'honey'
    case 'crowded':
      return 'coral'
  }
}
