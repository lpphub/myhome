import type { ReorderRequest, Tag, TagCategory, TagFormData } from '@/types/tags'
import httpClient from '@/utils/request'

enum TagsApi {
  GetTags = '/tags',
  GetCategories = '/tags/categories',
  CreateTag = '/tags',
  UpdateTag = '/tags/:id',
  DeleteTag = '/tags/:id',
  ReorderTags = '/tags/reorder',
}

export const getTags = () =>
  httpClient.get<Tag[]>({
    url: TagsApi.GetTags,
    mock: true,
  })

export const getCategories = () =>
  httpClient.get<TagCategory[]>({
    url: TagsApi.GetCategories,
    mock: true,
  })

export const createTag = (data: TagFormData) =>
  httpClient.post<Tag>({
    url: TagsApi.CreateTag,
    data,
    mock: true,
  })

export const updateTag = (id: number, data: Partial<TagFormData>) =>
  httpClient.patch<Tag>({
    url: TagsApi.UpdateTag.replace(':id', String(id)),
    data,
    mock: true,
  })

export const deleteTag = (id: number) =>
  httpClient.delete({
    url: TagsApi.DeleteTag.replace(':id', String(id)),
    mock: true,
  })

export const reorderTags = (data: ReorderRequest) =>
  httpClient.post({
    url: TagsApi.ReorderTags,
    data,
    mock: true,
  })
