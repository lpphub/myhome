## ADDED Requirements

### Requirement: Mock API 配置
系统 SHALL 在开发环境下提供完整的 Mock API 支持。

#### Scenario: Mock 服务启动
- **WHEN** 开发服务器启动且 VITE_ENABLE_MOCK=true
- **THEN** Mock API 服务自动启动，拦截所有 /api/* 请求

#### Scenario: Mock 数据持久化
- **WHEN** 用户在 Mock 环境下注册
- **THEN** 新用户数据保存在内存中，支持后续登录验证

## MODIFIED Requirements

### Requirement: API 代理配置
系统 SHALL 支持开发环境下的 API 代理。

#### Scenario: 开发环境代理
- **WHEN** VITE_ENABLE_MOCK=false 且发送 API 请求
- **THEN** 请求被代理到配置的后端服务器地址

#### Scenario: 环境变量配置
- **WHEN** 配置开发环境
- **THEN** 支持以下环境变量：
  - VITE_API_BASE_URL: 后端服务器地址
  - VITE_ENABLE_MOCK: 是否启用 Mock 服务

### Requirement: API 错误处理
API 请求错误 SHALL 通过统一的错误处理机制展示。

#### Scenario: 网络错误处理
- **WHEN** API 请求失败
- **THEN** 显示友好的错误提示，不暴露技术细节

#### Scenario: Mock 环境错误
- **WHEN** Mock API 遇到未处理的请求
- **THEN** 返回标准化的错误响应，并在控制台输出警告