import httpClient from "@/utils/request"

enum AuthApi {
  SignIn = "/auth/signin",
  SignUp = "/auth/signup",
  Logout = "/auth/logout",
  Refresh = "/auth/refresh",
}

export interface SignInForm {
  username: string
  password: string
}

export interface SignUpForm extends SignInForm {
  phone: string
}

export interface Token {
  accessToken: string
  refreshToken: string
}

/**
 * signIn
 *
 * @param data SignIn parameters
 */
export function signIn(data: SignInForm) {
  return httpClient.post<Token, SignInForm>({
    url: AuthApi.SignIn,
    data: data,
  })
}

/**
 * signUp
 * @param data SignUp parameters
 */
export function signUp(data: SignUpForm) {
  return httpClient.post<Token, SignUpForm>({
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
  return httpClient.put<Token, { refresh_token: string }>({
    url: AuthApi.Refresh,
    data: { refresh_token: refreshToken },
  })
}

export function logout() {
  // todo 清空本地
}
