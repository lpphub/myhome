export interface SignInForm {
  email: string
  password: string
}

export interface SignUpForm {
  email: string
  password: string
}

export interface Token {
  accessToken: string
  refreshToken: string
}
