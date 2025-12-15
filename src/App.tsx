import { RouterProvider } from "react-router"
import { Toaster } from "sonner"
import { router } from "@/router"
import { warmTheme } from "@/styles/theme"
import "./styles/global.css"

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        theme="light"
        toastOptions={{
          style: {
            background: warmTheme.colors.bgSecondary,
            border: `1px solid ${warmTheme.colors.border}`,
            borderRadius: warmTheme.borderRadius.small,
            color: warmTheme.colors.textPrimary,
          },
        }}
      />
    </>
  )
}
