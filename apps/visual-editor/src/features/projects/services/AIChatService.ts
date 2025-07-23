import type { CreateProjectData } from '../types/project'

export interface AIChatResult {
  success: boolean
  message: string
  projectPath?: string
  generatedFiles?: Record<string, string>
  error?: string
}

/**
 * AIChat 服务 - 通过 Vite 开发服务器调用 aichat
 * 在开发服务器中运行 aichat 二进制文件
 */
export class AIChatService {
  private static readonly API_BASE_URL = '/api/aichat'

  /**
   * 检查 AIChat 服务是否可用
   */
  static async checkAvailability(): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/health`)
      const result = await response.json()
      return result.success
    } catch (error) {
      console.error('AIChat 服务不可用:', error)
      return false
    }
  }

  /**
   * 创建项目
   */
  static async createProject(
    projectData: CreateProjectData,
    outputPath: string,
    onProgress?: (message: string) => void
  ): Promise<AIChatResult> {
    try {
      onProgress?.('🚀 开始使用 AI 生成项目代码...')

      // 检查服务是否可用
      const isAvailable = await this.checkAvailability()
      if (!isAvailable) {
        return {
          success: false,
          message: 'AIChat 服务不可用，请确保开发服务器已启动',
          error: '服务连接失败',
        }
      }

      onProgress?.('📝 准备项目数据...')

      // 调用 Vite 开发服务器的 API
      onProgress?.('🤖 调用 AI 模型生成代码...')
      const response = await fetch(`${this.API_BASE_URL}/create-project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectData: {
            name: projectData.name,
            description: projectData.description,
            uiLibrary: projectData.uiLibrary,
            aiModel: projectData.aiModel || 'gpt-4o-mini',
          },
          projectPath: outputPath,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        onProgress?.('❌ AI 生成失败')

        // 检查是否是余额不足错误
        const errorMessage = errorData.error || `HTTP ${response.status}`
        if (errorMessage.includes('insufficient_user_quota') || errorMessage.includes('余额不足')) {
          return {
            success: false,
            message: '试用版已经结束，请联系管理员充值',
            error: errorMessage,
          }
        }

        return {
          success: false,
          message: 'AI 代码生成失败',
          error: errorMessage,
        }
      }

      const result = await response.json()

      if (!result.success) {
        onProgress?.('❌ AI 生成失败')

        // 检查是否是余额不足错误
        const errorMessage = result.error || result.message || '未知错误'
        if (errorMessage.includes('insufficient_user_quota') || errorMessage.includes('余额不足')) {
          return {
            success: false,
            message: '试用版已经结束，请联系管理员充值',
            error: errorMessage,
          }
        }

        return {
          success: false,
          message: result.message || 'AI 代码生成失败',
          error: errorMessage,
        }
      }

      onProgress?.(`✅ 成功生成 ${Object.keys(result.generatedFiles || {}).length} 个文件`)
      return {
        success: true,
        message: result.message,
        projectPath: outputPath,
        generatedFiles: result.generatedFiles,
      }
    } catch (error) {
      console.error('AIChat 调用失败:', error)
      onProgress?.('❌ 项目创建失败')
      return {
        success: false,
        message: '项目创建失败',
        error: error instanceof Error ? error.message : '未知错误',
      }
    }
  }

  /**
   * 生成项目说明文档
   */
  static generateProjectReadme(projectData: CreateProjectData): string {
    return `# ${projectData.name}

${projectData.description}

## 技术栈

- **框架**: React 18+
- **构建工具**: Vite 5+
- **语言**: TypeScript 5+
- **样式**: Tailwind CSS 3+
- **UI 组件库**: ${projectData.uiLibrary}
- **路由**: React Router v6

## 快速开始

### 安装依赖
\`\`\`bash
pnpm install
\`\`\`

### 启动开发服务器
\`\`\`bash
pnpm dev
\`\`\`

### 构建生产版本
\`\`\`bash
pnpm build
\`\`\`

## 项目结构

\`\`\`
src/
├── components/          # 可复用组件
├── pages/              # 页面组件
├── hooks/              # 自定义 Hooks
├── utils/              # 工具函数
├── types/              # TypeScript 类型定义
├── styles/             # 样式文件
├── App.tsx
└── main.tsx
\`\`\`

## 开发说明

本项目由 PixelMind AI 自动生成，使用现代化的 React 技术栈。

- 使用 TypeScript 确保类型安全
- 使用 Tailwind CSS 进行样式管理
- 使用 ${projectData.uiLibrary} 作为 UI 组件库
- 支持热重载和快速开发

## 许可证

MIT
`
  }
}
