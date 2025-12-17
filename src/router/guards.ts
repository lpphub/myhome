import { redirect } from 'react-router'
import { useAuthStore } from '@/stores/useAuthStore'

export const requireAuth = () => {
  const isAuthenticated = useAuthStore.getState().isAuthenticated
  if (!isAuthenticated) {
    // 未登录 → 跳 login
    return redirect('/login')
  }
  return null
}

export const requireGuest = () => {
  const isAuthenticated = useAuthStore.getState().isAuthenticated
  if (isAuthenticated) {
    // 已登录 → 跳首页
    return redirect('/')
  }
  return null
}
