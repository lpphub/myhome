import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff, Heart, Home } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { signIn } from '@/api/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'

const loginSchema = z.object({
  email: z.email('请输入有效的邮箱地址').min(1, '请输入邮箱地址'),
  password: z.string().min(1, '请输入密码').min(6, '密码长度至少为6位'),
})

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { isPending, mutate } = useMutation({
    mutationFn: (credentials: { email: string; password: string }) => signIn(credentials),
    onSuccess: res => {
      login({ ...res })
      toast.success('登录成功！')
      navigate('/')
    },
    onError: () => {
      setError('root', { message: '邮箱或密码错误，请重试' })
    },
  })

  // 提交处理
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    mutate({
      email: data.email,
      password: data.password,
    })
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4 relative overflow-hidden'>
      {/* 背景装饰 */}
      <div className='absolute inset-0 bg-linear-to-br from-cream-100 via-honey-100 to-lavender-100' />
      <div className='absolute inset-0'>
        {/* 浮动装饰元素 */}
        <motion.div
          className='absolute top-20 left-20 w-32 h-32 bg-honey-200 rounded-full opacity-30'
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className='absolute top-40 right-32 w-24 h-24 bg-coral-200 rounded-full opacity-25'
          animate={{
            y: [0, -15, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        <motion.div
          className='absolute bottom-32 left-32 w-40 h-40 bg-lavender-200 rounded-full opacity-20'
          animate={{
            y: [0, -25, 0],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      {/* 登录卡片 */}
      <Card className='w-96 z-10 shadow-2xl border border-honey-200/30 backdrop-blur-lg bg-white/60 py-4'>
        <CardHeader>
          <div className='text-center space-y-2'>
            {/* Logo 图标 */}
            <div className='flex items-center justify-center mb-2'>
              <div className='w-16 h-16 bg-linear-to-br from-honey-400 to-coral-400 rounded-2xl flex items-center justify-center shadow-warm-md'>
                <Home className='w-8 h-8 text-white' />
              </div>
            </div>

            {/* 标题 */}
            <CardTitle>收纳宝</CardTitle>

            {/* 欢迎语 */}
            <CardDescription className='flex items-center justify-center gap-2'>
              <Heart className='w-4 h-4 text-coral-400' />
              <span>欢迎回家</span>
              <Heart className='w-4 h-4 text-coral-400' />
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className='px-4'>
          {/* 登录表单 */}
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-1.5'>
            {/* 通用错误信息 */}
            {errors.root && (
              <div className='bg-coral-50 border border-coral-200 text-coral-700 px-4 py-3 rounded-lg text-sm'>
                {errors.root.message}
              </div>
            )}

            {/* 邮箱输入 */}
            <div className='w-[95%] mx-auto'>
              <label htmlFor='email' className='block text-sm font-medium text-warmGray-700'>
                邮箱地址
              </label>
              <Input
                id='email'
                type='email'
                placeholder='your@email.com'
                className={errors.email ? 'border-coral-500' : 'border-warmGray-200'}
                disabled={isPending}
                {...register('email')}
              />
              {errors.email && <p className='text-coral-500 text-sm'>{errors.email.message}</p>}
            </div>

            {/* 密码输入 */}
            <div className='w-[95%] mx-auto'>
              <label htmlFor='password' className='block text-sm font-medium text-warmGray-700'>
                密码
              </label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='请输入密码'
                  className={
                    errors.password ? 'border-coral-500 pr-10' : 'border-warmGray-200 pr-10'
                  }
                  disabled={isPending}
                  {...register('password')}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-warmGray-500 hover:text-honey-500 transition-colors'
                  disabled={isPending}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className='text-coral-500 text-sm'>{errors.password.message}</p>
              )}
            </div>

            <div className='w-[95%] pt-2 mx-auto space-y-1.5'>
              {/* 登录按钮 */}
              <Button
                type='submit'
                className='w-full bg-linear-to-r from-honey-400 to-coral-400 hover:from-honey-500 hover:to-coral-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 justify-center'
                disabled={isPending}
                loading={isPending}
              >
                {isPending ? '登录中...' : '登录'}
              </Button>

              {/* 忘记密码按钮 */}
              <Button
                type='button'
                variant='ghost'
                className='w-full text-honey-600 hover:text-honey-700 transition-all duration-300 justify-center'
                disabled={isPending}
                onClick={() => navigate('/forgot-password')}
              >
                忘记密码?
              </Button>
            </div>
          </form>

          {/* 注册链接 */}
          <div className='mt-2 text-center text-sm text-warmGray-600'>
            还没有账号？{' '}
            <a
              href='/register'
              className='font-medium text-honey-600 hover:text-honey-700 transition-colors'
            >
              立即注册
            </a>
          </div>
        </CardContent>
        <CardFooter className='flex justify-center px-4'>
          <div className='text-warmGray-400 text-xs'>✨ 让收纳变得简单</div>
        </CardFooter>
      </Card>
    </div>
  )
}
