import { PromptEngine } from './PromptEngine.js'
import { TemplateLoader } from './TemplateLoader.js'
import type { PromptTemplate, PromptContext, CompiledPrompt, PromptEngineConfig } from './types.js'

/**
 * 提示词工程管理器
 * 统一管理提示词引擎的初始化、配置和使用
 */
export class PromptEngineManager {
  private static instance: PromptEngineManager | null = null
  private engine: PromptEngine
  private loader: TemplateLoader
  private initialized: boolean = false

  private constructor() {
    this.engine = new PromptEngine()
    this.loader = new TemplateLoader()
  }

  /**
   * 获取单例实例
   */
  static getInstance(): PromptEngineManager {
    if (!PromptEngineManager.instance) {
      PromptEngineManager.instance = new PromptEngineManager()
    }
    return PromptEngineManager.instance
  }

  /**
   * 初始化提示词引擎
   */
  async initialize(config: Partial<PromptEngineConfig> = {}): Promise<void> {
    if (this.initialized) {
      return
    }

    try {
      // 重新创建引擎实例以应用配置
      this.engine = new PromptEngine(config)

      // 配置模板加载器
      if (config.baseUrl) {
        this.loader.setBaseUrl(config.baseUrl)
      }
      if (config.apiKey) {
        this.loader.setApiKey(config.apiKey)
      }

      // 加载内置模板
      await this.loadBuiltinTemplates()

      // 如果配置了远程 URL，尝试加载远程模板
      if (config.baseUrl) {
        try {
          await this.loadRemoteTemplates()
        } catch (error) {
          console.warn('Failed to load remote templates:', error)
          if (!config.fallbackMode) {
            throw error
          }
        }
      }

      this.initialized = true
      console.log('PromptEngine initialized successfully')
    } catch (error) {
      console.error('Failed to initialize PromptEngine:', error)
      throw error
    }
  }

  /**
   * 加载内置模板
   */
  private async loadBuiltinTemplates(): Promise<void> {
    // 使用硬编码的内置模板，避免文件加载问题
    this.loadFallbackTemplates()
  }

  /**
   * 加载远程模板
   */
  private async loadRemoteTemplates(): Promise<void> {
    try {
      const templateList = await this.loader.getRemoteTemplateList()
      console.log(`Found ${templateList.length} remote templates`)

      for (const templateInfo of templateList) {
        try {
          const template = await this.loader.loadRemoteTemplate(templateInfo.id)
          this.engine.registerTemplate(template)
        } catch (error) {
          console.warn(`Failed to load remote template ${templateInfo.id}:`, error)
        }
      }
    } catch (error) {
      console.error('Failed to load remote templates:', error)
      throw error
    }
  }

