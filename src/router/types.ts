export interface RouteConfig {
  path?: string
  element?: React.ReactNode
  errorElement?: React.ReactNode
  index?: boolean
  children?: RouteConfig[]
  protected?: boolean
  title?: string
  description?: string
}

export interface RouteMeta {
  title: string
  description?: string
  protected: boolean
}
