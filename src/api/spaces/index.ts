import type { Storage, StorageItem } from '@/types/spaces'
import httpClient from '@/utils/request'

enum SpacesApi {
  GetStorages = '/spaces/storages',
  CreateStorage = '/spaces/storages',
  UpdateStorage = '/storages/:id',
  DeleteStorage = '/storages/:id',
  AddItem = '/storages/:id/items',
}

export const getStorages = () =>
  httpClient.get<Storage[]>({
    url: SpacesApi.GetStorages,
  })

export const createStorage = (data: Partial<Storage>) =>
  httpClient.post<Storage>({
    url: SpacesApi.CreateStorage,
    data,
  })

export const updateStorage = (id: string, data: Partial<Storage>) =>
  httpClient.patch<Storage>({
    url: SpacesApi.UpdateStorage.replace(':id', id),
    data,
  })

export const deleteStorage = (id: string) =>
  httpClient.delete({ url: SpacesApi.DeleteStorage.replace(':id', id) })

export const addItemToStorage = (id: string, data: StorageItem) =>
  httpClient.post({ url: SpacesApi.AddItem.replace(':id', id), data })
