// api/tags.ts
import type { Category, ReorderParams, Tag, TagCategory, TagFormData } from '@/types/tags'
import httpClient from '@/utils/request'

enum TagsApi {
  GetTags = '/tags',
  CreateTag = '/tags',
  UpdateTag = '/tags/:id',
  DeleteTag = '/tags/:id',
  ReorderTags = '/tags/reorder',
  CreateCategory = '/tags/category',
}

export const getTags = () =>
  httpClient.get<TagCategory[]>({
    url: TagsApi.GetTags,
  })

export const createTag = (data: TagFormData) =>
  httpClient.post<Tag>({
    url: TagsApi.CreateTag,
    data,
  })

export const updateTag = (data: Partial<TagFormData>) =>
  httpClient.patch<Tag>({
    url: TagsApi.UpdateTag.replace(':id', String(data.id)),
    data,
  })

export const deleteTag = (id: number) =>
  httpClient.delete({
    url: TagsApi.DeleteTag.replace(':id', String(id)),
  })

export const reorderTags = (data: ReorderParams) =>
  httpClient.post({
    url: TagsApi.ReorderTags,
    data,
  })

// 创建分类
export const createCategory = (name: string) =>
  httpClient.post<Category>({
    url: TagsApi.CreateCategory,
    data: { name },
  })
