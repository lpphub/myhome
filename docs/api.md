# API 文档

## 目录

- [认证接口 (Auth)](#认证接口-auth)
- [用户接口 (User)](#用户接口-user)
- [空间接口 (Spaces)](#空间接口-spaces)
- [标签接口 (Tags)](#标签接口-tags)

---

## 认证接口 (Auth)

基础路径: `/auth` | 文件位置: `src/api/auth/index.ts`

### 1. 登录

| 属性 | 值 |
|------|-----|
| Method | `POST` |
| Path | `/auth/signin` |

**请求参数 (JSON)**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**返回值 (JSON)**

```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "name": "username",
      "email": "user@example.com",
      "avatar": "https://...",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 2. 注册

| 属性 | 值 |
|------|-----|
| Method | `POST` |
| Path | `/auth/signup` |

**请求参数 (JSON)**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**返回值 (JSON)**

```json
{
  "code": 0,
  "message": "注册成功",
  "data": {
    "user": {
      "id": 1,
      "name": "username",
      "email": "user@example.com",
      "avatar": "https://...",
      "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 3. 刷新令牌

| 属性 | 值 |
|------|-----|
| Method | `PUT` |
| Path | `/auth/refresh` |

**请求参数 (JSON)**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**返回值 (JSON)**

```json
{
  "code": 0,
  "message": "令牌刷新成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 4. 登出

| 属性 | 值 |
|------|-----|
| Method | `POST` |
| Path | `/auth/logout` |

**说明**: 将指定空间设为用户的默认空间

---

## 用户接口 (Person)

基础路径: `/person` | 文件位置: `src/api/person/index.ts`

### 1. 获取用户资料

| 属性 | 值 |
|------|-----|
| Method | `GET` |
| Path | `/person/profile` |

**返回值 (JSON)**

```json
{
  "code": 0,
  "message": "获取成功",
  "data": {
    "id": 1,
    "name": "username",
    "email": "user@example.com",
    "avatar": "https://...",
    "role": "user"
  }
}
```

---

### 2. 更新用户资料

| 属性 | 值 |
|------|-----|
| Method | `PUT` |
| Path | `/person/profile` |

**请求参数 (JSON)**

```json
{
  "name": "newUsername",
  "avatar": "https://..."
}
```

**返回值 (JSON)**

```json
{
  "code": 0,
  "message": "更新用户资料成功",
  "data": {}
}
```

---

### 3. 修改密码

| 属性 | 值 |
|------|-----|
| Method | `PUT` |
| Path | `/person/password` |

**请求参数 (JSON)**

```json
{
  "oldPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

**返回值 (JSON)**

```json
{
  "code": 0,
  "message": "修改密码成功",
  "data": {}
}
```

---

## 空间接口 (Spaces)

基础路径: `/spaces` | 文件位置: `src/api/spaces/index.ts`

### 1. 获取空间列表

| 属性 | 值 |
|------|-----|
| Method | `GET` |
| Path | `/spaces` |

**返回值 (JSON)**

```json
{
  "code": 0,
  "message": "获取空间列表成功",
  "data": [
    {
      "id": 1,
      "name": "我的花园",
      "icon": "🌸",
      "description": "这是一个测试空间",
      "tagCount": 10,
      "memberCount": 3,
      "pin": false,
      "owner": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. 创建空间

| 属性 | 值 |
|------|-----|
| Method | `POST` |
| Path | `/spaces` |

**请求参数 (JSON)**

```json
{
  "name": "新空间",
  "icon": "🏠",
  "description": "空间描述"
}
```

**返回值 (JSON)**

```json
{
  "code": 0,
  "message": "创建空间成功",
  "data": {
    "id": 2
  }
}
```

---

### 3. 更新空间

| 属性 | 值 |
|------|-----|
| Method | `PATCH` |
| Path | `/spaces/:id` |

**请求参数 (JSON)**

```json
{
  "id": 1,
  "name": "更新后的名称",
  "icon": "📚",
  "description": "更新后的描述"
}
```

**返回值 (JSON)**

```json
{
  "code": 0,
  "message": "更新空间成功"
}
```

---

### 4. 删除空间

| 属性 | 值 |
|------|-----|
| Method | `DELETE` |
| Path | `/spaces/:id` |

**返回值 (JSON)**

```json
{
  "code": 0,
  "message": "删除空间成功",
  "data": {}
}
```

---

### 5. 固定默认空间

| 属性 | 值 |
|------|-----|
| Method | `PATCH` |
| Path | `/spaces/:id/pin` |

**返回值 (JSON)**

```json
{
  "code": 0,
  "message": "设置默认空间成功",
  "data": {}
}
```

---

### 6. 获取空间成员列表

| 属性 | 值 |
|------|-----|
| Method | `GET` |
| Path | `/spaces/:id/members` |

**返回值 (JSON)**

```json
{
  "code": 0,
  "message": "获取协作者列表成功",
  "data": [
    {
      "id": 1,
      "spaceId": 1,
      "userId": 1,
      "name": "username",
      "email": "user@example.com",
      "avatar": "https://...",
      "isOwner": true,
      "joinedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 7. 邀请空间成员

| 属性 | 值 |
|------|-----|
| Method | `POST` |
| Path | `/spaces/:id/members/invite` |

**请求参数 (JSON)**

```json
{
  "email": "newmember@example.com"
}
```

**返回值 (JSON)**

```json
{
  "code": 0,
  "message": "邀请已发送",
  "data": {}
}
```

---

### 8. 移除空间成员

| 属性 | 值 |
|------|-----|
| Method | `DELETE` |
| Path | `/spaces/:id/members/:userId` |

**返回值 (JSON)**

```json
{
  "code": 0,
  "message": "移除成员成功",
  "data": {}
}
```

---

### 9. 获取待处理邀请

| 属性 | 值 |
|------|-----|
| Method | `GET` |
| Path | `/invites/pending` |

**返回值 (JSON)**

```json
{
  "code": 0,
  "message": "获取邀请列表成功",
  "data": [
    {
      "id": 1,
      "spaceId": 100,
      "spaceName": "我的花园",
      "spaceIcon": "🌸",
      "inviterId": 2,
      "inviterName": "张三",
      "inviterEmail": "zhangsan@example.com",
      "inviterAvatar": "https://...",
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 10. 响应邀请

| 属性 | 值 |
|------|-----|
| Method | `PATCH` |
| Path | `/invites/:id/respond` |

**请求参数 (JSON)**

```json
{
  "action": "accept"
}
```

**返回值 (JSON)**

```json
{
  "code": 0,
  "message": "已加入空间",
  "data": {}
}
```

---

## 标签接口 (Tags)

基础路径: `/tags` | 文件位置: `src/api/tags/index.ts`

### 1. 获取标签列表

| 属性 | 值 |
|------|-----|
| Method | `GET` |
| Path | `/tags` |

**Query 参数**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| spaceId | `number` | 否 | 空间ID |

**返回值 (JSON)**

```json
{
  "code": 0,
  "message": "获取标签成功",
  "data": [
    {
      "id": 1,
      "code": "work",
      "name": "工作",
      "spaceId": 1,
      "tags": [
        {
          "id": 1,
          "spaceId": 1,
          "name": "紧急",
          "group": "work",
          "order": 0,
          "color": "coral",
          "description": "紧急任务",
          "itemCount": 5,
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  ]
}
```

---

### 2. 创建标签

| 属性 | 值 |
|------|-----|
| Method | `POST` |
| Path | `/tags` |

**请求参数 (JSON)**

```json
{
  "name": "新标签",
  "group": "work",
  "description": "标签描述",
  "color": "coral",
  "spaceId": 1
}
```

**返回值 (JSON)**

```json
{
  "code": 0,
  "message": "创建标签成功",
  "data": {
    "id": 2,
    "spaceId": 1,
    "name": "新标签",
    "group": "work",
    "order": 1,
    "color": "coral",
    "description": "标签描述",
    "itemCount": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 3. 更新标签

| 属性 | 值 |
|------|-----|
| Method | `PATCH` |
| Path | `/tags/:id` |

**请求参数 (JSON)**

```json
{
  "id": 1,
  "name": "更新后的名称",
  "group": "life",
  "description": "更新后的描述",
  "color": "mint-green"
}
```

**返回值 (JSON)**

```json
{
  "code": 0,
  "message": "更新标签成功",
  "data": {}
}
```

---

### 4. 删除标签

| 属性 | 值 |
|------|-----|
| Method | `DELETE` |
| Path | `/tags/:id` |

**返回值 (JSON)**

```json
{
  "code": 0,
  "message": "删除标签成功",
  "data": {}
}
```

---

### 5. 重新排序标签

| 属性 | 值 |
|------|-----|
| Method | `POST` |
| Path | `/tags/reorder` |

**请求参数 (JSON)**

```json
{
  "fromId": 1,
  "toGroup": "work",
  "toIndex": 2
}
```

**返回值 (JSON)**

```json
{
  "code": 0,
  "message": "重新排序成功",
  "data": {}
}
```

---

### 6. 创建分组

| 属性 | 值 |
|------|-----|
| Method | `POST` |
| Path | `/tags/group` |

**请求参数 (JSON)**

```json
{
  "name": "新分组",
  "spaceId": 1
}
```

**返回值 (JSON)**

```json
{
  "code": 0,
  "message": "创建分组成功",
  "data": {
    "id": 3,
    "code": "new-group",
    "name": "新分组",
    "spaceId": 1
  }
}
```

---

### 7. 删除分组

| 属性 | 值 |
|------|-----|
| Method | `DELETE` |
| Path | `/tags/group/:code` |

**返回值 (JSON)**

```json
{
  "code": 0,
  "message": "删除分组成功",
  "data": {}
}
```

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

```json
{
  "code": 0,
  "message": "操作成功",
  "data": { ... }
}
```

| 字段 | 类型 | 描述 |
|------|------|------|
| code | `number` | 状态码 (0 或 200=成功，非0/200=失败) |
| message | `string` | 状态消息 |
| data | `T` | 响应数据 (可选) |
