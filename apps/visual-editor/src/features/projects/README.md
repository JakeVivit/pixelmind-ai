# 项目管理功能

这个模块实现了完整的项目创建和管理功能，支持本地文件系统存储。

## 功能特性

### ✅ 已实现功能

1. **项目创建**
   - 项目名称验证（英文字母、数字、下划线、连字符）
   - 项目描述必填
   - UI 组件库选择（Ant Design、Material-UI、Chakra UI 等）
   - 本地文件夹选择（File System Access API）
   - 自动生成项目提示词文件

2. **数据持久化**
   - 基于文件系统的项目索引
   - 项目元数据存储在 `.pixelmind/projects.json`
   - 每个项目包含 `pixelmind-prompt.md` 配置文件

3. **项目管理**
   - 项目列表展示
   - 项目状态检测（正常/缺失/无效）
   - 自动扫描新项目
   - 项目刷新功能

## 文件结构

```
src/features/projects/
├── components/
│   ├── CreateProjectPage.tsx          # 创建项目主页面
│   ├── ProjectLocationSelector.tsx    # 文件夹选择组件
│   ├── UILibrarySelector.tsx         # UI库选择组件
│   ├── ProjectForm.tsx               # 项目表单组件
│   └── ProjectList.tsx               # 项目列表组件
├── services/
│   ├── ProjectManager.ts             # 项目管理核心类
│   ├── FileSystemService.ts          # 文件系统操作
│   └── PromptGenerator.ts            # 提示词生成
├── types/
│   └── project.ts                    # 项目相关类型定义
└── utils/
    ├── validation.ts                 # 表单验证
    └── constants.ts                  # 常量定义
```

## 使用方法

### 1. 创建新项目

```typescript
import { ProjectManager } from './services/ProjectManager'

const projectManager = ProjectManager.getInstance()

// 设置基础目录（只需要设置一次）
await projectManager.setBaseDirectory()

// 创建项目
const project = await projectManager.createProject({
  name: 'my-awesome-project',
  description: '一个很棒的项目',
  uiLibrary: 'antd',
})
```

### 2. 获取项目列表

```typescript
const projects = await projectManager.getProjects()
```

### 3. 扫描新项目

```typescript
const newProjects = await projectManager.scanForNewProjects()
```

## 项目配置文件格式

每个项目都包含一个 `pixelmind-prompt.md` 文件：

```markdown
---
pixelmind:
  id: 'uuid-1234'
  name: 'my-awesome-project'
  description: '一个很棒的项目'
  template: 'react-vite-typescript'
  uiLibrary: 'antd'
  createdAt: '2024-01-20T10:30:00Z'
  lastModified: '2024-01-20T15:45:00Z'
---

# 项目创建提示词

## 项目信息

- 项目名称: my-awesome-project
- 项目描述: 一个很棒的项目
- UI 组件库: Ant Design
- 技术栈: React + Vite + TypeScript

## 创建要求

请创建一个基于 React + Vite 的项目...
```

## 浏览器兼容性

需要支持 File System Access API 的现代浏览器：

- Chrome 86+
- Edge 86+
- Opera 72+

不支持的浏览器会显示相应的提示信息。

## 技术栈

- **React 18+**: UI 框架
- **TypeScript**: 类型安全
- **File System Access API**: 本地文件系统访问
- **Tailwind CSS**: 样式框架

## 注意事项

1. **安全性**: 所有文件操作都在用户选择的目录内进行
2. **权限**: 需要用户明确授权文件系统访问权限
3. **数据持久化**: 数据存储在用户本地，不依赖后端服务
4. **项目移动**: 如果用户移动了项目文件夹，需要重新扫描
5. **页面刷新**: 由于浏览器安全限制，页面刷新后需要重新授权目录访问权限

## 常见问题

### Q: 为什么页面刷新后需要重新选择目录？

A: 这是浏览器的安全机制。File System Access API 不允许网页在页面刷新后自动访问文件系统，必须由用户重新授权。我们会保存目录路径，但需要用户点击重新授权。

### Q: 如何重新授权目录访问？

A: 在"我的项目"页面，点击目录路径旁边的设置按钮（⚙️），然后选择相同的目录即可恢复访问权限。

### Q: 项目数据会丢失吗？

A: 不会。项目数据都保存在你选择的本地目录中，只是需要重新授权访问权限。

## Gemini AI 集成

### 配置 API Key

1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 登录 Google 账户并创建 API Key
3. 在创建项目时，系统会提示配置 API Key
4. API Key 安全保存在浏览器本地存储中

### AI 生成功能

- **自动生成项目结构**: 根据选择的 UI 库和项目描述
- **完整的文件内容**: 包括 package.json、组件、配置文件等
- **最佳实践**: 生成的代码遵循现代 React 开发最佳实践
- **类型安全**: 完整的 TypeScript 类型定义

## 使用流程

### 完整的项目创建流程

1. **填写项目信息**: 项目名称（英文）和描述
2. **选择 UI 组件库**: Ant Design、Material-UI、Chakra UI 等
3. **选择存储位置**: 使用 File System Access API 选择本地文件夹
4. **配置 Gemini API**: 首次使用需要配置 API Key
5. **AI 生成项目**: Gemini 自动生成完整的项目结构和代码
6. **项目管理**: 在"我的项目"中查看和管理创建的项目

## 后续计划

- [x] Gemini AI 集成
- [x] 项目文件自动生成
- [ ] 项目模板系统扩展
- [ ] 项目导入/导出
- [ ] Git 集成
- [ ] 项目统计和分析
- [ ] 团队协作功能
