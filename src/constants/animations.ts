// 动画配置常量
export const animations = {
  // 淡入动画
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },

  // 从左滑入
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3, delay: 0.2 },
  },

  // 从右滑入
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3, delay: 0.2 },
  },

  // 从上滑入
  slideInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, delay: 0.1 },
  },

  // 缩放淡入
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },

  // 浮动动画
  float: {
    initial: { y: 0 },
    animate: { y: -10 },
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
}

// 动画配置基础类型
interface AnimationConfig {
  initial?: Record<string, number | string>
  animate?: Record<string, number | string>
  transition?: {
    duration?: number
    delay?: number
    ease?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

// 延迟动画生成器
export const createDelayedAnimation = (baseAnimation: AnimationConfig, delay: number) => ({
  ...baseAnimation,
  transition: {
    ...baseAnimation.transition,
    delay,
  },
})
