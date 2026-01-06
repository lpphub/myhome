import { createBrowserRouter } from 'react-router'
import Layout from '@/components/Layout'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
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
        <Layout />
      </AuthGuard>
    ),
    children: [
      {
        path: 'spaces',
        index: true,
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
