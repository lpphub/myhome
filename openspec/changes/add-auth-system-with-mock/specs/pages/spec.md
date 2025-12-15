## ADDED Requirements

### Requirement: 路由分组页面结构
页面 SHALL 使用路由分组方式组织，区分认证页面和应用页面。

#### Scenario: 认证路由组
- **WHEN** 访问 /signin 或 /signup
- **THEN** 页面位于 (auth) 路由组下，不需要认证

#### Scenario: 应用路由组
- **WHEN** 访问 /dashboard
- **THEN** 页面位于 (app) 路由组下，需要认证才能访问

## MODIFIED Requirements

### Requirement: 页面目录结构
pages 目录 SHALL 采用路由分组的方式进行组织。

#### Scenario: 新目录结构
- **WHEN** 查看页面源码
- **THEN** 目录结构如下：
```
src/pages/
├── (auth)/
│   ├── signin.tsx
│   └── signup.tsx
├── (app)/
│   └── dashboard.tsx
└── index.ts
```

## REMOVED Requirements

### Requirement: 测试页面
**原因**: 测试页面不再需要，应该使用专业的测试框架
**迁移**: 删除所有测试相关的页面和路由

#### Scenario: 删除测试页面
- **WHEN** 清理项目
- **THEN** 所有 test、demo 相关页面被删除

### Requirement: 未使用的路由
**原因**: 未实现的路由配置会造成混淆
**迁移**: 删除所有未实现的路由定义

#### Scenario: 清理路由配置
- **WHEN** 更新路由
- **THEN** 删除所有指向不存在页面的路由