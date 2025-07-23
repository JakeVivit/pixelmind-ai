// AI prompt engineering utilities for PixelMind AI

// Export core prompt engine (原有的)
export {
  PromptTemplate,
  PromptExample,
  PromptContext,
  PromptEngine,
  PromptUtils,
} from './core/index.js'

// Export Gemini adapter
export { GeminiAdapter } from './gemini-adapter.js'

// Export prompt templates
export * from './templates/index.js'

// Export Ant Design specific prompts
export * from './antd/index.js'

// 新增提示词工程系统导出 (重命名以避免冲突)
export { PromptEngine as ProjectPromptEngine } from './prompt-templates/PromptEngine.js'
export { TemplateLoader as ProjectTemplateLoader } from './prompt-templates/TemplateLoader.js'
export { PromptEngineManager } from './prompt-templates/PromptEngineManager.js'

export type {
  PromptTemplate as ProjectPromptTemplate,
  PromptVariable as ProjectPromptVariable,
  PromptMetadata as ProjectPromptMetadata,
  PromptCategory as ProjectPromptCategory,
  PromptContext as ProjectPromptContext,
  CompiledPrompt as ProjectCompiledPrompt,
  PromptEngineConfig as ProjectPromptEngineConfig,
} from './prompt-templates/types'

// 便捷的工厂函数
export const createProjectPromptEngine = (
  config?: Partial<import('./prompt-templates/types').PromptEngineConfig>
) => {
  const { PromptEngineManager } = require('./prompt-templates/PromptEngineManager')
  const manager = PromptEngineManager.getInstance()
  return manager.initialize(config).then(() => manager)
}

// 快速创建项目提示词的便捷函数
export const generateProjectPrompt = async (
  projectName: string,
  description: string,
  uiLibrary: string,
  features: string[] = [],
  animations: boolean = false
) => {
  const { PromptEngineManager } = require('./prompt-templates/PromptEngineManager')
  const manager = PromptEngineManager.getInstance()
  await manager.initialize()
  return manager.compileProjectPrompt(projectName, description, uiLibrary, features, animations)
}
