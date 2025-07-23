import type { CreateProjectData, ProjectMetadata, PromptFileData } from '../types/project'
import { UI_LIBRARIES, DEFAULT_TEMPLATE } from '../utils/constants'
import { generateUUID } from '../utils/validation'

export class PromptGenerator {
  /**
   * 生成项目提示词文件内容
   */
  static generatePromptFile(projectData: CreateProjectData): PromptFileData {
    const metadata: ProjectMetadata = {
      id: generateUUID(),
      name: projectData.name,
      description: projectData.description,
      template: DEFAULT_TEMPLATE,
      uiLibrary: projectData.uiLibrary,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }

    const uiLibrary = UI_LIBRARIES.find(lib => lib.id === projectData.uiLibrary)
    const content = this.generatePromptContent(metadata, uiLibrary)

    return { metadata, content }
  }

  /**
   * 生成提示词内容
   */
  private static generatePromptContent(
    metadata: ProjectMetadata, 
    uiLibrary?: typeof UI_LIBRARIES[0]
  ): string {
    return `---
pixelmind:
  id: "${metadata.id}"
  name: "${metadata.name}"
  description: "${metadata.description}"
  template: "${metadata.template}"
  uiLibrary: "${metadata.uiLibrary}"
  createdAt: "${metadata.createdAt}"
  lastModified: "${metadata.lastModified}"
---

# ${metadata.name} - 项目创建提示词

## 项目信息
- **项目名称**: ${metadata.name}
- **项目描述**: ${metadata.description}
- **UI 组件库**: ${uiLibrary?.name || metadata.uiLibrary}
- **技术栈**: React + Vite + TypeScript + Tailwind CSS

## 创建要求

请创建一个现代化的 React 项目，包含以下特性：

### 基础配置
1. **框架**: React 18+ 
2. **构建工具**: Vite
3. **语言**: TypeScript
4. **样式**: Tailwind CSS (必须)
5. **UI 组件库**: ${uiLibrary?.name || metadata.uiLibrary}

### 项目结构
\`\`\`
${metadata.name}/
├── public/
│   └── vite.svg
├── src/
│   ├── components/          # 可复用组件
│   │   ├── ui/             # 基础 UI 组件
│   │   └── layout/         # 布局组件
│   ├── pages/              # 页面组件
│   │   ├── Home.tsx
│   │   └── About.tsx
│   ├── hooks/              # 自定义 Hooks
│   ├── utils/              # 工具函数
│   ├── types/              # TypeScript 类型定义
│   ├── styles/             # 样式文件
│   │   └── globals.css
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
└── README.md
\`\`\`

### 依赖包要求

#### 核心依赖
\`\`\`json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0"
}
\`\`\`

#### UI 和样式
\`\`\`json
{
  "tailwindcss": "^3.3.0",
  "${uiLibrary?.packageName || '@ant-design/icons'}": "latest"
}
\`\`\`

#### 开发工具
\`\`\`json
{
  "@types/react": "^18.0.0",
  "@types/react-dom": "^18.0.0",
  "@vitejs/plugin-react": "^4.0.0",
  "typescript": "^5.0.0",
  "vite": "^4.4.0",
  "autoprefixer": "^10.4.14",
  "postcss": "^8.4.24"
}
\`\`\`

### 配置文件

#### Tailwind CSS 配置
请确保 Tailwind CSS 与 ${uiLibrary?.name || metadata.uiLibrary} 兼容，避免样式冲突。

#### Vite 配置
配置路径别名，支持 @ 指向 src 目录。

### 初始页面内容

#### App.tsx
创建一个包含路由的主应用组件，展示：
- 导航栏（使用 ${uiLibrary?.name || metadata.uiLibrary} 组件）
- 路由配置（Home 和 About 页面）
- 响应式布局

#### Home.tsx
创建一个欢迎页面，展示：
- 项目标题和描述
- ${uiLibrary?.name || metadata.uiLibrary} 的几个示例组件
- Tailwind CSS 样式示例

### 开发体验
1. 配置 ESLint 和 Prettier
2. 添加 Git 忽略文件
3. 包含详细的 README.md
4. 配置开发服务器热重载

### 安装命令
\`\`\`bash
${uiLibrary?.installCommand || 'npm install antd @ant-design/icons'}
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

## 注意事项
- 确保所有组件都有 TypeScript 类型定义
- 使用 Tailwind CSS 作为主要样式方案
- ${uiLibrary?.name || metadata.uiLibrary} 组件作为 UI 增强
- 保持代码结构清晰，便于后续开发
- 添加基础的错误边界处理

---
*此文件由 PixelMind AI 自动生成于 ${new Date().toLocaleString()}*`
  }

  /**
   * 解析提示词文件，提取项目元数据
   */
  static parsePromptFile(content: string): ProjectMetadata | null {
    try {
      // 提取 YAML front matter
      const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
      if (!frontMatterMatch) return null

      const frontMatter = frontMatterMatch[1]
      
      // 简单的 YAML 解析（仅支持我们的格式）
      const pixelmindMatch = frontMatter.match(/pixelmind:\s*\n([\s\S]*?)(?=\n\w|\n$|$)/)
      if (!pixelmindMatch) return null

      const pixelmindSection = pixelmindMatch[1]
      
      const extractValue = (key: string): string => {
        const match = pixelmindSection.match(new RegExp(`${key}:\\s*"([^"]*)"`, 'm'))
        return match ? match[1] : ''
      }

      return {
        id: extractValue('id'),
        name: extractValue('name'),
        description: extractValue('description'),
        template: extractValue('template'),
        uiLibrary: extractValue('uiLibrary'),
        createdAt: extractValue('createdAt'),
        lastModified: extractValue('lastModified')
      }
    } catch (error) {
      console.error('解析提示词文件失败:', error)
      return null
    }
  }
}
