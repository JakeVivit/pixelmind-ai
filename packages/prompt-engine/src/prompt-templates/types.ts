// 提示词工程核心类型定义

export interface PromptTemplate {
  id: string
  name: string
  description: string
  version: string
  category: PromptCategory
  tags: string[]
  variables: PromptVariable[]
  content: string
  metadata: PromptMetadata
}

export interface PromptVariable {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  required: boolean
  description: string
  defaultValue?: any
  options?: any[] // 用于枚举类型
}

export interface PromptMetadata {
  author: string
  createdAt: string
  updatedAt: string
  license: string
  compatibility: string[]
  dependencies: string[]
}

export type PromptCategory = 
  | 'project-creation'
  | 'component-generation'
  | 'page-layout'
  | 'animation'
  | 'styling'
  | 'testing'
  | 'documentation'

export interface PromptContext {
  projectType: string
  uiLibrary: string
  framework: string
  features: string[]
  customVariables: Record<string, any>
}

export interface CompiledPrompt {
  id: string
  content: string
  variables: Record<string, any>
  metadata: {
    templateId: string
    compiledAt: string
    context: PromptContext
  }
}

export interface PromptEngineConfig {
  baseUrl?: string
  apiKey?: string
  version: string
  cacheEnabled: boolean
  fallbackMode: boolean
}
