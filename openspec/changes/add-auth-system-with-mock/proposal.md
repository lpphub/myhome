# 变更：添加完整认证系统与 Mock 支持

## 为什么
为项目添加完整的认证系统，包括 API 代理配置、Mock 服务支持、现代化的登录注册页面，并采用 Muji 风格的暖调极简设计，使项目能够在开发环境下独立运行完整的认证流程。

## 变更内容
- **开发环境配置**：配置 Vite API 代理和 Mock API 服务
- **认证页面开发**：实现登录和注册页面，采用现代暖调极简（Muji）风格
- **页面结构重组**：使用路由分组方式重组 pages 目录
- **UI 增强**：集成 sonner toast 和 motion 动画效果
- **清理工作**：删除所有测试页面和未使用的路由配置

## 影响
- **影响的规范**：auth, pages, ui, api
- **影响的代码**：
  - `vite.config.ts` - 添加代理和 mock 配置
  - `src/pages/` - 目录结构重组
  - `src/api/auth/` - 集成 mock 支持
  - `src/router/index.tsx` - 路由配置更新
  - `src/styles/` - 新增暖调主题配置
  - `package.json` - 新增依赖（sonner, vite-plugin-mock）