import { createBrowserRouter } from 'react-router'
import { AuthGuard } from '@/components/AuthGuard'
import MainLayout from '@/components/MainLayout'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import Dashboard from '@/pages/dashboard'
import NotFound from '@/pages/errors/NotFound'
import Items from '@/pages/items'
import Spaces from '@/pages/spaces'
import TestComponents from '@/pages/TestUI'
import Tags from '@/pages/tags'

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
        path: 'items',
        element: <Items />,
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
