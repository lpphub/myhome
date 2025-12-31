// api/tags.ts
import type { Category, ReorderRequest, Tag, TagCategory, TagFormData } from '@/types/tags'
import httpClient from '@/utils/request'

enum TagsApi {
  GetTags = '/tags',
  CreateTag = '/tags',
  UpdateTag = '/tags/:id',
  DeleteTag = '/tags/:id',
  ReorderTags = '/tags/reorder',
  CreateCategory = '/tags/categories',
  GetCategories = '/tags/categories',
}

export const getTags = () =>
  httpClient.get<TagCategory[]>({
    url: TagsApi.GetTags,
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

// 创建分类
export const createCategory = (name: string) =>
  httpClient.post<void>({
    url: TagsApi.CreateCategory,
    data: { name },
    mock: true,
  })

// 获取所有分类
export const getCategories = () =>
  httpClient.get<Category[]>({
    url: TagsApi.GetCategories,
    mock: true,
  })
