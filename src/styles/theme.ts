// Muji 风格暖调极简主题配置

export const warmTheme = {
  colors: {
    // 主色调 - 暖木色系
    primary: '#C9A87C', // 暖木色
    primaryHover: '#B89668', // 鼠标悬停时的暖木色
    primaryActive: '#A5855A', // 激活状态的暖木色

    // 背景色
    bgPrimary: '#FAF9F7', // 米白色主背景
    bgSecondary: '#FFFFFF', // 纯白卡片背景
    bgTertiary: '#F5F4F2', // 更深的米色

    // 文字色
    textPrimary: '#3D3D3D', // 深灰色主文字
    textSecondary: '#6B6B6B', // 中灰色次要文字
    textTertiary: '#8B8B8B', // 浅灰色提示文字

    // 功能色
    success: '#7BA05B', // 温暖的绿色
    warning: '#D4A574', // 温暖的橙黄色
    error: '#C97064', // 温暖的红色
    info: '#8B9DC3', // 柔和的蓝色

    // 边框和分割线
    border: '#E8E6E3', // 暖灰色边框
    borderLight: '#F0EEEB', // 更浅的边框

    // 阴影
    shadow: 'rgba(151, 145, 137, 0.15)', // 温暖的阴影色
  },

  borderRadius: {
    small: 4, // 输入框等小元素
    medium: 8, // 卡片等中等元素
    large: 12, // 大型容器
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  shadows: {
    small: '0 1px 3px 0 rgba(151, 145, 137, 0.1)',
    medium: '0 4px 6px -1px rgba(151, 145, 137, 0.1), 0 2px 4px -1px rgba(151, 145, 137, 0.06)',
    large: '0 10px 15px -3px rgba(151, 145, 137, 0.1), 0 4px 6px -2px rgba(151, 145, 137, 0.05)',
  },

  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
}

// Ant Design 主题配置
export const antdWarmTheme = {
  token: {
    colorPrimary: warmTheme.colors.primary,
    colorPrimaryHover: warmTheme.colors.primaryHover,
    colorPrimaryActive: warmTheme.colors.primaryActive,
    colorSuccess: warmTheme.colors.success,
    colorWarning: warmTheme.colors.warning,
    colorError: warmTheme.colors.error,
    colorInfo: warmTheme.colors.info,

    borderRadius: warmTheme.borderRadius.small,
    borderRadiusLG: warmTheme.borderRadius.medium,
    borderRadiusSM: warmTheme.borderRadius.small,

    colorBgContainer: warmTheme.colors.bgSecondary,
    colorBgElevated: warmTheme.colors.bgSecondary,
    colorBgLayout: warmTheme.colors.bgPrimary,

    colorText: warmTheme.colors.textPrimary,
    colorTextSecondary: warmTheme.colors.textSecondary,
    colorTextTertiary: warmTheme.colors.textTertiary,

    colorBorder: warmTheme.colors.border,
    colorBorderSecondary: warmTheme.colors.borderLight,

    fontFamily: warmTheme.typography.fontFamily,
    fontSize: 14,

    boxShadow: warmTheme.shadows.medium,
    boxShadowSecondary: warmTheme.shadows.small,
  },

  components: {
    Button: {
      borderRadius: warmTheme.borderRadius.small,
      controlHeight: 40,
      fontWeight: warmTheme.typography.fontWeight.medium,
    },

    Input: {
      borderRadius: warmTheme.borderRadius.small,
      controlHeight: 40,
      activeBorderColor: warmTheme.colors.primary,
      hoverBorderColor: warmTheme.colors.primaryHover,
    },

    Card: {
      borderRadius: warmTheme.borderRadius.medium,
      boxShadow: warmTheme.shadows.small,
    },

    Form: {
      itemMarginBottom: 20,
    },

    Typography: {
      fontFamily: warmTheme.typography.fontFamily,
    },
  },
}