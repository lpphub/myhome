// api/tags.ts

import httpClient from '@/lib/http-client'
import type { Group, ReorderParams, Tag, TagFormData, TagGroup } from '@/types/tags'

enum TagsApi {
  GetTags = '/tags',
  CreateTag = '/tags',
  UpdateTag = '/tags/:id',
  DeleteTag = '/tags/:id',
  ReorderTags = '/tags/reorder',
  CreateGroup = '/tags/group',
  DeleteGroup = '/tags/group/:id',
}

export const getTags = (spaceId?: number) =>
  httpClient.get<TagGroup[]>({
    url: TagsApi.GetTags,
    params: spaceId ? { spaceId } : undefined,
  })

export const createTag = (data: TagFormData) =>
  httpClient.post<Tag>({
    url: TagsApi.CreateTag,
    data,
  })

export const updateTag = (data: Partial<TagFormData>) =>
  httpClient.patch<void>({
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

export const createGroup = (data: Omit<Group, 'id'>) =>
  httpClient.post<Group>({
    url: TagsApi.CreateGroup,
    data,
  })

export const deleteGroup = (data: Group) =>
  httpClient.delete<void>({
    url: TagsApi.DeleteGroup.replace(':id', String(data.id)),
    params: data.spaceId ? { spaceId: data.spaceId } : undefined,
  })
