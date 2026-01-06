import { createBrowserRouter } from 'react-router'
import MainLayout from '@/components/MainLayout'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import Dashboard from '@/pages/dashboard'
import NotFound from '@/pages/errors/NotFound'
import Spaces from '@/pages/spaces'
import TestComponents from '@/pages/TestUI'
import Tags from '@/pages/tags'
import { AuthGuard } from './guard'

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
        element: <Spaces />,
      },
      {
        path: 'tags',
        element: <Tags />,
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
    path: '/register',
    element: (
      <AuthGuard requireAuth={false}>
        <Register />
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
