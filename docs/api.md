# API 文档

## 目录

- [认证接口 (Auth)](#认证接口-auth)
- [用户接口 (User)](#用户接口-user)
- [空间接口 (Spaces)](#空间接口-spaces)
- [标签接口 (Tags)](#标签接口-tags)

---

## 认证接口 (Auth)

### 基础信息

| 属性 | 值 |
|------|-----|
| 基础路径 | `/auth` |
| 文件位置 | `src/api/auth/index.ts` |

### 接口列表

#### 1. 登录

| 属性 | 值 |
|------|-----|
| 方法 | `POST` |
| 路径 | `/auth/signin` |

**参数**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| email | `string` | 是 | 用户邮箱 |
| password | `string` | 是 | 用户密码 |

**返回值**

```typescript
{
  user: User;
  accessToken: string;
  refreshToken: string;
}
```

| 字段 | 类型 | 描述 |
|------|------|------|
| user | `User` | 用户信息 |
| accessToken | `string` | 访问令牌 |
| refreshToken | `string` | 刷新令牌 |

---

#### 2. 注册

| 属性 | 值 |
|------|-----|
| 方法 | `POST` |
| 路径 | `/auth/signup` |

**参数**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| email | `string` | 是 | 用户邮箱 |
| password | `string` | 是 | 用户密码 |

**返回值**

```typescript
{
  user: User;
  accessToken: string;
  refreshToken: string;
}
```

---

#### 3. 刷新令牌

| 属性 | 值 |
|------|-----|
| 方法 | `PUT` |
| 路径 | `/auth/refresh` |

**参数**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| refresh_token | `string` | 是 | 刷新令牌 |

**返回值**

```typescript
{
  accessToken: string;
  refreshToken: string;
}
```

| 字段 | 类型 | 描述 |
|------|------|------|
| accessToken | `string` | 新的访问令牌 |
| refreshToken | `string` | 新的刷新令牌 |

---

#### 4. 登出

| 属性 | 值 |
|------|-----|
| 方法 | `POST` |
| 路径 | `/auth/logout` |

**返回值**

无（空实现）

---

## 用户接口 (User)

### 基础信息

| 属性 | 值 |
|------|-----|
| 基础路径 | `/user` |
| 文件位置 | `src/api/user/index.ts` |

### 接口列表

#### 1. 获取用户资料

| 属性 | 值 |
|------|-----|
| 方法 | `GET` |
| 路径 | `/user/profile` |

**参数**

无

**返回值**

```typescript
User
```

| 字段 | 类型 | 描述 |
|------|------|------|
| id | `number` | 用户ID |
| name | `string` | 用户名 |
| email | `string` | 用户邮箱 |
| avatar | `string` | 用户头像（可选） |
| role | `string` | 用户角色（可选） |

---

#### 2. 更新用户资料

| 属性 | 值 |
|------|-----|
| 方法 | `PUT` |
| 路径 | `/user/profile` |

**参数**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| name | `string` | 是 | 用户名 |
| avatar | `string` | 否 | 用户头像 |

**返回值**

无

---

#### 3. 修改密码

| 属性 | 值 |
|------|-----|
| 方法 | `PUT` |
| 路径 | `/user/password` |

**参数**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| oldPassword | `string` | 是 | 旧密码 |
| newPassword | `string` | 是 | 新密码 |

**返回值**

无

---

## 空间接口 (Spaces)

### 基础信息

| 属性 | 值 |
|------|-----|
| 基础路径 | `/spaces` |
| 文件位置 | `src/api/spaces/index.ts` |

### 接口列表

#### 1. 获取空间列表

| 属性 | 值 |
|------|-----|
| 方法 | `GET` |
| 路径 | `/spaces` |

**参数**

无

**返回值**

```typescript
Space[]
```

| 字段 | 类型 | 描述 |
|------|------|------|
| id | `number` | 空间ID |
| name | `string` | 空间名称 |
| icon | `string` | 空间图标 |
| description | `string` | 空间描述（可选） |
| tagCount | `number` | 标签数量（可选） |
| memberCount | `number` | 成员数量（可选） |
| pin | `boolean` | 是否置顶（可选） |
| owner | `number` | 所有者ID |
| createdAt | `string` | 创建时间 |
| updatedAt | `string` | 更新时间 |

---

#### 2. 创建空间

| 属性 | 值 |
|------|-----|
| 方法 | `POST` |
| 路径 | `/spaces` |

**参数**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| name | `string` | 是 | 空间名称 |
| icon | `string` | 是 | 空间图标 |
| description | `string` | 否 | 空间描述 |

**返回值**

```typescript
number
```

返回新创建的空间ID

---

#### 3. 更新空间

| 属性 | 值 |
|------|-----|
| 方法 | `PATCH` |
| 路径 | `/spaces/:id` |

**参数**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | `number` | 是 | 空间ID |
| name | `string` | 是 | 空间名称 |
| icon | `string` | 是 | 空间图标 |
| description | `string` | 否 | 空间描述 |

**返回值**

无

---

#### 4. 删除空间

| 属性 | 值 |
|------|-----|
| 方法 | `DELETE` |
| 路径 | `/spaces/:id` |

**参数**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | `number` | 是 | 空间ID |

**返回值**

无

---

#### 5. 切换空间置顶状态

| 属性 | 值 |
|------|-----|
| 方法 | `PATCH` |
| 路径 | `/spaces/:id/pin` |

**参数**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | `number` | 是 | 空间ID |

**返回值**

无

---

#### 6. 获取空间成员列表

| 属性 | 值 |
|------|-----|
| 方法 | `GET` |
| 路径 | `/spaces/:id/members` |

**参数**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| spaceId | `number` | 是 | 空间ID |

**返回值**

```typescript
SpaceMember[]
```

| 字段 | 类型 | 描述 |
|------|------|------|
| id | `number` | 记录ID |
| spaceId | `number` | 空间ID |
| userId | `number` | 用户ID |
| name | `string` | 用户名 |
| email | `string` | 用户邮箱 |
| avatar | `string` | 用户头像（可选） |
| isOwner | `boolean` | 是否为所有者 |
| joinedAt | `string` | 加入时间 |

---

#### 7. 邀请空间成员

| 属性 | 值 |
|------|-----|
| 方法 | `POST` |
| 路径 | `/spaces/:id/members/invite` |

**参数**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| spaceId | `number` | 是 | 空间ID |
| email | `string` | 是 | 被邀请人邮箱 |

**返回值**

无

---

#### 8. 移除空间成员

| 属性 | 值 |
|------|-----|
| 方法 | `DELETE` |
| 路径 | `/spaces/:id/members/:userId` |

**参数**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| spaceId | `number` | 是 | 空间ID |
| userId | `number` | 是 | 用户ID |

**返回值**

无

---

#### 9. 获取待处理邀请

| 属性 | 值 |
|------|-----|
| 方法 | `GET` |
| 路径 | `/invites/pending` |

**参数**

无

**返回值**

```typescript
SpaceInvite[]
```

| 字段 | 类型 | 描述 |
|------|------|------|
| id | `number` | 邀请ID |
| spaceId | `number` | 空间ID |
| spaceName | `string` | 空间名称 |
| spaceIcon | `string` | 空间图标 |
| inviterId | `number` | 邀请人ID |
| inviterName | `string` | 邀请人名称 |
| inviterEmail | `string` | 邀请人邮箱 |
| inviterAvatar | `string` | 邀请人头像（可选） |
| status | `'pending' \| 'accepted' \| 'rejected'` | 邀请状态 |
| createdAt | `string` | 创建时间 |

---

#### 10. 响应邀请

| 属性 | 值 |
|------|-----|
| 方法 | `PATCH` |
| 路径 | `/invites/:id/respond` |

**参数**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| inviteId | `number` | 是 | 邀请ID |
| action | `'accept' \| 'reject'` | 是 | 响应操作 |

**返回值**

无

---

## 标签接口 (Tags)

### 基础信息

| 属性 | 值 |
|------|-----|
| 基础路径 | `/tags` |
| 文件位置 | `src/api/tags/index.ts` |

### 接口列表

#### 1. 获取标签列表

| 属性 | 值 |
|------|-----|
| 方法 | `GET` |
| 路径 | `/tags` |

**参数**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| spaceId | `number` | 否 | 空间ID（可选） |

**返回值**

```typescript
TagGroup[]
```

| 字段 | 类型 | 描述 |
|------|------|------|
| id | `number` | 分组ID |
| code | `string` | 分组编码 |
| name | `string` | 分组名称 |
| spaceId | `number` | 空间ID（可选） |
| tags | `Tag[]` | 标签列表 |

**Tag 类型**

| 字段 | 类型 | 描述 |
|------|------|------|
| id | `number` | 标签ID |
| spaceId | `number` | 空间ID（可选） |
| name | `string` | 标签名称 |
| group | `string` | 分组编码 |
| order | `number` | 排序 |
| color | `string` | 颜色 |
| description | `string` | 描述（可选） |
| itemCount | `number` | 项目数量（可选） |
| createdAt | `string` | 创建时间（可选） |
| updatedAt | `string` | 更新时间（可选） |

---

#### 2. 创建标签

| 属性 | 值 |
|------|-----|
| 方法 | `POST` |
| 路径 | `/tags` |

**参数**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | `number` | 否 | 标签ID（可选） |
| name | `string` | 否 | 标签名称（可选） |
| group | `string` | 否 | 分组编码（可选） |
| description | `string` | 否 | 描述（可选） |
| color | `string` | 否 | 颜色（可选） |
| spaceId | `number` | 否 | 空间ID（可选） |

**返回值**

```typescript
Tag
```

---

#### 3. 更新标签

| 属性 | 值 |
|------|-----|
| 方法 | `PATCH` |
| 路径 | `/tags/:id` |

**参数**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | `number` | 是 | 标签ID |
| name | `string` | 否 | 标签名称（可选） |
| group | `string` | 否 | 分组编码（可选） |
| description | `string` | 否 | 描述（可选） |
| color | `string` | 否 | 颜色（可选） |
| spaceId | `number` | 否 | 空间ID（可选） |

**返回值**

无

---

#### 4. 删除标签

| 属性 | 值 |
|------|-----|
| 方法 | `DELETE` |
| 路径 | `/tags/:id` |

**参数**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| id | `number` | 是 | 标签ID |

**返回值**

无

---

#### 5. 重新排序标签

| 属性 | 值 |
|------|-----|
| 方法 | `POST` |
| 路径 | `/tags/reorder` |

**参数**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| fromId | `number` | 是 | 源标签ID |
| toGroup | `string` | 是 | 目标分组编码 |
| toIndex | `number` | 是 | 目标位置索引 |

**返回值**

无

---

#### 6. 创建分组

| 属性 | 值 |
|------|-----|
| 方法 | `POST` |
| 路径 | `/tags/group` |

**参数**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| name | `string` | 是 | 分组名称 |
| spaceId | `number` | 否 | 空间ID（可选） |

**返回值**

```typescript
Group
```

| 字段 | 类型 | 描述 |
|------|------|------|
| id | `number` | 分组ID |
| code | `string` | 分组编码 |
| name | `string` | 分组名称 |
| spaceId | `number` | 空间ID（可选） |

---

#### 7. 删除分组

| 属性 | 值 |
|------|-----|
| 方法 | `DELETE` |
| 路径 | `/tags/group/:code` |

**参数**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| code | `string` | 是 | 分组编码 |

**返回值**

无

---

## 附录

### 标签颜色

| 颜色编码 | 名称 |
|----------|------|
| lemon | 柠檬 |
| coral | 珊瑚 |
| lavender | 薰衣草 |
| honey | 蜂蜜 |
| cream | 奶油 |
| macaron-pink | 马卡龙粉 |
| mint-green | 薄荷绿 |

### 空间图标

支持以下 emoji 作为空间图标：

🏠 🛋️ 🪴 📚 🍳 🛏️ 🚿 🧸 🎨 💻 🏃 🎵 🎬 🍵 🌙 ☀️ ⭐ 🎯 💡 📝

---

## 响应格式

所有 API 响应遵循统一格式：

```typescript
{
  code: number;      // 状态码
  message: string;   // 状态消息
  data?: T;          // 数据（可选）
}
```
