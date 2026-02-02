// types/tags.ts
export interface Tag {
  id: number
  spaceId?: number
  content: string // Tiptap JSON content (replaces name and description)
  groupId: number
  order: number
  color: string
  itemCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface Group {
  id: number
  name: string
  spaceId?: number
}

export interface TagGroup extends Group {
  tags: Tag[]
}

export interface TagFormData {
  id?: number
  content?: string // Tiptap JSON content
  groupId?: number
  color?: string
  spaceId?: number
}

export interface ReorderParams {
  fromId: number
  toGroupId: number
  toIndex: number
}

export const TAG_COLOR_CLASSES: Record<string, { classes: string; name: string }> = {
  lemon: {
    name: '柠檬',
    classes: 'bg-lemon-100 border-lemon-200 text-lemon-900',
  },
  coral: {
    name: '珊瑚',
    classes: 'bg-coral-100 border-coral-200 text-coral-900',
  },
  lavender: {
    name: '薰衣草',
    classes: 'bg-lavender-100 border-lavender-200 text-lavender-900',
  },
  honey: {
    name: '蜂蜜',
    classes: 'bg-honey-100 border-honey-100 text-honey-900',
  },
  cream: {
    name: '奶油',
    classes: 'bg-cream-200 border-cream-200 text-cream-900',
  },
  'macaron-pink': {
    name: '马卡龙粉',
    classes: 'bg-macaron-pink-100 border-macaron-pink-200 text-macaron-pink-900',
  },
  'mint-green': {
    name: '薄荷绿',
    classes: 'bg-mint-green-50 border-mint-green-200 text-mint-green-900',
  },
}

export const getTagBgColorClass = (color: string): string => {
  return `bg-${color}-100`
}
