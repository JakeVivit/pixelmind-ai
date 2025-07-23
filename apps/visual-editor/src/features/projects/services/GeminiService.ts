import type { CreateProjectData } from '../types/project'
import { UI_LIBRARIES } from '../utils/constants'
import { GeminiAdapter, PromptEngineManager } from '@pixelmind/prompt-engine'
import type { AIGenerationRequest } from '@pixelmind/shared'

export interface GeminiProjectResponse {
  success: boolean
  message: string
  projectPath?: string
  error?: string
  generatedFiles?: Record<string, string>
}

export class GeminiService {
  private static geminiAdapter: GeminiAdapter | null = null

  /**
   * 初始化 Gemini 适配器
   */
  static initializeGemini(apiKey: string): boolean {
    try {
      this.geminiAdapter = new GeminiAdapter(apiKey)
      return this.geminiAdapter.isInitialized()
    } catch (error) {
      console.error('Gemini 初始化失败:', error)
      return false
    }
  }

  /**
   * 检查 Gemini 是否已配置
   */
  static isGeminiConfigured(): boolean {
    return this.geminiAdapter !== null && this.geminiAdapter.isInitialized()
  }

  /**
   * 获取 Gemini API Key（从 localStorage）
   */
  static getStoredApiKey(): string | null {
    try {
      return localStorage.getItem('gemini-api-key')
    } catch {
      return null
    }
  }

  /**
   * 保存 Gemini API Key 到 localStorage
   */
  static saveApiKey(apiKey: string): void {
    try {
      localStorage.setItem('gemini-api-key', apiKey)
    } catch (error) {
      console.warn('保存 API Key 失败:', error)
    }
  }

  /**
   * 使用提示词引擎生成项目创建提示词
   */
  static async generateProjectPrompt(projectData: CreateProjectData): Promise<string> {
    try {
      const promptManager = PromptEngineManager.getInstance()

      // 确保提示词引擎已初始化
      await promptManager.initialize({
        version: '1.0.0',
        cacheEnabled: true,
        fallbackMode: true,
      })

      // 编译项目创建提示词
      const compiledPrompt = await promptManager.compileProjectPrompt(
        projectData.name,
        projectData.description,
        projectData.uiLibrary,
        ['routing', 'state-management'], // 默认特性
        false // 暂时不启用动画
      )

      return compiledPrompt.content
    } catch (error) {
      console.error('提示词生成失败，使用后备方案:', error)

      // 后备方案：使用简化的硬编码提示词
      const uiLibrary = UI_LIBRARIES.find(lib => lib.id === projectData.uiLibrary)
      return `# 项目创建任务

## 项目基本信息
- **项目名称**: ${projectData.name}
- **项目描述**: ${projectData.description}
- **UI 组件库**: ${uiLibrary?.name || projectData.uiLibrary}
- **技术栈**: React + Vite + TypeScript + Tailwind CSS

请创建一个现代化的 React 项目，包含完整的项目结构、配置文件和基础组件。

### 要求：
1. 使用 React 18+ + Vite 5+ + TypeScript 5+
2. 集成 Tailwind CSS 和 ${uiLibrary?.name || projectData.uiLibrary}
3. 包含路由、状态管理等基础功能
4. 代码结构清晰，类型安全
5. 包含完整的配置文件和开发工具设置

请生成完整的项目文件，不要使用占位符。`
    }
  }

  /**
   * 使用 Gemini API 创建项目文件
   */
  static async createProject(
    projectData: CreateProjectData,
    outputPath: string
  ): Promise<GeminiProjectResponse> {
    try {
      // 检查 Gemini 是否已配置
      if (!this.isGeminiConfigured()) {
        // 尝试从存储中恢复 API Key
        const storedApiKey = this.getStoredApiKey()
        if (storedApiKey) {
          const initialized = this.initializeGemini(storedApiKey)
          if (!initialized) {
            return {
              success: false,
              message: '需要配置 Gemini API',
              error: 'Gemini API 未配置或配置无效，请先配置 API Key',
            }
          }
        } else {
          return {
            success: false,
            message: '需要配置 Gemini API',
            error: 'Gemini API 未配置，请先配置 API Key',
          }
        }
      }

      console.log('开始使用 Gemini API 生成项目文件...')

      // 使用提示词引擎生成完整的提示词
      const generatedPrompt = await this.generateProjectPrompt(projectData)

      // 生成项目文件的 AI 请求
      const aiRequest: AIGenerationRequest = {
        prompt: generatedPrompt,
        context: {
          framework: 'react' as const,
          uiLibrary: (projectData.uiLibrary === 'mui' ? 'material-ui' : 'antd') as any,
          targetElement: 'project',
          existingComponents: [],
        },
        options: {
          includeTypes: true,
          includeStyles: true,
          includeTests: false,
        },
      }

      const result = await this.geminiAdapter!.processRequest(aiRequest)

      if (result.success && result.code) {
        console.log('Gemini API 生成成功')
        return {
          success: true,
          message: `项目 ${projectData.name} 文件生成成功`,
          projectPath: outputPath,
          generatedFiles: this.parseGeneratedFiles(result.code),
        }
      } else {
        console.warn('Gemini API 生成失败:', result.error)
        return {
          success: false,
          message: '项目文件生成失败',
          error: result.error || '未知错误',
        }
      }
    } catch (error) {
      console.error('Gemini API 调用失败:', error)
      return {
        success: false,
        message: '项目创建失败',
        error: error instanceof Error ? error.message : '未知错误',
      }
    }
  }

