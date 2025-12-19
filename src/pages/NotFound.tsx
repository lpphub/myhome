import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function NotFound() {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className='min-h-screen bg-honey-50 flex items-center justify-center p-4 relative overflow-hidden'>
      {/* 背景装饰元素 */}
      <motion.div
        className='absolute top-1/4 left-1/4 w-64 h-64 bg-honey-100 rounded-full filter blur-3xl opacity-30'
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />
      <motion.div
        className='absolute bottom-1/3 right-1/3 w-80 h-80 bg-coral-100 rounded-full filter blur-3xl opacity-20'
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 1,
        }}
      />
      <motion.div
        className='absolute top-1/2 left-1/3 w-48 h-48 bg-lavender-100 rounded-full filter blur-2xl opacity-25'
        animate={{
          opacity: [0.25, 0.4, 0.25],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 2,
        }}
      />

      {/* 主内容 */}
      <Card className='w-full max-w-lg p-8 md:p-12 z-10 relative'>
        <div className='text-center space-y-6'>
          {/* 404 数字动画 */}
          <div className='relative h-32 flex items-center justify-center'>
            <div className='absolute inset-0 flex items-center justify-center'>
              <span className='text-9xl font-bold text-honey-200 select-none'>404</span>
            </div>
            <motion.div
              className='absolute inset-0 flex items-center justify-center'
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            >
              <span className='text-9xl font-bold text-honey-600 select-none'>404</span>
            </motion.div>
          </div>

          {/* 错误图标 */}
          <div className='relative'>
            <motion.div
              className='w-20 h-20 mx-auto bg-coral-100 rounded-full flex items-center justify-center'
              animate={{
                opacity: [1, 0.8, 1],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <AlertCircle className='w-10 h-10 text-coral-500' />
            </motion.div>
            <motion.div
              className='absolute -top-2 -right-2 w-6 h-6 bg-lavender-500 rounded-full'
              animate={{
                scale: [1, 2],
                opacity: [1, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            />
          </div>

          {/* 错误信息 */}
          <div className='space-y-3'>
            <h1 className='text-3xl font-bold text-honey-700'>页面走丢了</h1>
            <p className='text-warmGray-600 text-lg leading-relaxed'>
              哎呀！你要找的页面似乎不存在了。
              <br />
              可能是链接过期了，或者被小精灵藏起来了。
            </p>
          </div>

          {/* 动画装饰线 */}
          <div className='relative h-1 bg-linear-to-r from-transparent via-honey-300 to-transparent rounded-full overflow-hidden'>
            <motion.div
              className='absolute inset-0 bg-linear-to-r from-transparent via-honey-500 to-transparent'
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </div>

          {/* 操作按钮 */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
            <Button onClick={handleGoHome} className='flex items-center gap-2 group'>
              <motion.div
                whileHover={{
                  y: [-5, -15, -5],
                }}
                transition={{
                  duration: 0.5,
                  repeat: 2,
                }}
              >
                <Home className='w-4 h-4' />
              </motion.div>
              返回首页
            </Button>
            <Button
              variant='outline'
              onClick={handleRefresh}
              className='flex items-center gap-2 group'
            >
              <motion.div
                whileHover={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 0.5,
                }}
              >
                <RefreshCw className='w-4 h-4' />
              </motion.div>
              刷新页面
            </Button>
          </div>

          {/* 提示文字 */}
          <div className='text-sm text-warmGray-500 space-y-1'>
            <p>如果问题持续存在，请联系我们</p>
            <div className='flex items-center justify-center gap-2 text-honey-600 hover:text-honey-700 transition-colors cursor-pointer'>
              <span>📧</span>
              <span>support@myhome.com</span>
            </div>
          </div>
        </div>

        {/* 装饰元素 */}
        <motion.div
          className='absolute -bottom-4 -right-4 w-16 h-16 bg-lavender-100 rounded-full opacity-60 blur-md'
          animate={{
            opacity: [0.6, 0.8, 0.6],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
        <motion.div
          className='absolute -top-4 -left-4 w-12 h-12 bg-coral-100 rounded-full opacity-60 blur-md'
          animate={{
            opacity: [0.6, 0.8, 0.6],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.5,
          }}
        />

        {/* 漂浮的小元素 */}
        <motion.div
          className='absolute top-8 right-8 text-2xl'
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: 0.5,
          }}
        >
          ✨
        </motion.div>
        <motion.div
          className='absolute bottom-8 left-8 text-xl'
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: 1.5,
          }}
        >
          🌸
        </motion.div>
        <motion.div
          className='absolute top-16 left-12 text-lg'
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: 2.5,
          }}
        >
          🍯
        </motion.div>
      </Card>

      {/* 底部装饰 */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center'>
        <motion.p
          className='text-warmGray-400 text-sm'
          animate={{
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          让我们回到温暖的家 ✨
        </motion.p>
      </div>
    </div>
  )
}
