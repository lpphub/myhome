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
  id: string
  name: string
  icon: string
  labels: Label[]
}

export interface LabelFormData {
  name: string
  category: string
  color?: string
}

export interface ReorderRequest {
  items: {
    id: number
    category: string
    order: number
  }[]
}
