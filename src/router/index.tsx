import { createBrowserRouter, Navigate } from "react-router"
import { MainLayout } from "@/components/layout/MainLayout"
import { Dashboard, SigninPage } from "@/pages"
import { useUserStore } from "@/stores/userStore"

// 公共路由组件（未认证时访问）
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthed = useUserStore(state => state.isAuthed())

  if (isAuthed) {
    return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}

// 受保护路由组件（需要认证）
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthed = useUserStore(state => state.isAuthed())

  if (!isAuthed) {
    return <Navigate to="/signin" replace />
  }
  return <>{children}</>
}

// 根路由组件
const RootRoute = () => {
  const isAuthed = useUserStore(state => state.isAuthed())

  return <Navigate to={isAuthed ? "/dashboard" : "/signin"} replace />
}

// 路由配置
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
  },
  {
    path: "/signin",
    element: (
      <PublicRoute>
        <SigninPage />
      </PublicRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
])
