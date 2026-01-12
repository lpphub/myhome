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

export interface SpaceInvite {
  id: number
  spaceId: number
  spaceName: string
  spaceIcon: string
  inviterId: number
  inviterName: string
  inviterEmail: string
  inviterAvatar?: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
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
