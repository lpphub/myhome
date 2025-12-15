## ADDED Requirements

### Requirement: Mock API 服务
系统 SHALL 在开发环境下提供 Mock API 服务，支持所有认证相关的接口。

#### Scenario: 登录接口 Mock
- **WHEN** 请求 POST /api/auth/signin
- **THEN** 返回模拟的 JWT token 和用户信息

#### Scenario: 注册接口 Mock
- **WHEN** 请求 POST /api/auth/signup
- **THEN** 返回成功响应和新用户信息

#### Scenario: Token 刷新 Mock
- **WHEN** 请求 POST /api/auth/refresh
- **THEN** 返回新的 JWT token

### Requirement: API 代理配置
系统 SHALL 在开发环境下将 API 请求代理到后端服务器。

#### Scenario: 开发环境代理
- **WHEN** 前端请求 /api/* 路径
- **THEN** 请求被代理到配置的后端地址

#### Scenario: 生产环境直接请求
- **WHEN** 在生产环境下
- **THEN** API 请求直接发送到后端，不使用代理

## MODIFIED Requirements

### Requirement: 认证页面 UI
认证页面 SHALL 采用现代暖调极简（Muji）风格设计，使用米色、暖灰和原木色调。

#### Scenario: 登录页面视觉风格
- **WHEN** 用户访问登录页面
- **THEN** 页面呈现温暖的极简风格，使用米色背景和原木色元素

#### Scenario: 表单交互反馈
- **WHEN** 用户与表单交互
- **THEN** 提供柔和的动画反馈和友好的错误提示

### Requirement: Toast 通知
系统 SHALL 使用 sonner 库提供优雅的 toast 通知。

#### Scenario: 成功提示
- **WHEN** 操作成功完成
- **THEN** 显示绿色的成功 toast 通知

#### Scenario: 错误提示
- **WHEN** 操作发生错误
- **THEN** 显示红色的错误 toast 通知，包含错误信息

### Requirement: 页面动画
系统页面切换 SHALL 使用 smooth motion 动画效果。

#### Scenario: 页面切换动画
- **WHEN** 用户导航到新页面
- **THEN** 页面以淡入淡出效果平滑过渡

#### Scenario: 表单元素动画
- **WHEN** 表单元素获得焦点
- **THEN** 元素以微妙的动画效果响应