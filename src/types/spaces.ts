export interface Space {
  id: number
  name: string
  icon: string
  description?: string
  tagCount?: number
  memberCount?: number
  pin?: boolean
  owner: number
  createdAt: string
  updatedAt: string
}

export interface SpaceForm {
  id?: number
  name: string
  icon: string
  description?: string
}

export interface SpaceMember {
  id: number
  spaceId: number
  userId: number
  name: string
  email: string
  avatar?: string
  isOwner: boolean
  joinedAt: string
}

export interface InviteMemberForm {
  email: string
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
