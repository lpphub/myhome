import { z } from 'zod'

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

export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface StorageSchema extends BaseEntity {
  name: string
  type: StorageType
  capacity: number
  description?: string
  tags?: string[]
  image?: string
  location?: string
  itemCount: number
  utilization: number
  lastOrganized?: string
  items: StorageItem[]
}

export interface StorageForm {
  name: string
  type: StorageType
  capacity: number
  description?: string
  tags?: string[]
  image?: string
  location?: string
}

export interface StorageListItem {
  id: string
  name: string
  type: StorageType
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

export const STORAGE_TYPE_LABELS: Record<StorageType, string> = {
  closet: '衣柜',
  'shoe-rack': '鞋架',
  bookshelf: '书架',
  cabinet: '柜子',
  drawer: '抽屉',
  hanger: '衣架',
  other: '其他',
}

export const storageFormSchema = z.object({
  name: z.string().min(1, '请输入收纳点名称'),
  type: z.enum(['closet', 'shoe-rack', 'bookshelf', 'cabinet', 'drawer', 'hanger', 'other']),
  capacity: z.number().min(1, '请输入容量'),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  image: z
    .string()
    .optional()
    .refine(val => !val || /^https?:\/\/|^data:image\//.test(val), '请输入有效的图片URL'),
  location: z.string().optional(),
})

export type StorageFormValues = z.infer<typeof storageFormSchema>
