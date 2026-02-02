import { createBrowserRouter, Outlet } from 'react-router'
import MainLayout from '@/components/MainLayout'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import InternalError from '@/pages/errors/InternalError'
import NotFound from '@/pages/errors/NotFound'
import Landing from '@/pages/Landing'
import NotesPage from '@/pages/notes'
import Profile from '@/pages/profile'
import { SpaceStepNew } from '@/pages/spaces/components/SpaceStepNew'
import SpaceList from '@/pages/spaces/index'
import Tags from '@/pages/tags'
import { AuthGuard } from './guard'

export const router = createBrowserRouter([
  {
    element: <Outlet />,
    errorElement: <InternalError />,
    children: [
      { path: '/', element: <Landing /> },

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
        element: (
          <AuthGuard>
            <MainLayout />
          </AuthGuard>
        ),
        children: [
          { path: '/tags', element: <Tags /> },
          { path: '/notes', element: <NotesPage /> },
          { path: '/spaces', element: <SpaceList /> },
          { path: '/spaces/new', element: <SpaceStepNew /> },
          { path: '/profile', element: <Profile /> },
        ],
      },

      { path: '*', element: <NotFound /> },
    ],
  },
])
