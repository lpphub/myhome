import httpClient from '@/lib/http-client'
import type { CursorPageData, GetNotesQuery, Note, NoteFormData } from '@/types/notes'

enum NotesApi {
  GetNotes = '/notes',
  CreateNote = '/notes',
  UpdateNote = '/notes/:id',
  DeleteNote = '/notes/:id',
}

export const getNotes = (params: GetNotesQuery) =>
  httpClient.get<CursorPageData<Note>>({
    url: NotesApi.GetNotes,
    params,
  })

export const createNote = (data: NoteFormData) =>
  httpClient.post<void>({
    url: NotesApi.CreateNote,
    data,
  })

export const updateNote = (data: Partial<NoteFormData>) =>
  httpClient.patch<void>({
    url: NotesApi.UpdateNote.replace(':id', String(data.id)),
    data,
  })

export const deleteNote = (id: number) =>
  httpClient.delete<void>({
    url: NotesApi.DeleteNote.replace(':id', String(id)),
  })
