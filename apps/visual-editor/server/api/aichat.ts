import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export interface AIChatRequest {
  projectData: {
    name: string
    description: string
    uiLibrary: string
    aiModel?: string
  }
  projectPath: string
}

export interface AIChatResponse {
  success: boolean
  message: string
  projectPath?: string
  generatedFiles?: Record<string, string>
  error?: string
}

/**
 * AIChat API 处理器
 */
export class AIChatAPI {
  private static readonly AICHAT_BIN_PATH = path.join(__dirname, '../../bin/aichat')
  private static readonly CONFIG_PATH = path.join(__dirname, '../../bin/aichat-config.yaml')

  /**
   * 处理项目创建请求
   */
  static async handleCreateProject(request: AIChatRequest): Promise<AIChatResponse> {
    try {
      console.log('🚀 开始使用 AI 生成项目代码...')

      // 检查 API Key
      const apiKey = process.env.LAOZHANG_API_KEY
      if (!apiKey) {
        return {
          success: false,
          message: '请配置 LAOZHANG_API_KEY 环境变量',
          error: 'API Key 未配置',
        }
      }

      // 构建提示词
      const prompt = this.buildProjectPrompt(request.projectData)
      console.log('📝 构建项目生成提示词...')

      // 执行 aichat 命令
      const selectedModel = request.projectData.aiModel || 'gpt-4o-mini'
      console.log(`🤖 调用 AI 模型 (${selectedModel}) 生成代码...`)

      const result = await this.executeCommand(
        [
          '--config',
          this.CONFIG_PATH,
          '-m',
          `laozhang:${selectedModel}`, // 使用选择的模型
          '--no-stream', // 不使用流式输出，获取完整结果
          prompt,
        ],
        {
          env: {
            ...process.env,
            LAOZHANG_API_KEY: apiKey,
          },
        }
      )

      if (!result.success) {
        console.log('❌ AI 生成失败')

        // 检查是否是余额不足错误
        const errorMessage = result.error || '未知错误'
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

      console.log('🔍 解析生成的代码文件...')
      const generatedFiles = this.parseGeneratedFiles(result.output)

      if (Object.keys(generatedFiles).length === 0) {
        console.log('⚠️ 未解析到有效文件，使用后备方案')
        return {
          success: false,
          message: '未能解析生成的文件',
          error: '文件解析失败',
        }
      }

      console.log(`✅ 成功生成 ${Object.keys(generatedFiles).length} 个文件`)
      return {
        success: true,
        message: `项目 ${request.projectData.name} 文件生成成功`,
        projectPath: request.projectPath,
        generatedFiles,
      }
    } catch (error) {
      console.error('AIChat 调用失败:', error)
      return {
        success: false,
        message: '项目创建失败',
        error: error instanceof Error ? error.message : '未知错误',
      }
    }
  }

  /**
   * 构建项目生成提示词
   */
  private static buildProjectPrompt(projectData: AIChatRequest['projectData']): string {
    return `# 项目创建任务

## 项目基本信息
- **项目名称**: ${projectData.name}
- **项目描述**: ${projectData.description}
- **UI 组件库**: ${projectData.uiLibrary}
- **技术栈**: React + Vite + TypeScript + Tailwind CSS

## 创建要求

请创建一个现代化的 React 项目，严格按照以下要求：

### 1. 技术栈配置
- **框架**: React 18+
- **构建工具**: Vite 5+
- **语言**: TypeScript 5+
- **样式**: Tailwind CSS 3+ (必须)
- **UI 组件库**: ${projectData.uiLibrary}

### 2. 项目结构
创建完整的项目目录结构，包含所有必要的配置文件和源代码文件。

### 3. 依赖包配置
确保 package.json 包含所有必要的依赖，项目可以直接运行。

### 4. 特殊要求
1. **确保所有组件都有完整的 TypeScript 类型定义**
2. **使用 Tailwind CSS 作为主要样式方案**
3. **代码结构清晰，便于扩展**
4. **包含基础的错误处理**
5. **所有文件都要有适当的注释**

## 验收标准
1. 项目能够成功启动 (pnpm run dev)
2. 所有页面正常渲染
3. 路由功能正常
4. UI 组件正常显示
5. Tailwind CSS 样式生效
6. TypeScript 编译无错误

请严格按照要求创建项目，确保每个文件都有完整的内容，不要使用占位符或省略号。`
  }

  /**
   * 执行 aichat 命令
   */
  private static async executeCommand(
    args: string[],
    options: { env?: Record<string, string> } = {}
  ): Promise<{ success: boolean; output: string; error?: string }> {
    return new Promise(resolve => {
      const child = spawn(this.AICHAT_BIN_PATH, args, {
        env: options.env || process.env,
        stdio: ['pipe', 'pipe', 'pipe'],
      })

      let stdout = ''
      let stderr = ''

      child.stdout?.on('data', data => {
        stdout += data.toString()
      })

      child.stderr?.on('data', data => {
        stderr += data.toString()
      })

      child.on('close', code => {
        if (code === 0) {
          resolve({
            success: true,
            output: stdout,
          })
        } else {
          resolve({
            success: false,
            output: stdout,
            error: stderr || `进程退出码: ${code}`,
          })
        }
      })

      child.on('error', error => {
        resolve({
          success: false,
          output: '',
          error: error.message,
        })
      })
    })
  }

  /**
   * 解析生成的文件
   */
  private static parseGeneratedFiles(generatedCode: string): Record<string, string> {
    const files: Record<string, string> = {}

    console.log('开始解析 AIChat 生成的代码...')
    console.log('生成的代码长度:', generatedCode.length)

    // 方法1: 解析新的文件分隔符格式 ===FILE: 文件路径===
    const filePattern = /===FILE:\s*(.+?)\s*===\s*\n([\s\S]*?)(?=\n===FILE:|$)/g
    let match

    while ((match = filePattern.exec(generatedCode)) !== null) {
      const fileName = match[1]?.trim()
      const content = match[2]?.trim()

      if (fileName && content) {
        files[fileName] = content
        console.log(`解析到文件: ${fileName} (${content.length} 字符)`)
      }
    }

    // 方法2: 如果新格式没有找到文件，尝试代码块格式
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

    console.log(`最终解析到 ${Object.keys(files).length} 个文件:`, Object.keys(files))
    return files
  }
}
