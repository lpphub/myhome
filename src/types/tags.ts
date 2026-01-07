// types/tags.ts
export interface Tag {
  id: number
  name: string
  group: string
  order: number
  color: string
  description?: string
  itemCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface Group {
  id: number
  code: string
  name: string
}

export interface TagGroup extends Group {
  tags: Tag[]
}

export interface TagFormData {
  id?: number
  name: string
  group: string
  description?: string
  color: string
}

export interface ReorderParams {
  fromId: number
  toGroup: string
  toIndex: number
}

export const TAG_COLOR_CLASSES: Record<string, { bg: string; border: string; text: string }> = {
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
  'macaron-pink': {
    bg: 'bg-macaron-pink-100',
    border: 'border-macaron-pink-200',
    text: 'text-macaron-pink-900',
  },
  'mint-green': {
    bg: 'bg-mint-green-50',
    border: 'border-mint-green-200',
    text: 'text-mint-green-900',
  },
}
