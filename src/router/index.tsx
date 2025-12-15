import { createBrowserRouter, Navigate, type RouteObject } from "react-router"
import { AppLayout, AuthPageLayout } from "@/App"
import { STORAGE_KEYS } from "@/constants"
import { useUserStore } from "@/stores/userStore"
import { Dashboard } from "@/pages"
import { NotFound } from "@/pages"
import { SigninPage } from "@/pages"
import { SignupPage } from "@/pages"
import type { RouteConfig } from "./types"

// Check if user is authenticated
const isAuthenticated = () => {
  // 优先检查 userStore 中的 token
  const tokens = useUserStore.getState().tokens
  if (tokens?.accessToken) {
    return true
  }
  // 兼容旧的 localStorage 方式
  return localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED) === "true"
}

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />
  }
  return <>{children}</>
}

// Public route wrapper component (redirect if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}

// Route configurations
const routes: RouteConfig[] = [
  {
    path: "/",
    element: <Navigate to={isAuthenticated() ? "/dashboard" : "/signin"} replace />,
  },
  {
    path: "/signin",
    element: (
      <AuthPageLayout>
        <PublicRoute>
          <SigninPage />
        </PublicRoute>
      </AuthPageLayout>
    ),
    title: "登录 - 我的家",
    description: "登录到智能家居管理系统",
  },
  {
    path: "/signup",
    element: (
      <AuthPageLayout>
        <PublicRoute>
          <SignupPage />
        </PublicRoute>
      </AuthPageLayout>
    ),
    title: "注册 - 我的家",
    description: "创建智能家居账户",
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
        title: "仪表盘 - 我的家",
        description: "智能家居管理仪表盘",
      },
      {
        path: "profile",
        element: <div>用户资料页面（开发中）</div>,
        title: "个人资料 - 我的家",
        protected: true,
      },
      {
        path: "settings",
        element: <div>设置页面（开发中）</div>,
        title: "设置 - 我的家",
        protected: true,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
    title: "页面未找到 - 我的家",
  },
]

// Update page title
const updatePageTitle = (title: string) => {
  document.title = title || "我的家"
}

// Convert RouteConfig to RouteObject for createBrowserRouter
const convertRoutes = (routes: RouteConfig[]): RouteObject[] => {
  return routes.map(route => {
    const convertedRoute = {
      path: route.path,
      element: route.element,
      errorElement: route.errorElement,
      index: route.index,
    } as RouteObject

    if (route.children) {
      convertedRoute.children = convertRoutes(route.children)
    }

    return convertedRoute
  })
}

export const router = createBrowserRouter(convertRoutes(routes))

// Add route change listener for title updates
router.subscribe(state => {
  const currentRoute = state.location.pathname
  const route = findRouteByPath(routes, currentRoute)
  if (route?.title) {
    updatePageTitle(route.title)
  }
})

// Helper function to find route by path
function findRouteByPath(routes: RouteConfig[], path: string): RouteConfig | undefined {
  for (const route of routes) {
    // Check exact match
    if (route.path === path) {
      return route
    }

    // Check children
    if (route.children) {
      for (const child of route.children) {
        const fullPath = route.path === "/" ? `/${child.path}` : `${route.path}/${child.path}`

        if (fullPath === path || (child.path === "*" && !findRouteByPath(routes, fullPath))) {
          return child
        }
      }
    }
  }

  return undefined
}
