import type {
  PromptTemplate,
  PromptContext,
  CompiledPrompt,
  PromptEngineConfig,
  PromptVariable,
} from './types.js'

/**
 * 提示词引擎核心类
 * 负责模板加载、编译和管理
 */
export class PromptEngine {
  private templates: Map<string, PromptTemplate> = new Map()
  private config: PromptEngineConfig
  private cache: Map<string, CompiledPrompt> = new Map()

  constructor(config: Partial<PromptEngineConfig> = {}) {
    this.config = {
      version: '1.0.0',
      cacheEnabled: true,
      fallbackMode: true,
      ...config,
    }
  }

  /**
   * 注册提示词模板
   */
  registerTemplate(template: PromptTemplate): void {
    this.templates.set(template.id, template)
  }

  /**
   * 批量注册模板
   */
  registerTemplates(templates: PromptTemplate[]): void {
    templates.forEach(template => this.registerTemplate(template))
  }

  /**
   * 获取模板
   */
  getTemplate(id: string): PromptTemplate | null {
    return this.templates.get(id) || null
  }

  /**
   * 获取所有模板
   */
  getAllTemplates(): PromptTemplate[] {
    return Array.from(this.templates.values())
  }

  /**
   * 按分类获取模板
   */
  getTemplatesByCategory(category: string): PromptTemplate[] {
    return this.getAllTemplates().filter(template => template.category === category)
  }

  /**
   * 编译提示词模板
   */
  async compilePrompt(
    templateId: string,
    context: PromptContext,
    variables: Record<string, any> = {}
  ): Promise<CompiledPrompt> {
    const cacheKey = this.generateCacheKey(templateId, context, variables)

    // 检查缓存
    if (this.config.cacheEnabled && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    const template = this.getTemplate(templateId)
    if (!template) {
      throw new Error(`Template not found: ${templateId}`)
    }

    // 验证必需变量
    this.validateVariables(template, variables)

    // 编译模板
    const compiledContent = this.compileTemplate(template.content, {
      ...context,
      ...variables,
      ...this.getUILibraryInfo(context.uiLibrary),
    })

    const compiledPrompt: CompiledPrompt = {
      id: this.generatePromptId(),
      content: compiledContent,
      variables: { ...context, ...variables },
      metadata: {
        templateId,
        compiledAt: new Date().toISOString(),
        context,
      },
    }

    // 缓存结果
    if (this.config.cacheEnabled) {
      this.cache.set(cacheKey, compiledPrompt)
    }

    return compiledPrompt
  }

  /**
   * 验证模板变量
   */
  private validateVariables(template: PromptTemplate, variables: Record<string, any>): void {
    const requiredVars = template.variables.filter(v => v.required)

    for (const variable of requiredVars) {
      if (!(variable.name in variables) || variables[variable.name] == null) {
        throw new Error(`Required variable missing: ${variable.name}`)
      }
    }
  }

  /**
   * 编译模板内容（简单的模板引擎）
   */
  private compileTemplate(content: string, data: Record<string, any>): string {
    let compiled = content

    // 处理简单变量替换 {{variable}}
    compiled = compiled.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? String(data[key]) : match
    })

    // 处理条件语句 {{#if condition}}...{{/if}}
    compiled = compiled.replace(
      /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (match, condition, content) => {
        return data[condition] ? content : ''
      }
    )

    // 处理数组包含检查 {{#if array.includes 'value'}}
    compiled = compiled.replace(
      /\{\{#if\s+(\w+)\.includes\s+'([^']+)'\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (match, arrayName, value, content) => {
        const array = data[arrayName]
        return Array.isArray(array) && array.includes(value) ? content : ''
      }
    )

    return compiled
  }

  /**
   * 获取 UI 库信息
   */
  private getUILibraryInfo(uiLibrary: string): Record<string, string> {
    const uiLibraries: Record<string, { name: string; package: string }> = {
      antd: { name: 'Ant Design', package: 'antd' },
      mui: { name: 'Material-UI', package: '@mui/material' },
      chakra: { name: 'Chakra UI', package: '@chakra-ui/react' },
      mantine: { name: 'Mantine', package: '@mantine/core' },
      nextui: { name: 'NextUI', package: '@nextui-org/react' },
      arco: { name: 'Arco Design', package: '@arco-design/web-react' },
    }

    const info = uiLibraries[uiLibrary] || { name: uiLibrary, package: uiLibrary }

    return {
      uiLibraryName: info.name,
      uiLibraryPackage: info.package,
    }
  }

  /**
   * 生成缓存键
   */
  private generateCacheKey(
    templateId: string,
    context: PromptContext,
    variables: Record<string, any>
  ): string {
    const data = { templateId, context, variables }
    const jsonString = JSON.stringify(data)
    // 使用简单的哈希函数替代 btoa，避免特殊字符问题
    let hash = 0
    for (let i = 0; i < jsonString.length; i++) {
      const char = jsonString.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // 转换为32位整数
    }
    return `cache_${Math.abs(hash).toString(36)}`
  }

  /**
   * 生成提示词 ID
   */
  private generatePromptId(): string {
    return `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * 获取引擎统计信息
   */
  getStats(): {
    templatesCount: number
    cacheSize: number
    categories: string[]
  } {
    const categories = [...new Set(this.getAllTemplates().map(t => t.category))]

    return {
      templatesCount: this.templates.size,
      cacheSize: this.cache.size,
      categories,
    }
  }
}