  /**
   * 加载后备模板（硬编码）
   */
  private loadFallbackTemplates(): void {
    const reactViteTemplate: PromptTemplate = {
      id: 'react-vite-base',
      name: 'React + Vite 基础项目',
      description: '创建基于 React + Vite + TypeScript 的现代化项目',
      version: '1.0.0',
      category: 'project-creation',
      tags: ['react', 'vite', 'typescript', 'tailwind'],
      variables: [
        {
          name: 'projectName',
          type: 'string',
          required: true,
          description: '项目名称',
        },
        {
          name: 'projectDescription',
          type: 'string',
          required: true,
          description: '项目描述',
        },
        {
          name: 'uiLibrary',
          type: 'string',
          required: true,
          description: 'UI 组件库',
        },
        {
          name: 'features',
          type: 'array',
          required: false,
          description: '项目特性',
          defaultValue: ['routing'],
        },
        {
          name: 'animations',
          type: 'boolean',
          required: false,
          description: '是否包含动画效果',
          defaultValue: false,
        },
      ],
      content: `# 项目创建任务

## 项目基本信息
- **项目名称**: {{projectName}}
- **项目描述**: {{projectDescription}}
- **UI 组件库**: {{uiLibraryName}}
- **技术栈**: React + Vite + TypeScript + Tailwind CSS
{{#if animations}}
- **动画库**: Framer Motion
{{/if}}

## 创建要求

请创建一个现代化的 React 项目，严格按照以下要求：

### 1. 技术栈配置
- **框架**: React 18+
- **构建工具**: Vite 5+
- **语言**: TypeScript 5+
- **样式**: Tailwind CSS 3+ (必须)
- **UI 组件库**: {{uiLibraryName}}
{{#if animations}}
- **动画**: Framer Motion
{{/if}}

### 2. 项目结构
创建以下目录结构：
\`\`\`
{{projectName}}/
├── public/
│   ├── vite.svg
│   └── index.html
├── src/
│   ├── components/          # 可复用组件
│   │   ├── ui/             # 基础 UI 组件
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   └── layout/         # 布局组件
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── Layout.tsx
│   ├── pages/              # 页面组件
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   └── NotFound.tsx
{{#if features.includes 'routing'}}
│   ├── router/             # 路由配置
│   │   └── index.tsx
{{/if}}
│   ├── hooks/              # 自定义 Hooks
│   │   └── useLocalStorage.ts
│   ├── utils/              # 工具函数
│   │   ├── cn.ts          # className 合并工具
│   │   └── constants.ts    # 常量定义
│   ├── types/              # TypeScript 类型定义
│   │   └── index.ts
│   ├── styles/             # 样式文件
│   │   └── globals.css
{{#if animations}}
│   ├── animations/         # 动画配置
│   │   └── variants.ts
{{/if}}
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── .gitignore
├── .eslintrc.cjs
├── .prettierrc
└── README.md
\`\`\`

### 3. 依赖包配置

#### 核心依赖 (package.json dependencies)
\`\`\`json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
{{#if features.includes 'routing'}}
  "react-router-dom": "^6.8.0",
{{/if}}
  "{{uiLibraryPackage}}": "latest",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0"
{{#if animations}},
  "framer-motion": "^10.0.0"
{{/if}}
}
\`\`\`

### 4. 特殊要求

1. **确保所有组件都有完整的 TypeScript 类型定义**
2. **使用 Tailwind CSS 作为主要样式方案**
3. **{{uiLibraryName}} 组件作为 UI 增强，不冲突**
4. **代码结构清晰，便于扩展**
5. **包含基础的错误处理**
6. **所有文件都要有适当的注释**
{{#if animations}}
7. **使用 Framer Motion 添加页面切换和组件动画**
{{/if}}

## 验收标准
1. 项目能够成功启动 (npm run dev)
2. 所有页面正常渲染
{{#if features.includes 'routing'}}
3. 路由功能正常
{{/if}}
4. {{uiLibraryName}} 组件正常显示
5. Tailwind CSS 样式生效
6. TypeScript 编译无错误
7. ESLint 检查通过
{{#if animations}}
8. 动画效果正常工作
{{/if}}

请严格按照以上要求创建项目，确保每个文件都有完整的内容，不要使用占位符或省略号。

## 输出格式要求

请按照以下格式输出所有文件，每个文件用特定的分隔符包围：

\`\`\`
===FILE: package.json===
{
  "name": "{{projectName}}",
  ...完整的 package.json 内容
}

===FILE: src/App.tsx===
import React from 'react'
...完整的 App.tsx 内容

===FILE: src/main.tsx===
import React from 'react'
...完整的 main.tsx 内容

===FILE: vite.config.ts===
import { defineConfig } from 'vite'
...完整的 vite.config.ts 内容

===FILE: README.md===
# {{projectName}}
...完整的 README.md 内容
\`\`\`

**重要**:
1. 必须输出所有必需的文件，包括配置文件、组件文件、样式文件等
2. 每个文件都要有完整的内容，不能省略
3. 使用 ===FILE: 文件路径=== 作为文件分隔符
4. 确保项目可以直接运行 pnpm install && pnpm dev`,
      metadata: {
        author: 'PixelMind AI',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        license: 'proprietary',
        compatibility: ['react@18+', 'vite@5+', 'typescript@5+'],
        dependencies: [],
      },
    }

    this.engine.registerTemplate(reactViteTemplate)
    console.log('Loaded builtin templates')
  }

  /**
   * 编译项目创建提示词
   */
  async compileProjectPrompt(
    projectName: string,
    projectDescription: string,
    uiLibrary: string,
    features: string[] = [],
    animations: boolean = false
  ): Promise<CompiledPrompt> {
    if (!this.initialized) {
      await this.initialize()
    }

    const context: PromptContext = {
      projectType: 'react-vite',
      uiLibrary,
      framework: 'react',
      features,
      customVariables: {},
    }

    const variables = {
      projectName,
      projectDescription,
      uiLibrary,
      features,
      animations,
    }

    return await this.engine.compilePrompt('react-vite-base', context, variables)
  }

  /**
   * 获取可用模板列表
   */
  getAvailableTemplates(): PromptTemplate[] {
    return this.engine.getAllTemplates()
  }

  /**
   * 获取特定分类的模板
   */
  getTemplatesByCategory(category: string): PromptTemplate[] {
    return this.engine.getTemplatesByCategory(category)
  }

  /**
   * 获取引擎统计信息
   */
  getStats() {
    return this.engine.getStats()
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.engine.clearCache()
  }

  /**
   * 重置引擎（用于测试）
   */
  reset(): void {
    this.initialized = false
    this.engine = new PromptEngine()
    this.loader = new TemplateLoader()
  }
}
