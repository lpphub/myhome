// types/label.ts
export interface Label {
  id: number
  name: string
  category: string
  order: number
  color: string
  description?: string
  itemCount: number
}

export interface LabelCategory {
  id: number
  code: string
  name: string
  icon: string
  labels: Label[]
}

export interface LabelFormData {
  id?: number
  name: string
  category: string
  description?: string
  color?: string
}

export interface ReorderRequest {
  items: {
    id: number
    category: string
    order: number
  }[]
}

export const LABEL_COLOR_CLASSES: Record<string, { bg: string; border: string; text: string }> = {
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
  pink: {
    bg: 'bg-pink-100',
    border: 'border-pink-200',
    text: 'text-pink-900',
  },
  mint: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-900',
  },
}
