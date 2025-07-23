import type { PromptTemplate } from './types.js'

/**
 * 模板加载器
 * 负责从不同来源加载提示词模板
 */
export class TemplateLoader {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl: string = '', apiKey?: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  /**
   * 从本地文件加载模板
   */
  async loadLocalTemplate(templatePath: string): Promise<PromptTemplate> {
    try {
      // 在实际应用中，这里会从文件系统或打包的资源中加载
      const response = await fetch(templatePath)
      if (!response.ok) {
        throw new Error(`Failed to load template: ${response.statusText}`)
      }

      const template = (await response.json()) as PromptTemplate
      this.validateTemplate(template)
      return template
    } catch (error) {
      throw new Error(`Failed to load local template: ${error}`)
    }
  }

  /**
   * 从远程 API 加载模板
   */
  async loadRemoteTemplate(templateId: string): Promise<PromptTemplate> {
    if (!this.baseUrl) {
      throw new Error('Base URL not configured for remote loading')
    }

    try {
      const url = `${this.baseUrl}/templates/${templateId}`
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`
      }

      const response = await fetch(url, { headers })

      if (!response.ok) {
        throw new Error(`Failed to load remote template: ${response.statusText}`)
      }

      const template = (await response.json()) as PromptTemplate
      this.validateTemplate(template)
      return template
    } catch (error) {
      throw new Error(`Failed to load remote template: ${error}`)
    }
  }

  /**
   * 批量加载本地模板
   */
  async loadLocalTemplates(templatePaths: string[]): Promise<PromptTemplate[]> {
    const promises = templatePaths.map(path => this.loadLocalTemplate(path))
    const results = await Promise.allSettled(promises)

    const templates: PromptTemplate[] = []
    const errors: string[] = []

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        templates.push(result.value)
      } else {
        errors.push(`${templatePaths[index]}: ${result.reason}`)
      }
    })

    if (errors.length > 0) {
      console.warn('Some templates failed to load:', errors)
    }

    return templates
  }

  /**
   * 从远程 API 获取模板列表
   */
  async getRemoteTemplateList(): Promise<{ id: string; name: string; version: string }[]> {
    if (!this.baseUrl) {
      throw new Error('Base URL not configured for remote loading')
    }

    try {
      const url = `${this.baseUrl}/templates`
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`
      }

      const response = await fetch(url, { headers })

      if (!response.ok) {
        throw new Error(`Failed to get template list: ${response.statusText}`)
      }

      return (await response.json()) as { id: string; name: string; version: string }[]
    } catch (error) {
      throw new Error(`Failed to get remote template list: ${error}`)
    }
  }

  /**
   * 验证模板格式
   */
  private validateTemplate(template: any): void {
    const requiredFields = ['id', 'name', 'version', 'category', 'content', 'variables', 'metadata']

    for (const field of requiredFields) {
      if (!(field in template)) {
        throw new Error(`Template missing required field: ${field}`)
      }
    }

    if (!Array.isArray(template.variables)) {
      throw new Error('Template variables must be an array')
    }

    if (typeof template.content !== 'string') {
      throw new Error('Template content must be a string')
    }
  }

  /**
   * 设置 API 密钥
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey
  }

  /**
   * 设置基础 URL
   */
  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl
  }
}
