// Common types used across PixelMind AI

// Framework types
export type Framework = 'react' | 'vue'
export type UILibrary = 'antd' | 'material-ui'
export type BuildTool = 'vite' | 'webpack'

// Project configuration
export interface ProjectConfig {
  name: string
  framework: Framework
  uiLibrary: UILibrary
  buildTool: BuildTool
  typescript: boolean
  eslint: boolean
  prettier: boolean
}

// Component types
export interface ComponentInfo {
  id: string
  name: string
  type: 'functional' | 'class'
  props: ComponentProp[]
  children?: ComponentInfo[]
  code: string
  filePath: string
}

export interface ComponentProp {
  name: string
  type: string
  required: boolean
  defaultValue?: any
  description?: string
}

// File system types
export interface FileNode {
  name: string
  type: 'file' | 'directory'
  path: string
  content?: string
  children?: FileNode[]
  size?: number
  lastModified?: Date
}

// AI generation types
export interface AIGenerationRequest {
  prompt: string
  context: {
    framework: Framework
    uiLibrary: UILibrary
    existingComponents?: ComponentInfo[]
    targetElement?: string
  }
  options: {
    includeTypes: boolean
    includeStyles: boolean
    includeTests: boolean
  }
}

export interface AIGenerationResponse {
  success: boolean
  code?: string
  error?: string
  suggestions?: string[]
  metadata?: {
    componentName: string
    dependencies: string[]
    estimatedComplexity: 'low' | 'medium' | 'high'
  }
}

// WebContainer types
export interface WebContainerFile {
  file: {
    contents: string
  }
}

export interface WebContainerDirectory {
  directory: Record<string, WebContainerFile | WebContainerDirectory>
}

export type WebContainerFileTree = Record<string, WebContainerFile | WebContainerDirectory>

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: Date
  stack?: string
}

// Event types
export interface AppEvent {
  type: string
  payload: any
  timestamp: Date
  source: 'user' | 'ai' | 'system'
}

// Store types
export interface StoreState {
  // Add common store state types here
  [key: string]: any
}
