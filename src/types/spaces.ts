export interface Space {
  id: number
  name: string
  icon: string
  description?: string
  tagCount?: number
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
