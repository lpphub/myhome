import type { AddRoomForm, Room, Storage, StorageItem } from '@/types/spaces'
import httpClient from '@/utils/request'

enum SpacesApi {
  GetRooms = '/spaces',
  CreateRoom = '/spaces',
  UpdateRoom = '/spaces/:id',
  DeleteRoom = '/spaces/:id',
  GetStorages = '/spaces/:roomId/storages',
  CreateStorage = '/spaces/:roomId/storages',
  UpdateStorage = '/storages/:id',
  DeleteStorage = '/storages/:id',
  AddItem = '/storages/:id/items',
}

export const getRooms = () => httpClient.get<Room[]>({ url: SpacesApi.GetRooms })

export const createRoom = (data: AddRoomForm) =>
  httpClient.post<Room>({ url: SpacesApi.CreateRoom, data })

export const updateRoom = (id: string, data: Partial<Room>) =>
  httpClient.patch<Room>({ url: SpacesApi.UpdateRoom.replace(':id', id), data })

export const deleteRoom = (id: string) =>
  httpClient.delete({ url: SpacesApi.DeleteRoom.replace(':id', id) })

export const getStorages = (roomId: string) =>
  httpClient.get<Storage[]>({
    url: SpacesApi.GetStorages.replace(':roomId', roomId),
  })

export const createStorage = (roomId: string, data: Partial<Storage>) =>
  httpClient.post<Storage>({
    url: SpacesApi.CreateStorage.replace(':roomId', roomId),
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
