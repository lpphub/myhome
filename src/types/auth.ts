export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  role?: string
}

export interface AuthForm {
  email: string
  password: string
}

export interface AuthData {
  user: User
  accessToken: string
  refreshToken: string
}

export interface UpdateProfileForm {
  name: string
  avatar?: string
}

export interface ChangePasswordForm {
  oldPassword: string
  newPassword: string
}
