import type { Space, SpaceForm, SpaceInvite, SpaceMember } from '@/types/spaces'
import httpClient from '@/utils/request'

enum SpacesApi {
  GetSpaces = '/spaces',
  CreateSpace = '/spaces',
  UpdateSpace = '/spaces/:id',
  DeleteSpace = '/spaces/:id',
  TogglePinSpace = '/spaces/:id/pin',
  GetSpaceMembers = '/spaces/:id/members',
  InviteSpaceMember = '/spaces/:id/members/invite',
  RemoveSpaceMember = '/spaces/:id/members/:userId',
  GetPendingInvites = '/invites/pending',
  RespondInvite = '/invites/:id/respond',
}

export const getSpaces = () =>
  httpClient.get<Space[]>({
    url: SpacesApi.GetSpaces,
  })

export const createSpace = (data: SpaceForm) =>
  httpClient.post<number>({
    url: SpacesApi.CreateSpace,
    data,
  })

export const updateSpace = (data: SpaceForm) =>
  httpClient.patch<void>({
    url: SpacesApi.UpdateSpace.replace(':id', String(data.id)),
    data,
  })

export const deleteSpace = (id: number) =>
  httpClient.delete({ url: SpacesApi.DeleteSpace.replace(':id', String(id)) })

export const togglePinSpace = (id: number) =>
  httpClient.patch<void>({
    url: SpacesApi.TogglePinSpace.replace(':id', String(id)),
  })

export const getSpaceMembers = (spaceId: number) =>
  httpClient.get<SpaceMember[]>({
    url: SpacesApi.GetSpaceMembers.replace(':id', String(spaceId)),
  })

export const inviteSpaceMember = (spaceId: number, email: string) =>
  httpClient.post({
    url: SpacesApi.InviteSpaceMember.replace(':id', String(spaceId)),
    data: { email },
  })

export const removeSpaceMember = (spaceId: number, userId: number) =>
  httpClient.delete({
    url: SpacesApi.RemoveSpaceMember.replace(':id', String(spaceId)).replace(
      ':userId',
      String(userId)
    ),
  })

export const getPendingInvites = () =>
  httpClient.get<SpaceInvite[]>({
    url: SpacesApi.GetPendingInvites,
  })

export const respondInvite = (inviteId: number, action: 'accept' | 'reject') =>
  httpClient.patch({
    url: SpacesApi.RespondInvite.replace(':id', String(inviteId)),
    data: { action },
  })
