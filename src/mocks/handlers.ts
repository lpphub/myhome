import { HttpResponse, http } from 'msw'
import type { Note } from '@/types/notes'

// 通用的 Mock 数据加载函数
// biome-ignore lint/suspicious/noExplicitAny: mock any
async function loadMockData<T>(path: string, transform?: (data: any) => T): Promise<T> {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`Failed to load ${path}`)
  const data = await res.json()
  return transform ? transform(data) : data
}

const loadNotesData = () => loadMockData<{ notes: Array<Note> }>('/data/notes.json', data => data)

export const handlers = [
  http.get('/api/notes', async ({ request }) => {
    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get('limit') || '10', 10)
    const cursor = url.searchParams.get('cursor')

    const data = await loadNotesData()
    const sortedNotes = data.notes.sort(
      (a: Note, b: Note) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )

    let startIndex = 0
    if (cursor) {
      startIndex = sortedNotes.findIndex((note: Note) => note.id === Number.parseInt(cursor, 10))
      if (startIndex === -1) startIndex = 0
      else startIndex += 1 // Start after the cursor
    }

    const paginatedNotes = sortedNotes.slice(startIndex, startIndex + limit)
    const hasMore = startIndex + limit < sortedNotes.length
    const nextCursor = hasMore ? String(paginatedNotes[paginatedNotes.length - 1].id) : undefined

    return HttpResponse.json({
      code: 200,
      message: '获取笔记成功',
      data: {
        list: paginatedNotes,
        hasMore,
        nextCursor,
      },
    })
  }),
]
