export interface UILibrary {
  id: string
  name: string
  description: string
  packageName: string
  installCommand: string
}

export interface CreateProjectData {
  name: string
  description: string
  uiLibrary: string
  features?: string[]
  localPath?: string
  aiModel?: string // AI 模型选择
}

export interface Project {
  id: string
  name: string
  description: string
  uiLibrary: string
  template: string
  path: string
  createdAt: string
  lastModified: string
  status: 'active' | 'missing' | 'invalid'
}

export interface ProjectIndex {
  version: string
  baseDirectory: string
  lastScan: string
  projects: {
    id: string
    name: string
    path: string
    createdAt: string
    lastModified: string
  }[]
}

export interface ProjectMetadata {
  id: string
  name: string
  description: string
  template: string
  uiLibrary: string
  createdAt: string
  lastModified: string
}

export interface PromptFileData {
  metadata: ProjectMetadata
  content: string
}
