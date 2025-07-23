import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'

// 加载环境变量
config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export interface AIChatRequest {
  projectData: {
    name: string
    description: string
    uiLibrary: string
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
 * Vite 服务端 AIChat 处理器
 */
export class ViteAIChatHandler {
  private static readonly AICHAT_BIN_PATH = path.join(__dirname, 'bin', 'aichat')
  private static readonly CONFIG_PATH = path.join(__dirname, 'bin', 'aichat-config.yaml')

  /**
   * 处理项目创建请求
   */
  static async handleCreateProject(request: AIChatRequest): Promise<AIChatResponse> {
    try {
      console.log('🚀 开始使用 AI 生成项目代码...')

      // 检查 API Key
      const apiKey = process.env.LAOZHANG_API_KEY
      console.log('环境变量检查:')
      console.log('- LAOZHANG_API_KEY:', apiKey ? `${apiKey.substring(0, 10)}...` : '未设置')
      console.log('- NODE_ENV:', process.env.NODE_ENV)

      if (!apiKey) {
        console.error('❌ API Key 未配置')
        return {
          success: false,
          message: '请配置 LAOZHANG_API_KEY 环境变量',
          error: 'API Key 未配置',
        }
      }

      // 构建提示词
      const prompt = this.buildProjectPrompt(request.projectData)
      console.log('📝 构建项目生成提示词...')

      // 直接调用 HTTP API (临时解决方案)
      console.log('🤖 调用 AI 模型生成代码...')
      console.log('使用直接 HTTP API 调用')

      const result = await this.callHttpAPI(apiKey, prompt)

      if (!result.success) {
        console.log('❌ AI 生成失败')
        console.log('错误详情:', result.error)
        console.log('输出内容:', result.output)
        return {
          success: false,
          message: 'AI 代码生成失败',
          error: result.error || '未知错误',
        }
      }

      console.log('🔍 解析生成的代码文件...')
      const generatedFiles = this.parseGeneratedFiles(result.output)

      if (Object.keys(generatedFiles).length === 0) {
        console.log('⚠️ 未解析到有效文件')
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
   * 直接调用 HTTP API
   */
  private static async callHttpAPI(
    apiKey: string,
    prompt: string
  ): Promise<{ success: boolean; output: string; error?: string }> {
    try {
      const response = await fetch('https://api.laozhang.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          messages: [
            {
              role: 'system',
              content: `You are an expert React project generator. Your task is to create complete, production-ready project structures based on user requirements.

## Output Format Requirements
You MUST output multiple files using this exact format:

\`\`\`
===FILE: package.json===
{
  "name": "project-name",
  ...complete package.json content
}

===FILE: src/App.tsx===
import React from 'react'
...complete App.tsx content

===FILE: src/main.tsx===
import React from 'react'
...complete main.tsx content

===FILE: vite.config.ts===
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
})
\`\`\`

## Requirements
1. Generate ALL necessary files for a complete project
2. Include package.json, tsconfig.json, vite.config.ts, tailwind.config.js
3. Create src/ directory with components, pages, hooks, utils
4. Use TypeScript with proper type definitions
5. Include Tailwind CSS configuration
6. Add proper ESLint and Prettier configs
7. Ensure the project can run with \`npm install && npm run dev\`
8. **IMPORTANT**: Configure Vite to use port 3000 (NOT 5173) in vite.config.ts
9. No placeholders or "..." - provide complete file contents`,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 8000,
          temperature: 0.1,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        return {
          success: false,
          output: '',
          error: `HTTP ${response.status}: ${errorText}`,
        }
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content || ''

      return {
        success: true,
        output: content,
      }
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : '未知错误',
      }
    }
  }

  /**
   * 执行 aichat 命令 (备用方法)
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

    // 解析文件分隔符格式 ===FILE: 文件路径===
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

    // 如果没有找到文件，尝试代码块格式
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
