import { create } from 'zustand'
import type { Group, Tag, TagFormData, TagGroup } from '@/types/tags'

interface LocalTagsState {
  /* ===== context and data ===== */
  spaceId: number | null
  tags: TagGroup[]

  /* ===== drawer state ===== */
  selectedTagId: number | null
  isDrawerOpen: boolean

  /* ===== context actions ===== */
  restore: (tags: TagGroup[]) => void
  reset: () => void

  /* ===== drawer actions ===== */
  setSelectedTagId: (id: number | null) => void
  setDrawerOpen: (open: boolean) => void

  /* ===== data actions ===== */
  initTags: (spaceId: number, tags: TagGroup[]) => void
  addTag: (tag: Tag) => void
  updateTag: (data: TagFormData) => void
  deleteTag: (tagId: number) => void
  reorder: (next: TagGroup[]) => void
  addGroup: (group: Group) => void
  deleteGroup: (groupId: number) => void
}

export const useTagsStore = create<LocalTagsState>(set => ({
  /* ===== data context ===== */
  spaceId: null,
  tags: [],

  /* ===== drawer state ===== */
  selectedTagId: null,
  isDrawerOpen: false,

  /* ---------------- context ---------------- */
  restore: (tags: TagGroup[]) => set({ tags }),
  reset: () => set({ tags: [], spaceId: null, selectedTagId: null, isDrawerOpen: false }),

  /* ---------------- drawer ---------------- */
  setSelectedTagId: (id: number | null) => set({ selectedTagId: id }),
  setDrawerOpen: (open: boolean) => set({ isDrawerOpen: open }),

  /* ---------------- data ---------------- */
  initTags: (spaceId: number, tags: TagGroup[]) =>
    set({
      spaceId,
      tags,
    }),

  addTag: tag =>
    set(state => ({
      tags: state.tags.map(group =>
        group.id === tag.groupId ? { ...group, tags: [...group.tags, tag] } : group
      ),
    })),

  updateTag: data =>
    set(state => ({
      tags: state.tags.map(group =>
        group.id === data.groupId
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

  deleteGroup: groupId =>
    set(state => ({
      tags: state.tags.filter(group => group.id !== groupId),
    })),
}))
