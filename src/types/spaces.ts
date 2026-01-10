export interface Space {
  id: number
  name: string
  icon: string
  description?: string
  tagCount?: number
  pin?: boolean
  createdAt: string
  updatedAt: string
}

export interface SpaceForm {
  id?: number
  name: string
  icon: string
  description?: string
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
