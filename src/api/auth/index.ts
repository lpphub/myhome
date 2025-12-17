import httpClient from '@/utils/request'

export interface AuthForm {
  email: string
  password: string
}

export interface User {
  id: number
  name: string
  email?: string
  avatar?: string
  role?: string
}

export interface AuthResp {
  user: User
  accessToken: string
  refreshToken: string
}

enum AuthApi {
  SignIn = '/auth/signin',
  SignUp = '/auth/signup',
  Logout = '/auth/logout',
  Refresh = '/auth/refresh',
}

/**
 * signIn
 *
 * @param data SignIn parameters
 */
export function signIn(data: AuthForm) {
  return httpClient.post<AuthResp, AuthForm>({
    url: AuthApi.SignIn,
    data: data,
  })
}

/**
 * signUp
 * @param data SignUp parameters
 */
export function signUp(data: AuthForm) {
  return httpClient.post<AuthResp, AuthForm>({
    url: AuthApi.SignUp,
    data: data,
  })
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function refreshToken(refreshToken: string) {
  return httpClient.put<AuthResp, { refresh_token: string }>({
    url: AuthApi.Refresh,
    data: { refresh_token: refreshToken },
  })
}

export function logout() {
  // todo 清空本地
}
