export interface Note {
  id: number
  spaceId: number
  userId: number
  content: string
  createdAt: string
  updatedAt: string
}

export interface NoteFormData {
  id?: number
  content: string
  spaceId?: number
}

export interface CursorPageData<T> {
  list: T[]
  hasMore: boolean
  nextCursor?: string
}

export interface GetNotesQuery {
  limit: number
  cursor?: string
  spaceId: number
}
