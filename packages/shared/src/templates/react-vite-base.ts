// React + Vite 基础项目模板

import { getAllTemplateFiles } from './react-components'

export interface ProjectTemplate {
  name: string
  description: string
  files: Record<string, string>
}

export const REACT_VITE_BASE_TEMPLATE: ProjectTemplate = {
  name: 'React + Vite + TypeScript',
  description: '现代化的 React 项目模板，包含 Vite、TypeScript、Tailwind CSS 和路由',
  files: {
    'package.json': `{
  "name": "{{projectName}}",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "{{uiLibraryPackage}}": "latest",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}`,

    'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})`,

    'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,

    'tsconfig.node.json': `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`,

    'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,

    'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

    '.eslintrc.cjs': `module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'eslint-plugin-react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}`,

    '.gitignore': `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?`,

    'index.html': `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{projectName}}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,

    'public/vite.svg': `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"></stop><stop offset="8.333%" stop-color="#FFDD35"></stop><stop offset="100%" stop-color="#FFA800"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>`,

    'README.md': `# {{projectName}}

{{projectDescription}}

## 技术栈

- **React 18** - 用户界面库
- **Vite** - 现代化构建工具
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 实用优先的 CSS 框架
- **{{uiLibraryName}}** - UI 组件库
- **React Router** - 客户端路由

## 开发

\`\`\`bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview
\`\`\`

## 项目结构

\`\`\`
src/
├── components/     # 可复用组件
├── pages/         # 页面组件
├── router/        # 路由配置
├── hooks/         # 自定义 Hooks
├── utils/         # 工具函数
├── types/         # TypeScript 类型
├── styles/        # 样式文件
├── App.tsx        # 根组件
└── main.tsx       # 应用入口
\`\`\`

## 特性

- ⚡️ Vite 快速开发和构建
- 🎨 Tailwind CSS 样式系统
- 🧩 {{uiLibraryName}} 组件库
- 🛣️ React Router 路由管理
- 📱 响应式设计
- 🔧 TypeScript 类型安全
- 🎯 ESLint 代码规范

由 PixelMind AI 生成 ✨`,

    'src/main.tsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,

    'src/App.tsx': `import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router'
import { Layout } from './components/layout/Layout'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AppRouter />
      </Layout>
    </BrowserRouter>
  )
}

export default App`,

    'src/vite-env.d.ts': `/// <reference types="vite/client" />`,

    'src/styles/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: system-ui, sans-serif;
  }
}`,

    'src/router/index.tsx': `import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home } from '../pages/Home'
import { About } from '../pages/About'
import { NotFound } from '../pages/NotFound'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}`,

    'src/pages/Home.tsx': `import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          欢迎使用 {{projectName}}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          {{projectDescription}}
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link to="/about">了解更多</Link>
          </Button>
          <Button variant="outline">
            开始使用
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">⚡️ 快速开发</h3>
          <p className="text-gray-600 dark:text-gray-300">
            基于 Vite 的快速开发体验，热重载和快速构建
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">🎨 现代设计</h3>
          <p className="text-gray-600 dark:text-gray-300">
            使用 Tailwind CSS 和 {{uiLibraryName}} 构建美观的界面
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">🔧 类型安全</h3>
          <p className="text-gray-600 dark:text-gray-300">
            TypeScript 提供完整的类型安全和开发体验
          </p>
        </Card>
      </div>
    </div>
  )
}`,

    'src/pages/About.tsx': `import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        关于 {{projectName}}
      </h1>

      <div className="prose prose-lg dark:prose-invert">
        <p>
          {{projectDescription}}
        </p>

        <h2>技术栈</h2>
        <ul>
          <li><strong>React 18</strong> - 现代化的用户界面库</li>
          <li><strong>Vite</strong> - 快速的构建工具</li>
          <li><strong>TypeScript</strong> - 类型安全的 JavaScript</li>
          <li><strong>Tailwind CSS</strong> - 实用优先的 CSS 框架</li>
          <li><strong>{{uiLibraryName}}</strong> - 专业的 UI 组件库</li>
          <li><strong>React Router</strong> - 客户端路由管理</li>
        </ul>

        <h2>特性</h2>
        <ul>
          <li>响应式设计，支持各种设备</li>
          <li>现代化的开发工具链</li>
          <li>完整的 TypeScript 支持</li>
          <li>组件化架构</li>
          <li>代码规范和质量保证</li>
        </ul>
      </div>

      <div className="mt-8">
        <Button asChild>
          <Link to="/">返回首页</Link>
        </Button>
      </div>
    </div>
  )
}`,

    'src/pages/NotFound.tsx': `import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function NotFound() {
  return (
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
        页面未找到
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        抱歉，您访问的页面不存在。
      </p>
      <Button asChild>
        <Link to="/">返回首页</Link>
      </Button>
    </div>
  )
}`,
  },
}

// 模板变量替换函数
export function replaceTemplateVariables(
  template: string,
  variables: Record<string, string>
): string {
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g')
    result = result.replace(regex, value)
  }
  return result
}

// 生成完整项目文件
export function generateProjectFiles(
  projectName: string,
  projectDescription: string,
  uiLibrary: string,
  features: string[] = []
): Record<string, string> {
  const uiLibraryMap: Record<string, { name: string; package: string }> = {
    antd: { name: 'Ant Design', package: 'antd' },
    mui: { name: 'Material-UI', package: '@mui/material' },
    chakra: { name: 'Chakra UI', package: '@chakra-ui/react' },
  }

  const uiLibInfo = uiLibraryMap[uiLibrary] || { name: 'Ant Design', package: 'antd' }

  const variables = {
    projectName,
    projectDescription,
    uiLibrary,
    uiLibraryName: uiLibInfo.name,
    uiLibraryPackage: uiLibInfo.package,
  }

  const files: Record<string, string> = {}

  // 合并基础模板和组件模板
  const allTemplateFiles = {
    ...REACT_VITE_BASE_TEMPLATE.files,
    ...getAllTemplateFiles(),
  }

  for (const [filePath, content] of Object.entries(allTemplateFiles)) {
    files[filePath] = replaceTemplateVariables(content, variables)
  }

  return files
}
