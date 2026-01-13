import type { ChangePasswordForm, UpdateProfileForm, User } from '@/types/auth'
import httpClient from '@/utils/request'

enum UserApi {
  GetProfile = '/user/profile',
  UpdateProfile = '/user/profile',
  ChangePassword = '/user/password',
}

export function getUserProfile() {
  return httpClient.get<User>({
    url: UserApi.GetProfile,
  })
}

export function updateUserProfile(data: UpdateProfileForm) {
  return httpClient.put<void, UpdateProfileForm>({
    url: UserApi.UpdateProfile,
    data,
  })
}

export function changePassword(data: ChangePasswordForm) {
  return httpClient.put<void, ChangePasswordForm>({
    url: UserApi.ChangePassword,
    data,
  })
}
