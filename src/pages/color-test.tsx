import { Heart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ColorTest() {
  return (
    <div className='min-h-screen bg-honey-50 p-8'>
      <div className='max-w-4xl mx-auto space-y-8'>
        <h1 className='text-3xl font-bold text-honey-700'>颜色测试页面</h1>

        <Card>
          <CardHeader>
            <CardTitle>自定义颜色验证</CardTitle>
            <CardDescription>验证自定义颜色系统是否正常工作</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Honey色系 */}
              <div className='space-y-2'>
                <h3 className='font-medium text-honey-700'>Honey色系</h3>
                <div className='bg-honey-500 text-white p-4 rounded-lg'>
                  <p>bg-honey-500</p>
                </div>
                <div className='bg-honey-200 text-honey-800 p-4 rounded-lg'>
                  <p>bg-honey-200</p>
                </div>
              </div>

              {/* Cream色系 */}
              <div className='space-y-2'>
                <h3 className='font-medium text-honey-700'>Cream色系</h3>
                <div className='bg-cream-100 text-gray-800 p-4 rounded-lg'>
                  <p>bg-cream-100</p>
                </div>
                <div className='bg-cream-200 text-gray-800 p-4 rounded-lg'>
                  <p>bg-cream-200</p>
                </div>
              </div>

              {/* Coral色系 */}
              <div className='space-y-2'>
                <h3 className='font-medium text-honey-700'>Coral色系</h3>
                <div className='bg-coral-500 text-white p-4 rounded-lg'>
                  <p>bg-coral-500</p>
                </div>
                <div className='bg-coral-100 text-coral-800 p-4 rounded-lg'>
                  <p>bg-coral-100</p>
                </div>
              </div>

              {/* WarmGray色系 */}
              <div className='space-y-2'>
                <h3 className='font-medium text-honey-700'>WarmGray色系</h3>
                <div className='bg-warmGray-100 text-warmGray-800 p-4 rounded-lg'>
                  <p>bg-warmGray-100</p>
                </div>
                <div className='bg-warmGray-200 text-warmGray-800 p-4 rounded-lg'>
                  <p>bg-warmGray-200</p>
                </div>
              </div>
            </div>

            {/* 按钮测试 */}
            <div className='space-y-2'>
              <h3 className='font-medium text-honey-700'>按钮组件测试</h3>
              <div className='flex flex-wrap gap-2'>
                <Button variant='default'>默认按钮</Button>
                <Button variant='secondary'>次要按钮</Button>
                <Button variant='outline'>边框按钮</Button>
                <Button variant='ghost'>幽灵按钮</Button>
              </div>
            </div>

            {/* 图标测试 */}
            <div className='flex items-center gap-2'>
              <Heart className='w-6 h-6 text-coral-500' />
              <span className='text-warmGray-700'>图标颜色测试 - 爱心图标应该显示为coral色系</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
