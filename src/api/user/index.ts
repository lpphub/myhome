import type { ChangePasswordRequest, ProfileData, UpdateProfileRequest } from '@/types/auth'
import httpClient from '@/utils/request'

enum UserApi {
  GetProfile = '/user/profile',
  UpdateProfile = '/user/profile',
  ChangePassword = '/user/password',
}

export function getUserProfile() {
  return httpClient.get<ProfileData>({
    url: UserApi.GetProfile,
  })
}

export function updateUserProfile(data: UpdateProfileRequest) {
  return httpClient.put<ProfileData, UpdateProfileRequest>({
    url: UserApi.UpdateProfile,
    data,
  })
}

export function changePassword(data: ChangePasswordRequest) {
  return httpClient.put<void, ChangePasswordRequest>({
    url: UserApi.ChangePassword,
    data,
  })
}
