export interface Space {
  id: string
  name: string
  icon: string
  color: string
  description?: string
  coverImage?: string
  noteCount?: number
  createdAt: string
  updatedAt: string
}

export interface SpaceForm {
  name: string
  icon: string
  color: string
  description?: string
  coverImage?: string
}

export interface Tag {
  id: string
  spaceId: string
  groupId: string
  title: string
  content?: string
  color: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface TagForm {
  title: string
  content?: string
  color: string
  groupId: string
}

export interface Group {
  id: string
  spaceId: string
  name: string
  order: number
  createdAt: string
}

export interface GroupForm {
  name: string
}

export const SPACE_COLORS = [
  { name: '蜂蜜', value: 'honey', class: 'bg-honey-100 border-honey-300 text-honey-900' },
  { name: '珊瑚', value: 'coral', class: 'bg-coral-100 border-coral-300 text-coral-900' },
  {
    name: '薰衣草',
    value: 'lavender',
    class: 'bg-lavender-100 border-lavender-300 text-lavender-900',
  },
  { name: '柠檬', value: 'lemon', class: 'bg-lemon-100 border-lemon-300 text-lemon-900' },
  { name: '薄荷', value: 'mint', class: 'bg-teal-50 border-teal-300 text-teal-900' },
  { name: '奶油', value: 'cream', class: 'bg-cream-100 border-cream-300 text-cream-900' },
  { name: '粉色', value: 'pink', class: 'bg-pink-100 border-pink-300 text-pink-900' },
] as const

export const TAG_COLORS = [
  {
    name: '明黄',
    value: 'yellow',
    class: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    dot: 'bg-yellow-400',
  },
  { name: '天蓝', value: 'sky', class: 'bg-sky-50 border-sky-200 text-sky-900', dot: 'bg-sky-400' },
  {
    name: '薄荷',
    value: 'mint',
    class: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    dot: 'bg-emerald-400',
  },
  {
    name: '玫瑰',
    value: 'rose',
    class: 'bg-rose-50 border-rose-200 text-rose-900',
    dot: 'bg-rose-400',
  },
  {
    name: '紫罗兰',
    value: 'violet',
    class: 'bg-violet-50 border-violet-200 text-violet-900',
    dot: 'bg-violet-400',
  },
  {
    name: '橙色',
    value: 'orange',
    class: 'bg-orange-50 border-orange-200 text-orange-900',
    dot: 'bg-orange-400',
  },
  {
    name: '灰色',
    value: 'gray',
    class: 'bg-zinc-50 border-zinc-200 text-zinc-900',
    dot: 'bg-zinc-400',
  },
] as const

export const SPACE_ICONS = [
  '🏠',
  '🛋️',
  '🪴',
  '📚',
  '🍳',
  '🛏️',
  '🚿',
  '🧸',
  '🎨',
  '💻',
  '🏃',
  '🎵',
  '🎬',
  '🍵',
  '🌙',
  '☀️',
  '⭐',
  '🎯',
  '💡',
  '📝',
] as const
