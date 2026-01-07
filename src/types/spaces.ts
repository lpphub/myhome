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

export const SPACE_COLORS = [
  { name: '蜂蜜', value: 'honey', class: 'bg-honey-100 border-honey-300 text-honey-900' },
  { name: '珊瑚', value: 'coral', class: 'bg-coral-100 border-coral-300 text-coral-900' },
  {
    name: '薰衣草',
    value: 'lavender',
    class: 'bg-lavender-100 border-lavender-300 text-lavender-900',
  },
  { name: '柠檬', value: 'lemon', class: 'bg-lemon-100 border-lemon-300 text-lemon-900' },
  {
    name: '薄荷',
    value: 'mint-green',
    class: 'bg-mint-green-50 border-mint-green-300 text-mint-green-900',
  },
  { name: '奶油', value: 'cream', class: 'bg-cream-100 border-cream-300 text-cream-900' },
  {
    name: '粉色',
    value: 'macaron-pink',
    class: 'bg-macaron-pink-100 border-macaron-pink-300 text-macaron-pink-900',
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
