import type { AuthData, AuthForm } from '@/types/auth'
import httpClient from '@/utils/request'

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
  return httpClient.post<AuthData, AuthForm>({
    url: AuthApi.SignIn,
    data: data,
  })
}

/**
 * signUp
 * @param data SignUp parameters
 */
export function signUp(data: AuthForm) {
  return httpClient.post<AuthData, AuthForm>({
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
  return httpClient.put<Pick<AuthData, 'accessToken' | 'refreshToken'>, { refreshToken: string }>({
    url: AuthApi.Refresh,
    data: { refreshToken },
  })
}

export function logout() {
  // todo 清空本地
}
