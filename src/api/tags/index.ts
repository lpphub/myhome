// api/tags.ts
import type { Group, ReorderParams, Tag, TagFormData, TagGroup } from '@/types/tags'
import httpClient from '@/utils/request'

enum TagsApi {
  GetTags = '/tags',
  CreateTag = '/tags',
  UpdateTag = '/tags/:id',
  DeleteTag = '/tags/:id',
  ReorderTags = '/tags/reorder',
  CreateGroup = '/tags/group',
  DeleteGroup = '/tags/group/:code',
}

export const getTags = (spaceId?: string) =>
  httpClient.get<TagGroup[]>({
    url: TagsApi.GetTags,
    params: spaceId ? { spaceId } : undefined,
  })

export const createTag = (data: TagFormData) =>
  httpClient.post<Tag>({
    url: TagsApi.CreateTag,
    data: { ...data },
  })

export const updateTag = (data: Partial<TagFormData>) =>
  httpClient.patch<Tag>({
    url: TagsApi.UpdateTag.replace(':id', String(data.id)),
    data,
  })

export const deleteTag = (id: number) =>
  httpClient.delete<void>({
    url: TagsApi.DeleteTag.replace(':id', String(id)),
  })

export const reorderTags = (data: ReorderParams) =>
  httpClient.post<void>({
    url: TagsApi.ReorderTags,
    data,
  })

export const createGroup = (data: Omit<Group, 'id' | 'code'>) =>
  httpClient.post<Group>({
    url: TagsApi.CreateGroup,
    data: { ...data },
  })

export const deleteGroup = (code: string) =>
  httpClient.delete<void>({
    url: TagsApi.DeleteGroup.replace(':code', code),
  })