  /**
   * 解析 Gemini 生成的代码，提取各个文件
   */
  private static parseGeneratedFiles(generatedCode: string): Record<string, string> {
    const files: Record<string, string> = {}

    console.log('开始解析生成的代码...')
    console.log('生成的代码长度:', generatedCode.length)

    // 方法1: 尝试解析新的文件分隔符格式 ===FILE: 文件路径===
    const newFilePattern = /===FILE:\s*(.+?)\s*===\s*\n([\s\S]*?)(?=\n===FILE:|$)/g
    let match

    while ((match = newFilePattern.exec(generatedCode)) !== null) {
      const fileName = match[1]?.trim()
      const content = match[2]?.trim()

      if (fileName && content) {
        files[fileName] = content
        console.log(`解析到文件: ${fileName} (${content.length} 字符)`)
      }
    }

    // 方法2: 如果新格式没有找到文件，尝试原有的代码块格式
    if (Object.keys(files).length === 0) {
      console.log('新格式解析失败，尝试代码块格式...')

      const codeBlockPattern =
        /```(?:typescript|javascript|json|css|html|tsx|ts|js)?\s*(?:\/\/\s*(.+?)\s*)?\n([\s\S]*?)```/g

      while ((match = codeBlockPattern.exec(generatedCode)) !== null) {
        const fileName = match[1]?.trim()
        const content = match[2]?.trim()

        if (fileName && content) {
          files[fileName] = content
          console.log(`代码块解析到文件: ${fileName} (${content.length} 字符)`)
        }
      }
    }

    // 方法3: 如果还是没有找到文件，尝试标题分割逻辑
    if (Object.keys(files).length === 0) {
      console.log('代码块格式解析失败，尝试标题分割...')

      const sections = generatedCode.split(/(?=^#+ )/m)
      sections.forEach(section => {
        const lines = section.split('\n')
        const title = lines[0]?.replace(/^#+\s*/, '').trim()

        if (title && title.includes('.')) {
          const codeMatch = section.match(/```[\s\S]*?\n([\s\S]*?)```/)
          if (codeMatch) {
            files[title] = codeMatch[1].trim()
            console.log(`标题分割解析到文件: ${title} (${codeMatch[1].trim().length} 字符)`)
          }
        }
      })
    }

    // 方法4: 如果仍然没有文件，将整个内容作为单个组件文件
    if (Object.keys(files).length === 0) {
      console.log('所有解析方法失败，将内容作为单个组件文件')

      // 尝试提取代码块内容
      const singleCodeMatch = generatedCode.match(/```[\s\S]*?\n([\s\S]*?)```/)
      if (singleCodeMatch) {
        files['src/components/GeneratedComponent.tsx'] = singleCodeMatch[1].trim()
        console.log('提取到单个组件文件')
      } else {
        // 如果连代码块都没有，直接使用原始内容
        files['README.md'] = generatedCode
        console.log('使用原始内容作为 README')
      }
    }

    console.log(`最终解析到 ${Object.keys(files).length} 个文件:`, Object.keys(files))
    return files
  }

  /**
   * 生成项目说明文档
   */
  static generateProjectReadme(projectData: CreateProjectData): string {
    const uiLibrary = UI_LIBRARIES.find(lib => lib.id === projectData.uiLibrary)

    return `# ${projectData.name}

${projectData.description}

## 技术栈

- **框架**: React 18+
- **构建工具**: Vite 5+
- **语言**: TypeScript 5+
- **样式**: Tailwind CSS 3+
- **UI 组件库**: ${uiLibrary?.name || projectData.uiLibrary}
- **路由**: React Router v6

## 快速开始

### 安装依赖
\`\`\`bash
npm install
\`\`\`

### 启动开发服务器
\`\`\`bash
npm run dev
\`\`\`

### 构建生产版本
\`\`\`bash
npm run build
\`\`\`

### 预览生产版本
\`\`\`bash
npm run preview
\`\`\`

## 项目结构

\`\`\`
src/
├── components/          # 可复用组件
│   ├── ui/             # 基础 UI 组件
│   └── layout/         # 布局组件
├── pages/              # 页面组件
├── hooks/              # 自定义 Hooks
├── utils/              # 工具函数
├── types/              # TypeScript 类型定义
├── styles/             # 样式文件
├── App.tsx             # 主应用组件
└── main.tsx            # 应用入口
\`\`\`

## 开发指南

### 样式系统
- 主要使用 Tailwind CSS 进行样式开发
- ${uiLibrary?.name || projectData.uiLibrary} 组件用于复杂 UI 组件
- 使用 \`cn\` 工具函数合并 className

### 组件开发
- 所有组件都使用 TypeScript
- 遵循函数式组件 + Hooks 模式
- 组件文件使用 PascalCase 命名

### 代码规范
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 提交前请确保通过所有检查

## 部署

项目构建后的文件在 \`dist\` 目录中，可以部署到任何静态文件服务器。

---

*此项目由 PixelMind AI 创建于 ${new Date().toLocaleString()}*`
  }
}
