export interface SignInForm extends Record<string, unknown> {
  email: string
  password: string
  remember?: boolean
}

export interface SignUpForm extends Record<string, unknown> {
  name: string
  email: string
  password: string
  confirmPassword?: string
  agreeTerms?: boolean
}
