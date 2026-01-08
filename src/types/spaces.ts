export interface Space {
  id: number
  name: string
  icon: string
  color: string
  description?: string
  tagCount?: number
  createdAt: string
  updatedAt: string
}

export interface SpaceForm {
  id?: number
  name: string
  icon: string
  color: string
  description?: string
}

export const SPACE_COLOR_CLASSES: Record<string, { classes: string; name: string }> = {
  honey: {
    name: '蜂蜜',
    classes: 'bg-honey-100 border-honey-300 text-honey-900',
  },
  coral: {
    name: '珊瑚',
    classes: 'bg-coral-100 border-coral-300 text-coral-900',
  },
  lavender: {
    name: '薰衣草',
    classes: 'bg-lavender-100 border-lavender-300 text-lavender-900',
  },
  lemon: {
    name: '柠檬',
    classes: 'bg-lemon-100 border-lemon-300 text-lemon-900',
  },
  'mint-green': {
    name: '薄荷',
    classes: 'bg-mint-green-50 border-mint-green-300 text-mint-green-900',
  },
  'macaron-pink': {
    name: '粉色',
    classes: 'bg-macaron-pink-100 border-macaron-pink-300 text-macaron-pink-900',
  },
}

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
