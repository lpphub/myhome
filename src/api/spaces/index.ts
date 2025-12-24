import httpClient from '@/utils/request'
import type { Room, StoragePoint, StorageItem, AddRoomForm } from '@/types/spaces'

enum SpacesApi {
  GetRooms = '/spaces',
  CreateRoom = '/spaces',
  UpdateRoom = '/spaces/:id',
  DeleteRoom = '/spaces/:id',
  GetStoragePoints = '/spaces/:roomId/storage-points',
  CreateStoragePoint = '/spaces/:roomId/storage-points',
  UpdateStoragePoint = '/storage-points/:id',
  DeleteStoragePoint = '/storage-points/:id',
  AddItem = '/storage-points/:id/items',
}

export const getRooms = () => httpClient.get<Room[]>({ url: SpacesApi.GetRooms })

export const createRoom = (data: AddRoomForm) =>
  httpClient.post<Room>({ url: SpacesApi.CreateRoom, data })

export const updateRoom = (id: string, data: Partial<Room>) =>
  httpClient.patch<Room>({ url: SpacesApi.UpdateRoom.replace(':id', id), data })

export const deleteRoom = (id: string) =>
  httpClient.delete({ url: SpacesApi.DeleteRoom.replace(':id', id) })

export const getStoragePoints = (roomId: string) =>
  httpClient.get<StoragePoint[]>({
    url: SpacesApi.GetStoragePoints.replace(':roomId', roomId),
  })

export const createStoragePoint = (roomId: string, data: Partial<StoragePoint>) =>
  httpClient.post<StoragePoint>({
    url: SpacesApi.CreateStoragePoint.replace(':roomId', roomId),
    data,
  })

export const updateStoragePoint = (id: string, data: Partial<StoragePoint>) =>
  httpClient.patch<StoragePoint>({
    url: SpacesApi.UpdateStoragePoint.replace(':id', id),
    data,
  })

export const deleteStoragePoint = (id: string) =>
  httpClient.delete({ url: SpacesApi.DeleteStoragePoint.replace(':id', id) })

export const addItemToStoragePoint = (pointId: string, data: StorageItem) =>
  httpClient.post({ url: SpacesApi.AddItem.replace(':id', pointId), data })
