import { AlertCircle, CheckCircle, Eye, EyeOff, Heart, Info, Plus, Star, X } from 'lucide-react'
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

// 动画变体定义
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
  const [inputValue, setInputValue] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [toggleState, setToggleState] = useState(false)
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  const handleLoading = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* 导航栏 */}
      <nav className='sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border'>
        <div className='max-w-6xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-light text-foreground'>UI 组件展示</h1>
            <div className='flex gap-4'>
              <Button variant='ghost' size='sm'>
                Input
              </Button>
              <Button variant='ghost' size='sm'>
                Button
              </Button>
              <Button variant='ghost' size='sm'>
                Card
              </Button>
              <Button variant='ghost' size='sm'>
                Badge
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className='max-w-6xl mx-auto px-6 py-8 space-y-16'>
        {/* 家庭收纳主区域 - 从main分支恢复 */}
        <section className='space-y-8'>
          <div className='text-center'>
            <h1 className='text-4xl font-light text-foreground mb-2'>家庭收纳</h1>
            <p className='text-muted-foreground text-lg'>整理生活，从收纳开始</p>
          </div>

          {/* 收纳分类卡片 */}
          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            className='grid grid-cols-1 md:grid-cols-3 gap-6'
          >
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
              className='h-full'
            >
              <Card variant='soft' className='h-full'>
                <CardHeader>
                  <CardTitle className='text-foreground'>衣物收纳</CardTitle>
                  <CardDescription>智能分类，节省空间</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>
                    根据季节和材质进行智能分类，最大化利用衣柜空间
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant='outline' className='w-full'>
                    查看方案
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

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
              className='h-full'
            >
              <Card variant='soft' className='h-full'>
                <CardHeader>
                  <CardTitle className='text-foreground'>厨房用品</CardTitle>
                  <CardDescription>整洁有序，烹饪愉快</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>
                    合理规划厨房布局，让烹饪变得更加高效便捷
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant='outline' className='w-full'>
                    查看方案
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

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
              className='h-full'
            >
              <Card variant='soft' className='h-full'>
                <CardHeader>
                  <CardTitle className='text-foreground'>杂物整理</CardTitle>
                  <CardDescription>告别混乱，拥抱整洁</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>
                    科学收纳日常用品，让每个物品都有专属位置
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant='outline' className='w-full'>
                    查看方案
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>

          {/* 搜索区域 */}
          <div className='flex justify-center'>
            <div className='w-full max-w-md'>
              <Input placeholder='搜索收纳方案...' className='w-full h-12 text-base' />
            </div>
          </div>
        </section>

        {/* Input 组件测试 */}
        <section id='input' className='space-y-8'>
          <div className='text-center'>
            <h2 className='text-3xl font-light text-foreground mb-2'>Input 组件</h2>
            <p className='text-muted-foreground'>输入框的各种状态和样式</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* 基础输入框 */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>基础输入框</CardTitle>
                <CardDescription>标准输入框样式</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <Input placeholder='请输入内容...' />
                <Input
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder='受控输入框'
                />
                <div className='text-sm text-muted-foreground'>当前值: {inputValue}</div>
              </CardContent>
            </Card>

            {/* 状态输入框 */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>状态输入框</CardTitle>
                <CardDescription>不同状态的输入框</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <Input placeholder='正常状态' />
                <Input placeholder='禁用状态' disabled />
                <Input placeholder='只读状态' readOnly value='只读内容' />
              </CardContent>
            </Card>

            {/* 特殊输入框 */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>特殊输入框</CardTitle>
                <CardDescription>带附加功能的输入框</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='relative'>
                  <Input type={passwordVisible ? 'text' : 'password'} placeholder='密码输入' />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-0 top-0 h-full px-3'
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                  </Button>
                </div>
                <Input type='email' placeholder='邮箱输入' />
                <Input type='number' placeholder='数字输入' />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Button 组件测试 */}
        <section id='button' className='space-y-8'>
          <div className='text-center'>
            <h2 className='text-3xl font-light text-foreground mb-2'>Button 组件</h2>
            <p className='text-muted-foreground'>按钮的各种变体和状态</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* 按钮变体 */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>按钮变体</CardTitle>
                <CardDescription>不同样式的按钮</CardDescription>
              </CardHeader>
              <CardContent className='space-y-3'>
                <Button variant='default' className='w-full'>
                  默认按钮
                </Button>
                <Button variant='secondary' className='w-full'>
                  次要按钮
                </Button>
                <Button variant='outline' className='w-full'>
                  轮廓按钮
                </Button>
                <Button variant='ghost' className='w-full'>
                  幽灵按钮
                </Button>
                <Button variant='link' className='w-full'>
                  链接按钮
                </Button>
              </CardContent>
            </Card>

            {/* 按钮尺寸 */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>按钮尺寸</CardTitle>
                <CardDescription>不同大小的按钮</CardDescription>
              </CardHeader>
              <CardContent className='space-y-3'>
                <Button size='lg' className='w-full'>
                  大号按钮
                </Button>
                <Button size='default' className='w-full'>
                  默认按钮
                </Button>
                <Button size='sm' className='w-full'>
                  小号按钮
                </Button>
                <Button size='icon' className='w-full'>
                  <Plus className='h-4 w-4' />
                </Button>
              </CardContent>
            </Card>

            {/* 按钮状态 */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>按钮状态</CardTitle>
                <CardDescription>不同状态的按钮</CardDescription>
              </CardHeader>
              <CardContent className='space-y-3'>
                <Button disabled className='w-full'>
                  禁用按钮
                </Button>
                <Button onClick={handleLoading} loading={isLoading} className='w-full'>
                  {isLoading ? '加载中...' : '点击加载'}
                </Button>
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={() => setToggleState(!toggleState)}
                >
                  {toggleState ? '已开启' : '已关闭'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 带图标的按钮 */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>带图标的按钮</CardTitle>
              <CardDescription>结合图标的按钮样式</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-3'>
                <Button>
                  <Plus className='mr-2 h-4 w-4' />
                  添加
                </Button>
                <Button variant='outline'>
                  <Heart className='mr-2 h-4 w-4' />
                  收藏
                </Button>
                <Button variant='secondary'>
                  <Star className='mr-2 h-4 w-4' />
                  收藏
                </Button>
                <Button variant='destructive'>
                  <X className='mr-2 h-4 w-4' />
                  删除
                </Button>
                <Button variant='ghost'>
                  <Info className='mr-2 h-4 w-4' />
                  信息
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Card 组件测试 */}
        <section id='card' className='space-y-8'>
          <div className='text-center'>
            <h2 className='text-3xl font-light text-foreground mb-2'>Card 组件</h2>
            <p className='text-muted-foreground'>卡片的各种布局和交互</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* 基础卡片 */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card>
                <CardHeader>
                  <CardTitle>基础卡片</CardTitle>
                  <CardDescription>这是一个基础的卡片组件</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>卡片内容区域，可以放置任何内容。</p>
                </CardContent>
                <CardFooter>
                  <Button className='w-full'>确认</Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* 特殊样式卡片 */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card variant='warm'>
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle>特殊卡片</CardTitle>
                    <Badge variant='honey'>NEW</Badge>
                  </div>
                  <CardDescription>带有特殊样式的卡片</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span>状态</span>
                      <Badge variant='secondary'>活跃</Badge>
                    </div>
                    <div className='flex justify-between'>
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

            {/* 可交互的卡片 */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                className='cursor-pointer'
                onClick={() => setSelectedCard(selectedCard === 1 ? null : 1)}
              >
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    可交互卡片
                    <motion.div
                      animate={{ rotate: selectedCard === 1 ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Star className='w-4 h-4' />
                    </motion.div>
                  </CardTitle>
                  <CardDescription>点击展开/收起内容</CardDescription>
                </CardHeader>
                <AnimatePresence>
                  {selectedCard === 1 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent>
                        <p className='text-sm text-muted-foreground'>
                          这是展开的详细内容。点击卡片标题可以收起这部分内容。
                        </p>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
                <CardFooter>
                  <Button variant='outline' className='w-full'>
                    查看更多
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Badge 组件测试 */}
        <section id='badge' className='space-y-8'>
          <div className='text-center'>
            <h2 className='text-3xl font-light text-foreground mb-2'>Badge 组件</h2>
            <p className='text-muted-foreground'>徽章的各种变体和用法</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* 基础徽章 */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>基础徽章</CardTitle>
                <CardDescription>徽章的各种变体</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex flex-wrap gap-2'>
                  <Badge>默认</Badge>
                  <Badge variant='secondary'>次要</Badge>
                  <Badge variant='destructive'>危险</Badge>
                  <Badge variant='outline'>轮廓</Badge>
                  <Badge variant='honey'>蜂蜜色</Badge>
                  <Badge variant='coral'>珊瑚色</Badge>
                  <Badge variant='lavender'>薰衣草色</Badge>
                  <Badge variant='lemon'>柠檬色</Badge>
                </div>
              </CardContent>
            </Card>

            {/* 带图标的徽章 */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>带图标的徽章</CardTitle>
                <CardDescription>结合图标的徽章</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
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
              </CardContent>
            </Card>

            {/* 状态徽章 */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>状态徽章</CardTitle>
                <CardDescription>表示不同状态的徽章</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex flex-wrap gap-2'>
                  <Badge className='bg-green-500'>进行中</Badge>
                  <Badge className='bg-blue-500'>计划中</Badge>
                  <Badge className='bg-yellow-500'>待审核</Badge>
                  <Badge className='bg-gray-500'>已归档</Badge>
                  <Badge className='bg-purple-500'>新功能</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 交互式卡片动效 */}
        <section className='space-y-8'>
          <div className='text-center'>
            <h2 className='text-3xl font-light text-foreground mb-2'>交互式卡片动效</h2>
            <p className='text-muted-foreground'>高级交互动画展示</p>
          </div>

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
              <Card className='cursor-pointer overflow-hidden' variant='warm'>
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    特殊样式的展开卡片
                    <motion.div
                      animate={{ rotate: expandedCard === 2 ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckCircle className='w-4 h-4' />
                    </motion.div>
                  </CardTitle>
                  <CardDescription>使用特殊样式的交互卡片</CardDescription>
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
                              <div className='text-2xl font-bold text-foreground'>24/7</div>
                              <div className='text-sm text-muted-foreground'>支持</div>
                            </div>
                          </div>
                          <Button className='w-full'>了解更多</Button>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
