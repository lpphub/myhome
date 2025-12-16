// router/index.ts
import { createBrowserRouter } from "react-router"
import { Dashboard, Login } from "@/pages"
import { requireAuth, requireGuest } from "./guards"

export const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Dashboard />,
    loader: requireAuth, // 必须登录
  },
  {
    path: "/login",
    element: <Login />,
    loader: requireGuest, // 仅未登录
  },
  // {
  //   path: "*",
  //   element: <NotFoundPage />,
  // },
])
