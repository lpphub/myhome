// router/index.ts
import { createBrowserRouter } from 'react-router'
import { AuthGuard } from '@/components/AuthGuard'
import MainLayout from '@/components/MainLayout'
import ComingSoon from '@/pages/ComingSoon'
import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import TestComponents from '@/pages/TestUI'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'spaces',
        element: <ComingSoon feature='spaces' />,
      },
      {
        path: 'items',
        element: <ComingSoon feature='items' />,
      },
      {
        path: 'tags',
        element: <ComingSoon feature='tags' />,
      },
    ],
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
