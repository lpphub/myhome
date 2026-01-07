import type { Space, SpaceForm } from '@/types/spaces'
import httpClient from '@/utils/request'

enum SpacesApi {
  GetSpaces = '/spaces',
  CreateSpace = '/spaces',
  UpdateSpace = '/spaces/:id',
  DeleteSpace = '/spaces/:id',
}

export const getSpaces = () =>
  httpClient.get<Space[]>({
    url: SpacesApi.GetSpaces,
  })

export const createSpace = (data: SpaceForm) =>
  httpClient.post<Space>({
    url: SpacesApi.CreateSpace,
    data,
  })

export const updateSpace = (id: number, data: Partial<SpaceForm>) =>
  httpClient.patch<Space>({
    url: SpacesApi.UpdateSpace.replace(':id', String(id)),
    data,
  })

export const deleteSpace = (id: number) =>
  httpClient.delete({ url: SpacesApi.DeleteSpace.replace(':id', String(id)) })
