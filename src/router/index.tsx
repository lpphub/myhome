// router/index.ts
import { createBrowserRouter } from 'react-router'
import { AuthGuard } from '@/components/AuthGuard'
import { Dashboard, Login, NotFound, TestComponents } from '@/pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthGuard>
        <Dashboard />
      </AuthGuard>
    ),
  },
  {
    path: '/login',
    element: (
      <AuthGuard requireAuth={false}>
        <Login />
      </AuthGuard>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
  {
    path: '/testui',
    element: <TestComponents />,
  },
])
