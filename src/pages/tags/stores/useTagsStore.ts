import { create } from 'zustand'
import type { Group, Tag, TagFormData, TagGroup } from '@/types/tags'

interface LocalTagsState {
  /* ===== context and data ===== */
  spaceId: number | null
  tags: TagGroup[]

  /* ===== context actions ===== */
  reset: () => void
  restore: (tags: TagGroup[]) => void

  /* ===== data actions ===== */
  initTags: (spaceId: number, tags: TagGroup[]) => void
  addTag: (tag: Tag) => void
  updateTag: (data: TagFormData) => void
  deleteTag: (tagId: number) => void
  reorder: (next: TagGroup[]) => void
  addGroup: (group: Group) => void
  deleteGroup: (groupCode: string) => void
}

export const useTagsStore = create<LocalTagsState>(set => ({
  /* ===== data context ===== */
  spaceId: null,
  tags: [],

  /* ---------------- context ---------------- */
  reset: () => set({ tags: [], spaceId: null }),
  restore: (tags: TagGroup[]) => set({ tags }),

  /* ---------------- data ---------------- */
  initTags: (spaceId: number, tags: TagGroup[]) =>
    set({
      spaceId,
      tags,
    }),

  addTag: tag =>
    set(state => ({
      tags: state.tags.map(group =>
        group.code === tag.group ? { ...group, tags: [...group.tags, tag] } : group
      ),
    })),

  updateTag: data =>
    set(state => ({
      tags: state.tags.map(group =>
        group.code === data.group
          ? {
              ...group,
              tags: group.tags.map(tag => (tag.id === data.id ? { ...tag, ...data } : tag)),
            }
          : group
      ),
    })),

  deleteTag: tagId =>
    set(state => ({
      tags: state.tags.map(group => ({
        ...group,
        tags: group.tags.filter(tag => tag.id !== tagId),
      })),
    })),

  reorder: next => set({ tags: next }),

  addGroup: group =>
    set(state => ({
      tags: [...state.tags, { ...group, tags: [] }],
    })),

  deleteGroup: groupCode =>
    set(state => ({
      tags: state.tags.filter(group => group.code !== groupCode),
    })),
}))
