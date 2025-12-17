import { Navigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  redirectTo,
}) => {
  const { isAuthenticated } = useAuth()

  const shouldRedirect = requireAuth ? !isAuthenticated : isAuthenticated
  const targetPath = redirectTo || (requireAuth ? '/login' : '/')

  if (shouldRedirect) {
    return <Navigate to={targetPath} replace />
  }

  return <>{children}</>
}
