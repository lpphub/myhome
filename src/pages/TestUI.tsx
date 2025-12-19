import { AlertCircle, CheckCircle, Heart, Info, Star } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
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

// 使用预定义的动画变体，结合自定义效果
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export default function TestUI() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='max-w-4xl mx-auto space-y-12'>
        {/* 标题区域 */}
        <div className='text-center'>
          <h1 className='text-4xl font-light text-foreground mb-2'>家庭收纳</h1>
          <p className='text-secondary text-lg'>整理生活，从收纳开始</p>
        </div>

        {/* 收纳分类卡片 */}
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='grid grid-cols-1 md:grid-cols-3 gap-6'
        >
          <div className='h-full'>
            <motion.div
              variants={cardVariants}
              whileHover={{
                scale: 1.02,
                y: -4,
                boxShadow:
                  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className='bg-white rounded-lg p-6 shadow-sm border border-border h-full'
            >
              <h3 className='font-medium text-foreground mb-3'>衣物收纳</h3>
              <Button variant='outline' className='w-full paper-shadow'>
                查看方案
              </Button>
            </motion.div>
          </div>

          <div className='h-full'>
            <motion.div
              variants={cardVariants}
              whileHover={{
                scale: 1.02,
                y: -4,
                boxShadow:
                  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className='bg-white rounded-lg p-6 shadow-sm border border-border h-full'
            >
              <h3 className='font-medium text-foreground mb-3'>厨房用品</h3>
              <Button variant='outline' className='w-full paper-shadow'>
                查看方案
              </Button>
            </motion.div>
          </div>

          <div className='h-full'>
            <motion.div
              variants={cardVariants}
              whileHover={{
                scale: 1.02,
                y: -4,
                boxShadow:
                  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className='bg-white rounded-lg p-6 shadow-sm border border-border h-full'
            >
              <h3 className='font-medium text-foreground mb-3'>杂物整理</h3>
              <Button variant='outline' className='w-full paper-shadow'>
                查看方案
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* 搜索区域 */}
        <div className='flex justify-center'>
          <div className='w-full max-w-md'>
            <Input placeholder='搜索收纳方案...' className='w-full h-12 text-base' />
          </div>
        </div>

        {/* 特色功能按钮 */}
        <div className='flex justify-center gap-4'>
          <Button variant='default' className='paper-shadow'>
            🏠 默认按钮 (Primary)
          </Button>
          <Button variant='accent' className='paper-shadow text-white'>
            📦 添加新物品
          </Button>
          <Button variant='secondary' className='paper-shadow'>
            📋 查看清单
          </Button>
        </div>

        {/* Card 组件测试 */}
        <div className='space-y-6'>
          <h2 className='text-2xl font-light text-foreground text-center'>Card 组件动效测试</h2>
          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          >
            {/* 基础悬停效果 */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>基础悬停</CardTitle>
                  <CardDescription>悬停时轻微放大效果</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>
                    这里是卡片的主要内容区域，可以放置各种信息。
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className='w-full'>确认</Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* 3D 倾斜效果 */}
            <motion.div
              variants={cardVariants}
              whileHover={{
                rotateY: 5,
                rotateX: -5,
                scale: 1.02,
                boxShadow:
                  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Card>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='flex items-center gap-2'>
                      <Star className='w-4 h-4' />
                      3D 卡片
                    </CardTitle>
                    <Badge className='bg-accent text-accent-foreground'>热门</Badge>
                  </div>
                  <CardDescription>悬停时有3D倾斜效果</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <div className='flex justify-between items-center'>
                      <span>状态</span>
                      <Badge variant='secondary'>活跃</Badge>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>优先级</span>
                      <Badge variant='destructive'>高</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className='flex gap-2 w-full'>
                    <Button variant='outline' className='flex-1'>
                      取消
                    </Button>
                    <Button className='flex-1'>保存</Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>

            {/* 特殊样式卡片 - 弹簧动画 */}
            <div className='h-full'>
              <motion.div
                variants={cardVariants}
                whileHover={{
                  y: -4,
                  scale: 1.02,
                  boxShadow:
                    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className='h-full'
              >
                <Card className='border-accent h-full'>
                  <CardHeader className='bg-accent/5'>
                    <CardTitle className='text-accent'>弹簧动画</CardTitle>
                    <CardDescription>优化的弹性效果</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='flex items-center gap-2'>
                      <CheckCircle className='w-5 h-5 text-green-500' />
                      <span className='text-sm'>已完成配置</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant='accent'
                      className='w-full bg-accent text-accent-foreground hover:bg-accent/90'
                    >
                      查看详情
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* 交互式卡片动效 */}
        <div className='space-y-6'>
          <h2 className='text-2xl font-light text-foreground text-center'>交互式卡片动效</h2>
          <motion.div layout className='space-y-4'>
            {/* 可点击展开的卡片 */}
            <motion.div
              layout
              onClick={() => setExpandedCard(expandedCard === 1 ? null : 1)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Card className='cursor-pointer overflow-hidden'>
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    点击展开的卡片
                    <motion.div
                      animate={{ rotate: expandedCard === 1 ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Star className='w-4 h-4' />
                    </motion.div>
                  </CardTitle>
                  <CardDescription>点击查看详细内容</CardDescription>
                </CardHeader>

                <AnimatePresence>
                  {expandedCard === 1 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className='overflow-hidden'
                    >
                      <CardContent>
                        <div className='space-y-3'>
                          <p className='text-sm text-muted-foreground'>
                            这里是展开的详细内容，支持高度动画。你可以看到平滑的过渡效果，
                            包括透明度和高度的同时变化。
                          </p>
                          <div className='flex gap-2'>
                            <Badge>功能完整</Badge>
                            <Badge variant='secondary'>性能优化</Badge>
                            <Badge variant='outline'>响应式设计</Badge>
                          </div>
                          <div className='pt-2'>
                            <Button size='sm' className='mr-2'>
                              主要操作
                            </Button>
                            <Button size='sm' variant='outline'>
                              次要操作
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>

            {/* 第二个可展开卡片 */}
            <motion.div
              layout
              onClick={() => setExpandedCard(expandedCard === 2 ? null : 2)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Card className='cursor-pointer overflow-hidden border-accent'>
                <CardHeader className='bg-accent/5'>
                  <CardTitle className='flex items-center justify-between text-accent'>
                    特殊样式的展开卡片
                    <motion.div
                      animate={{ rotate: expandedCard === 2 ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckCircle className='w-4 h-4' />
                    </motion.div>
                  </CardTitle>
                  <CardDescription>使用强调色的交互卡片</CardDescription>
                </CardHeader>

                <AnimatePresence>
                  {expandedCard === 2 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className='overflow-hidden'
                    >
                      <CardContent>
                        <div className='space-y-4'>
                          <div className='grid grid-cols-2 gap-4'>
                            <div className='text-center p-3 bg-secondary rounded-lg'>
                              <div className='text-2xl font-bold text-primary'>98%</div>
                              <div className='text-sm text-muted-foreground'>完成率</div>
                            </div>
                            <div className='text-center p-3 bg-secondary rounded-lg'>
                              <div className='text-2xl font-bold text-accent'>24/7</div>
                              <div className='text-sm text-muted-foreground'>支持</div>
                            </div>
                          </div>
                          <Button className='w-full bg-accent text-accent-foreground hover:bg-accent/90'>
                            了解更多
                          </Button>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Badge 组件测试 */}
        <div className='space-y-6'>
          <h2 className='text-2xl font-light text-foreground text-center'>Badge 组件测试</h2>

          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>徽章变体</h3>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className='flex flex-wrap gap-2'
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Badge>默认</Badge>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Badge variant='secondary'>次要</Badge>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Badge variant='destructive'>危险</Badge>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Badge variant='outline'>轮廓</Badge>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Badge className='bg-accent text-accent-foreground'>强调</Badge>
              </motion.div>
            </motion.div>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>带图标的徽章</h3>
            <div className='flex flex-wrap gap-2'>
              <Badge className='flex items-center gap-1'>
                <CheckCircle className='w-3 h-3' />
                成功
              </Badge>
              <Badge variant='destructive' className='flex items-center gap-1'>
                <AlertCircle className='w-3 h-3' />
                错误
              </Badge>
              <Badge variant='secondary' className='flex items-center gap-1'>
                <Info className='w-3 h-3' />
                信息
              </Badge>
              <Badge variant='outline' className='flex items-center gap-1'>
                <Heart className='w-3 h-3' />
                收藏
              </Badge>
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>状态徽章</h3>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className='flex flex-wrap gap-2'
            >
              {[
                { color: 'bg-green-500', text: '进行中' },
                { color: 'bg-blue-500', text: '计划中' },
                { color: 'bg-yellow-500', text: '待审核' },
                { color: 'bg-gray-500', text: '已归档' },
                { color: 'bg-purple-500', text: '新功能' },
              ].map((badge, index) => (
                <motion.div
                  key={badge.text}
                  whileHover={{
                    scale: 1.15,
                    y: -2,
                    transition: { type: 'spring', stiffness: 400, damping: 17 },
                  }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: { delay: 0.7 + index * 0.1 },
                  }}
                >
                  <Badge className={badge.color}>{badge.text}</Badge>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>在卡片中使用徽章</h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 100 }}
            >
              <Card>
                <CardContent className='pt-6'>
                  <div className='space-y-3'>
                    <motion.div
                      className='flex items-center justify-between'
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <span>项目进度</span>
                      <div className='flex gap-2'>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Badge variant='outline'>75%</Badge>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Badge variant='secondary'>进行中</Badge>
                        </motion.div>
                      </div>
                    </motion.div>
                    <motion.div
                      className='flex items-center justify-between'
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <span>任务状态</span>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Badge className='bg-green-500'>已完成</Badge>
                      </motion.div>
                    </motion.div>
                    <motion.div
                      className='flex items-center justify-between'
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <span>优先级</span>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ rotate: { duration: 0.5 } }}
                      >
                        <Badge variant='destructive'>紧急</Badge>
                      </motion.div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* 测试所有按钮变体 */}
        <div className='space-y-6'>
          <h2 className='text-2xl font-light text-foreground text-center'>按钮颜色测试</h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, type: 'spring', stiffness: 100 }}
            className='flex flex-wrap justify-center gap-4'
          >
            {[
              { variant: 'default', text: '默认 (bg-primary)' },
              { variant: 'accent', text: '强调色' },
              { variant: 'secondary', text: '辅助色' },
              { variant: 'outline', text: '轮廓' },
              { variant: 'ghost', text: '幽灵' },
              { variant: 'link', text: '链接' },
            ].map((btn, index) => (
              <motion.div
                key={btn.variant}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { delay: 1.1 + index * 0.1, type: 'spring', stiffness: 100 },
                }}
              >
                <Button
                  variant={
                    btn.variant as 'default' | 'accent' | 'secondary' | 'outline' | 'ghost' | 'link'
                  }
                  className={
                    btn.variant === 'accent'
                      ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                      : ''
                  }
                >
                  {btn.text}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
