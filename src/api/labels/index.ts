// api/labels.ts
import type { Category, Label, LabelCategory, LabelFormData, ReorderRequest } from '@/types/labels'
import httpClient from '@/utils/request'

enum LabelsApi {
  GetLabels = '/labels',
  CreateLabel = '/labels',
  UpdateLabel = '/labels/:id',
  DeleteLabel = '/labels/:id',
  ReorderLabels = '/labels/reorder',
  CreateCategory = '/labels/categories',
  GetCategories = '/labels/categories',
}

// 获取所有标签
export const getLabels = () =>
  httpClient.get<LabelCategory[]>({
    url: LabelsApi.GetLabels,
    mock: true,
  })

// 创建标签
export const createLabel = (data: LabelFormData) =>
  httpClient.post<Label>({
    url: LabelsApi.CreateLabel,
    data,
    mock: true,
  })

// 更新标签
export const updateLabel = (id: number, data: Partial<LabelFormData>) =>
  httpClient.patch<Label>({
    url: LabelsApi.UpdateLabel.replace(':id', String(id)),
    data,
    mock: true,
  })

// 删除标签
export const deleteLabel = (id: number) =>
  httpClient.delete({
    url: LabelsApi.DeleteLabel.replace(':id', String(id)),
    mock: true,
  })

// 批量重排序
export const reorderLabels = (data: ReorderRequest) =>
  httpClient.post({
    url: LabelsApi.ReorderLabels,
    data,
    mock: true,
  })

// 创建分类
export const createCategory = (name: string) =>
  httpClient.post<void>({
    url: LabelsApi.CreateCategory,
    data: { name },
    mock: true,
  })

// 获取所有分类
export const getCategories = () =>
  httpClient.get<Category[]>({
    url: LabelsApi.GetCategories,
    mock: true,
  })
