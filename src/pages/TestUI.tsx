import { Heart } from 'lucide-react'

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

export default function ComponentTest() {
  return (
    <div className='min-h-screen bg-honey-50 p-8'>
      <div className='max-w-4xl mx-auto space-y-8'>
        {/* Button Variants Test */}
        <Card>
          <CardHeader>
            <CardTitle>Button 组件测试</CardTitle>
            <CardDescription>测试所有 Button 变体和状态</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Variants */}
            <div className='space-y-2'>
              <h3 className='font-medium text-honey-700'>变体测试:</h3>
              <div className='flex flex-wrap gap-2'>
                <Button variant='default'>Default</Button>
                <Button variant='secondary'>Secondary</Button>
                <Button variant='outline'>Outline</Button>
                <Button variant='ghost'>Ghost</Button>
                <Button variant='link'>Link</Button>
              </div>
            </div>

            {/* Sizes */}
            <div className='space-y-2'>
              <h3 className='font-medium text-honey-700'>尺寸测试:</h3>
              <div className='flex items-end gap-2'>
                <Button size='sm'>Small</Button>
                <Button size='default'>Default</Button>
                <Button size='lg'>Large</Button>
              </div>
            </div>

            {/* States */}
            <div className='space-y-2'>
              <h3 className='font-medium text-honey-700'>状态测试:</h3>
              <div className='flex flex-wrap gap-2'>
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
                <Button variant='destructive'>Destructive</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Variants Test */}
        <Card>
          <CardHeader>
            <CardTitle>Card 组件完整版测试</CardTitle>
            <CardDescription>展示所有 Card 子组件的组合效果</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
              <Card variant='default' hoverable>
                <CardHeader>
                  <CardTitle>Default Card</CardTitle>
                  <CardDescription>默认样式的完整卡片组件</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-warmGray-600 mb-4'>
                    这是标准的卡片组件，包含 Header、Content 和 Footer 部分。
                  </p>
                  <div className='bg-cream-50 p-3 rounded-lg'>
                    <p className='text-sm text-warmGray-700'>内容区域：支持自定义内容</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className='flex items-center justify-between'>
                    <span className='text-warmGray-500 text-sm'>卡片底部</span>
                    <Button size='sm' variant='outline'>
                      操作
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              <Card variant='warm' hoverable decorative>
                <CardHeader>
                  <CardTitle>Warm Card</CardTitle>
                  <CardDescription>温暖渐变的卡片，带装饰元素</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-warmGray-600 mb-4'>温暖主题的卡片，包含装饰性背景元素。</p>
                  <div className='bg-honey-50 p-3 rounded-lg'>
                    <p className='text-sm text-warmGray-700'>🌟 温暖内容区域</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className='text-center text-warmGray-500 text-sm'>
                    <Heart className='w-4 h-4 text-coral-500 inline mr-1' />
                    温暖底部信息
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
              <Card variant='soft' hoverable>
                <CardHeader>
                  <CardTitle>Soft Card</CardTitle>
                  <CardDescription>柔和半透明的卡片</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-warmGray-600 mb-4'>半透明背景的卡片，适合轻量级内容展示。</p>
                  <div className='bg-cream-100/50 p-3 rounded-lg border border-cream-200'>
                    <p className='text-sm text-warmGray-700'>💫 柔和内容</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className='flex justify-center gap-2'>
                    <Button size='sm' variant='ghost'>
                      取消
                    </Button>
                    <Button size='sm'>确认</Button>
                  </div>
                </CardFooter>
              </Card>

              <Card variant='glass' hoverable decorative>
                <CardHeader>
                  <CardTitle>Glass Card</CardTitle>
                  <CardDescription>玻璃态效果的卡片，带装饰性元素</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-warmGray-600 mb-4'>玻璃态卡片，具有毛玻璃效果和装饰性元素。</p>
                  <div className='bg-white/30 backdrop-blur-sm p-3 rounded-lg border border-white/20'>
                    <p className='text-sm text-warmGray-700'>✨ 玻璃内容区域</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className='flex items-center justify-between'>
                    <span className='text-warmGray-500 text-sm'>玻璃态底部</span>
                    <div className='flex gap-1'>
                      <Button size='icon' variant='ghost'>
                        ❤️
                      </Button>
                      <Button size='icon' variant='ghost'>
                        ⭐
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* 简化版本对比 */}
            <div className='mt-8'>
              <h3 className='text-lg font-medium text-honey-700 mb-4'>简化版本对比</h3>
              <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                <Card variant='default' className='p-4'>
                  <h4 className='font-medium text-honey-700 mb-2'>仅 Content</h4>
                  <p className='text-warmGray-500 text-sm'>只有内容区域的简化卡片</p>
                </Card>

                <Card variant='warm' className='p-4'>
                  <h4 className='font-medium text-honey-700 mb-2'>仅 Content</h4>
                  <p className='text-warmGray-500 text-sm'>只有内容区域的温暖卡片</p>
                </Card>

                <Card variant='soft' className='p-4'>
                  <h4 className='font-medium text-honey-700 mb-2'>仅 Content</h4>
                  <p className='text-warmGray-500 text-sm'>只有内容区域的柔和卡片</p>
                </Card>

                <Card variant='glass' className='p-4'>
                  <h4 className='font-medium text-honey-700 mb-2'>仅 Content</h4>
                  <p className='text-warmGray-500 text-sm'>只有内容区域的玻璃卡片</p>
                </Card>
              </div>
            </div>

            {/* Hoverable Cards */}
            <div className='space-y-2'>
              <h3 className='font-medium text-honey-700'>悬停效果测试:</h3>
              <div className='flex gap-4'>
                <Card variant='default' hoverable className='p-4'>
                  <h4 className='font-medium text-honey-700 mb-2'>Hoverable Card</h4>
                  <p className='text-warmGray-500 text-sm'>悬停时有动画效果</p>
                </Card>

                <Card variant='glass' hoverable decorative className='p-4'>
                  <h4 className='font-medium text-honey-700 mb-2'>Decorative Card</h4>
                  <p className='text-warmGray-500 text-sm'>带装饰性元素</p>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input Variants Test */}
        <Card>
          <CardHeader>
            <CardTitle>Input 组件测试</CardTitle>
            <CardDescription>测试所有 Input 变体和状态</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Variants */}
            <div className='space-y-2'>
              <h3 className='font-medium text-honey-700'>变体测试:</h3>
              <div className='space-y-2'>
                <Input placeholder='Default input' />
                <Input variant='error' placeholder='Error input' />
                <Input variant='ghost' placeholder='Ghost input' />
              </div>
            </div>

            {/* Sizes */}
            <div className='space-y-2'>
              <h3 className='font-medium text-honey-700'>尺寸测试:</h3>
              <div className='space-y-2'>
                <Input size='sm' placeholder='Small input' />
                <Input size='default' placeholder='Default input' />
                <Input size='lg' placeholder='Large input' />
              </div>
            </div>

            {/* States */}
            <div className='space-y-2'>
              <h3 className='font-medium text-honey-700'>状态测试:</h3>
              <div className='space-y-2'>
                <Input placeholder='Normal input' />
                <Input disabled placeholder='Disabled input' />
                <Input placeholder='Focus me' className='ring-2 ring-honey-200 border-honey-400' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
