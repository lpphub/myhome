import { Navigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function AuthGuard({ children, requireAuth = true, redirectTo }: AuthGuardProps) {
  const { isAuthenticated } = useAuth()

  const shouldRedirect = requireAuth ? !isAuthenticated : isAuthenticated
  const targetPath = redirectTo || (requireAuth ? '/login' : '/')

  if (shouldRedirect) {
    return <Navigate to={targetPath} replace />
  }

  return <>{children}</>
}
