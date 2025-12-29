// api/labels.ts
import type { Label, LabelCategory, LabelFormData, ReorderRequest } from '@/types/labels'
import httpClient from '@/utils/request'

enum LabelsApi {
  GetLabels = '/labels',
  GetCategories = '/labels/categories',
  CreateLabel = '/labels',
  UpdateLabel = '/labels/:id',
  DeleteLabel = '/labels/:id',
  ReorderLabels = '/labels/reorder',
}

// 获取所有标签
export const getLabels = () =>
  httpClient.get<Label[]>({
    url: LabelsApi.GetLabels,
    mock: true,
  })

// 获取所有分类
export const getCategories = () =>
  httpClient.get<LabelCategory[]>({
    url: LabelsApi.GetCategories,
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
