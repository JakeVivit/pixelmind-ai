你是一个资深前端架构师，现在需要初始化一个名为 PixelMind AI 的现代前端项目。请按以下严格约束生成项目目录结构和开发规划：

**核心目标**
创建可视化 AI 前端开发工具，实现：

1. 基于浏览器页面的本地开发环境
2. 组件级 AI 代码生成引擎
3. 实时预览和动态路由更新
4. WebContainers 集成

**技术要求**
├─ 框架：React 18 + TypeScript
├─ 构建工具：Vite 5
├─ UI 组件库：Ant Design 5.x
├─ 状态管理：Zustand
├─ 编辑器：Monaco Editor
├─ 沙盒环境：WebContainer API
├─ AI 集成：Gemini API 客户端
└─ 代码分析：Babel AST 解析器

**目录生成规则**

1. 使用 pnpm 作为包管理器
2. 采用 Monorepo 结构（apps/packages 模式）
3. 包含完整的.gitignore 和 README.md
4. 为每个目录添加使用注释（英文）
5. 关键文件需有基础实现模板

**特殊要求**

- 为 WebContainers 配置优化项
- 预置 Ant Design 主题定制入口
- 设计提示词工程目录结构
- 实现热更新通信桥接层

**禁止行为**

1. 不要使用 Redux 等重型工具
2. 不要生成后端服务代码
3. 不要包含测试文件（后续单独生成）

**输出格式**

以下是为您设计的 ​​PixelMind AI​​ 项目生成指令，以 AI 可读的提示词形式呈现，可直接复制到 AI 开发助手（如 GitHub Copilot、Claude 或 Gemini）中进行项目初始化和技术栈规划：

🤖 AI 指令模板（直接复制使用）
你是一个资深前端架构师，现在需要初始化一个名为 PixelMind AI 的现代前端项目。请按以下严格约束生成项目目录结构和开发规划：

**核心目标**
创建可视化 AI 前端开发工具，实现：

1. 基于浏览器页面的本地开发环境
2. 组件级 AI 代码生成引擎
3. 实时预览和动态路由更新
4. WebContainers 集成

**技术要求**
├─ 框架：React 18 + TypeScript
├─ 构建工具：Vite 5
├─ UI 组件库：Ant Design 5.x
├─ 状态管理：Zustand
├─ 编辑器：Monaco Editor
├─ 沙盒环境：WebContainer API
├─ AI 集成：Gemini API 客户端
└─ 代码分析：Babel AST 解析器

**目录生成规则**

1. 使用 pnpm 作为包管理器
2. 采用 Monorepo 结构（apps/packages 模式）
3. 包含完整的.gitignore 和 README.md
4. 为每个目录添加使用注释（英文）
5. 关键文件需有基础实现模板

**特殊要求**

- 为 WebContainers 配置优化项
- 预置 Ant Design 主题定制入口
- 设计提示词工程目录结构
- 实现热更新通信桥接层

**禁止行为**

1. 不要使用 Redux 等重型工具
2. 不要生成后端服务代码
3. 不要包含测试文件（后续单独生成）

**输出格式**
markdown

项目目录结构
[使用 tree 格式展示]

技术栈说明
[表格：包名|版本|用途]

MVP 里程碑计划
[季度路线图，含关键目标]

### 预测的 AI 生成结果示例：

markdown

项目目录结构
pixelmind-ai/

├── apps

│ ├── visual-editor/ # 主应用

│ │ ├── public/ # 静态资源

│ │ ├── src/

│ │ │ ├── core/

│ │ │ │ ├── ai-engine/ # AI 核心

│ │ │ │ ├── sandbox/ # WebContainers 桥接

│ │ │ │ └── file-system # 虚拟文件系统

│ │ │ ├── features/

│ │ │ │ ├── component-generator/ # 组件生成器

│ │ │ │ └── route-manager/ # 路由管理

│ │ │ ├── layouts/ # 页面布局

│ │ │ ├── providers/ # 全局 Provider

│ │ │ ├── styles/ # 全局样式

│ │ │ └── main.tsx # 入口

│ │ ├── index.html

│ │ ├── tsconfig.json

│ │ └── vite.config.ts # Vite 配置

│ └── demo-app/ # 生成的项目预览

├── packages

│ ├── prompt-engine/ # 提示词工程

│ │ ├── ant-design/ # AntD 提示词库

│ │ │ ├── button.prompt.yaml

│ │ │ └── layout-rules.ts

│ │ ├── gemini-adapter.ts # Gemini 交互层

│ │ └── utils.ts

│ └── shared/ # 公共工具

│ ├── ast-parser/ # AST 解析

│ └── webcontainer-utils

├── .editorconfig

├── .gitignore

├── package.json

├── pnpm-workspace.yaml # Monorepo 配置

└── README.md # 项目文档

示例工作流
cd apps/visual-editor

pnpm dev # 启动主应用

cd packages/prompt-engine

pnpm gen:prompt # 生成提示词模板

MVP 里程碑计划
2025-Q3：核心原型开发

├─ 8 月：完成基础框架搭建

├─ 9 月：实现 WebContainers 集成

└─ 10 月：完成 AntD 按钮组件生成

2025-Q4：可视化功能增强

├─ 11 月：路由动态生成系统

├─ 12 月：提示词工程框架

└─ 1 月：实时协作预览功能

2026-Q1：生态扩展

└─ 新增支持 Material UI 组件库
