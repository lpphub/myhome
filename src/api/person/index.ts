import type { ChangePasswordForm, UpdateProfileForm, User } from '@/types/auth'
import httpClient from '@/utils/request'

enum PersonApi {
  GetProfile = '/person/profile',
  UpdateProfile = '/person/profile',
  ChangePassword = '/person/password',
}

export function getPersonProfile() {
  return httpClient.get<User>({
    url: PersonApi.GetProfile,
  })
}

export function updatePersonProfile(data: UpdateProfileForm) {
  return httpClient.put<void, UpdateProfileForm>({
    url: PersonApi.UpdateProfile,
    data,
  })
}

export function changePassword(data: ChangePasswordForm) {
  return httpClient.put<void, ChangePasswordForm>({
    url: PersonApi.ChangePassword,
    data,
  })
}
