import type { StorageForm, StorageItem, StorageSchema } from '@/types/spaces'
import httpClient from '@/utils/request'

enum SpacesApi {
  GetStorages = '/spaces/storages',
  CreateStorage = '/spaces/storages',
  UpdateStorage = '/storages/:id',
  DeleteStorage = '/storages/:id',
  AddItem = '/storages/:id/items',
}

export const getStorages = () =>
  httpClient.get<StorageSchema[]>({
    url: SpacesApi.GetStorages,
  })

export const createStorage = (data: StorageForm) =>
  httpClient.post<StorageSchema>({
    url: SpacesApi.CreateStorage,
    data,
  })

export const updateStorage = (id: string, data: Partial<StorageForm>) =>
  httpClient.patch<StorageSchema>({
    url: SpacesApi.UpdateStorage.replace(':id', id),
    data,
  })

export const deleteStorage = (id: string) =>
  httpClient.delete({ url: SpacesApi.DeleteStorage.replace(':id', id) })

export const addItemToStorage = (id: string, data: StorageItem) =>
  httpClient.post({ url: SpacesApi.AddItem.replace(':id', id), data })
