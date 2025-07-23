# @pixelmind/prompt-engine

🚀 **PixelMind AI 提示词工程系统** - 强大、可扩展的模板化提示词生成引擎

## 📦 安装

```bash
npm install @pixelmind/prompt-engine
# 或
yarn add @pixelmind/prompt-engine
# 或
pnpm add @pixelmind/prompt-engine
```

## 🚀 快速开始

### 基础使用

```typescript
import { PromptEngineManager } from '@pixelmind/prompt-engine'

// 初始化引擎
const manager = PromptEngineManager.getInstance()
await manager.initialize({
  version: '1.0.0',
  cacheEnabled: true,
  fallbackMode: true
})

// 生成项目创建提示词
const prompt = await manager.compileProjectPrompt(
  'my-awesome-app',
  '一个很棒的 React 应用',
  'antd',
  ['routing', 'state-management'],
  true // 启用动画
)

console.log(prompt.content)
```

### 便捷函数

```typescript
import { generateProjectPrompt } from '@pixelmind/prompt-engine'

const prompt = await generateProjectPrompt(
  'my-project',
  '项目描述',
  'mui',
  ['routing'],
  false
)
```

## 🏗️ 架构特点

- **🔧 模块化设计**: 核心引擎、模板加载器、管理器分离
- **📝 类型安全**: 完整的 TypeScript 类型定义
- **⚡ 性能优化**: 智能缓存机制
- **🔄 多层后备**: 本地 → 远程 → 硬编码后备
- **🎨 灵活模板**: 支持变量替换和条件逻辑

## 📋 API 文档

### PromptEngineManager

主要的管理类，提供统一的接口。

#### 方法

- `getInstance()`: 获取单例实例
- `initialize(config?)`: 初始化引擎
- `compileProjectPrompt(...)`: 编译项目创建提示词
- `getAvailableTemplates()`: 获取可用模板列表
- `getStats()`: 获取引擎统计信息

### 配置选项

```typescript
interface PromptEngineConfig {
  baseUrl?: string        // 远程模板 API 地址
  apiKey?: string         // API 密钥
  version: string         // 版本号
  cacheEnabled: boolean   // 是否启用缓存
  fallbackMode: boolean   // 是否启用后备模式
}
```

## 🎨 模板系统

### 模板格式

```json
{
  "id": "template-id",
  "name": "模板名称",
  "description": "模板描述",
  "version": "1.0.0",
  "category": "project-creation",
  "variables": [
    {
      "name": "projectName",
      "type": "string",
      "required": true,
      "description": "项目名称"
    }
  ],
  "content": "模板内容 {{projectName}}",
  "metadata": {
    "author": "作者",
    "license": "MIT"
  }
}
```

### 模板语法

#### 变量替换
```
{{variableName}}
```

#### 条件语句
```
{{#if condition}}
  条件为真时显示的内容
{{/if}}
```

#### 数组包含检查
```
{{#if features.includes 'routing'}}
  包含路由功能
{{/if}}
```

## 🔧 高级用法

### 自定义模板加载器

```typescript
import { TemplateLoader } from '@pixelmind/prompt-engine'

class CustomLoader extends TemplateLoader {
  async loadFromDatabase(id: string): Promise<PromptTemplate> {
    // 自定义加载逻辑
    return await this.fetchFromDB(id)
  }
}
```

### 远程模板配置

```typescript
await manager.initialize({
  baseUrl: 'https://api.pixelmind.ai',
  apiKey: 'your-api-key',
  cacheEnabled: true,
  fallbackMode: true
})
```

## 🎯 支持的项目类型

- ✅ React + Vite + TypeScript
- ✅ 多种 UI 库支持 (Ant Design, Material-UI, Chakra UI 等)
- ✅ 路由和状态管理
- ✅ 动画效果集成
- 🔄 Vue.js 支持 (计划中)
- 🔄 Next.js 支持 (计划中)

## 📊 性能特性

- **智能缓存**: 避免重复编译
- **懒加载**: 按需加载模板
- **并行处理**: 提升加载速度
- **内存优化**: 高效的内存使用

## 🔒 安全考虑

- **模板验证**: 防止恶意代码注入
- **类型检查**: 运行时类型验证
- **错误处理**: 完善的错误处理机制

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🔗 相关链接

- [GitHub 仓库](https://github.com/pixelmind-ai/prompt-engine)
- [问题反馈](https://github.com/pixelmind-ai/prompt-engine/issues)
- [更新日志](CHANGELOG.md)

---

**由 PixelMind AI 团队精心打造** ❤️
