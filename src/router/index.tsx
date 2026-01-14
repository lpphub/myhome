import { createBrowserRouter } from 'react-router'
import MainLayout from '@/components/MainLayout'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import NotFound from '@/pages/errors/NotFound'
import Landing from '@/pages/Landing'
import Profile from '@/pages/profile'
import Spaces from '@/pages/spaces'
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
        element: <Spaces />,
      },
      {
        path: '/tags',
        element: <Tags />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
    ],
  },
  {
    path: '/landing',
    element: <Landing />,
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
])
