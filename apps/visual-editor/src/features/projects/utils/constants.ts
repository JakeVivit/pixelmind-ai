import type { UILibrary } from '../types/project'

export const UI_LIBRARIES: UILibrary[] = [
  {
    id: 'antd',
    name: 'Ant Design',
    description: '企业级 UI 设计语言和 React 组件库',
    packageName: 'antd',
    installCommand: 'npm install antd @ant-design/icons'
  },
  {
    id: 'mui',
    name: 'Material-UI',
    description: 'React 组件实现 Google Material Design',
    packageName: '@mui/material',
    installCommand: 'npm install @mui/material @emotion/react @emotion/styled'
  },
  {
    id: 'chakra',
    name: 'Chakra UI',
    description: '简单、模块化、易用的组件库',
    packageName: '@chakra-ui/react',
    installCommand: 'npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion'
  },
  {
    id: 'mantine',
    name: 'Mantine',
    description: '功能丰富的现代 React 组件和钩子库',
    packageName: '@mantine/core',
    installCommand: 'npm install @mantine/core @mantine/hooks @emotion/react'
  },
  {
    id: 'nextui',
    name: 'NextUI',
    description: '美观、快速、现代的 React UI 库',
    packageName: '@nextui-org/react',
    installCommand: 'npm install @nextui-org/react framer-motion'
  },
  {
    id: 'arco',
    name: 'Arco Design',
    description: '字节跳动企业级设计系统',
    packageName: '@arco-design/web-react',
    installCommand: 'npm install @arco-design/web-react'
  }
]

export const PROJECT_CONFIG = {
  PIXELMIND_DIR: '.pixelmind',
  PROJECTS_INDEX_FILE: 'projects.json',
  PROMPT_FILE_NAME: 'pixelmind-prompt.md',
  INDEX_VERSION: '1.0.0'
} as const

export const VALIDATION_RULES = {
  PROJECT_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
    ERROR_MESSAGE: '项目名称只能包含英文字母、数字、下划线和连字符'
  },
  DESCRIPTION: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 200,
    ERROR_MESSAGE: '项目描述长度应在 5-200 个字符之间'
  }
} as const

export const DEFAULT_TEMPLATE = 'react-vite-typescript'
