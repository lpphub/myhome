// Tag categories enum
export type TagCategory = '房间' | '功能' | '类型' | '人群' | '安全' | '频率' | '存储'

// Theme color mapping for sticky notes
export type TagColor = 'honey' | 'coral' | 'lavender' | 'lemon' | 'cream'

// Main TagInfo interface
export interface TagInfo {
  id: string
  name: string
  category: TagCategory
  parentId: string | null
  color: TagColor
  securityFlag: boolean
  count: number
  aliases: string[]
  description?: string
}

// Category info type
export interface CategoryInfo {
  name: TagCategory
  count: number
  color: TagColor
}

// Stats type
export interface TagStats {
  totalTags: number
  totalItems: number
  securityTags: number
  unusedTags: number
}

// API response structure
export interface TagsData {
  tags: TagInfo[]
  categories: CategoryInfo[]
  stats: TagStats
}
