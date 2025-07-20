// Core prompt engineering utilities

import type { Framework, UILibrary, AIGenerationRequest, AIGenerationResponse } from '@pixelmind/shared'

export interface PromptTemplate {
  id: string
  name: string
  description: string
  framework: Framework
  uiLibrary: UILibrary
  template: string
  variables: string[]
  examples?: PromptExample[]
}

export interface PromptExample {
  input: string
  output: string
  description?: string
}

export interface PromptContext {
  framework: Framework
  uiLibrary: UILibrary
  componentType?: string
  existingCode?: string
  userIntent: string
  additionalContext?: Record<string, any>
}

/**
 * Base prompt engine class
 */
export abstract class PromptEngine {
  protected templates: Map<string, PromptTemplate> = new Map()
  
  /**
   * Register a prompt template
   */
  registerTemplate(template: PromptTemplate): void {
    this.templates.set(template.id, template)
  }
  
  /**
   * Get a prompt template by ID
   */
  getTemplate(id: string): PromptTemplate | undefined {
    return this.templates.get(id)
  }
  
  /**
   * List all available templates
   */
  listTemplates(): PromptTemplate[] {
    return Array.from(this.templates.values())
  }
  
  /**
   * Generate a prompt from template and context
   */
  generatePrompt(templateId: string, context: PromptContext): string {
    const template = this.getTemplate(templateId)
    if (!template) {
      throw new Error(`Template not found: ${templateId}`)
    }
    
    return this.interpolateTemplate(template.template, context)
  }
  
  /**
   * Abstract method to process AI generation request
   */
  abstract processRequest(request: AIGenerationRequest): Promise<AIGenerationResponse>
  
  /**
   * Interpolate template variables with context values
   */
  protected interpolateTemplate(template: string, context: PromptContext): string {
    let result = template
    
    // Replace framework placeholder
    result = result.replace(/\{\{framework\}\}/g, context.framework)
    
    // Replace UI library placeholder
    result = result.replace(/\{\{uiLibrary\}\}/g, context.uiLibrary)
    
    // Replace component type placeholder
    result = result.replace(/\{\{componentType\}\}/g, context.componentType || 'component')
    
    // Replace user intent placeholder
    result = result.replace(/\{\{userIntent\}\}/g, context.userIntent)
    
    // Replace existing code placeholder
    result = result.replace(/\{\{existingCode\}\}/g, context.existingCode || '')
    
    // Replace additional context placeholders
    if (context.additionalContext) {
      for (const [key, value] of Object.entries(context.additionalContext)) {
        const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
        result = result.replace(placeholder, String(value))
      }
    }
    
    return result
  }
  
  /**
   * Validate prompt context
   */
  protected validateContext(context: PromptContext): void {
    if (!context.framework) {
      throw new Error('Framework is required in prompt context')
    }
    
    if (!context.uiLibrary) {
      throw new Error('UI library is required in prompt context')
    }
    
    if (!context.userIntent) {
      throw new Error('User intent is required in prompt context')
    }
  }
}

/**
 * Utility functions for prompt engineering
 */
export class PromptUtils {
  /**
   * Extract component name from user intent
   */
  static extractComponentName(userIntent: string): string | null {
    // Look for patterns like "create a Button component" or "generate LoginForm"
    const patterns = [
      /create\s+(?:a\s+)?(\w+)\s+component/i,
      /generate\s+(?:a\s+)?(\w+)/i,
      /build\s+(?:a\s+)?(\w+)/i,
      /make\s+(?:a\s+)?(\w+)/i,
    ]
    
    for (const pattern of patterns) {
      const match = userIntent.match(pattern)
      if (match && match[1]) {
        return this.toPascalCase(match[1])
      }
    }
    
    return null
  }
  
  /**
   * Convert string to PascalCase
   */
  static toPascalCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase()
      })
      .replace(/\s+/g, '')
      .replace(/^./, str => str.toUpperCase())
  }
  
  /**
   * Estimate complexity of a generation request
   */
  static estimateComplexity(userIntent: string): 'low' | 'medium' | 'high' {
    const lowComplexityKeywords = ['button', 'text', 'label', 'icon', 'link']
    const highComplexityKeywords = ['form', 'table', 'chart', 'dashboard', 'layout', 'navigation']
    
    const intent = userIntent.toLowerCase()
    
    if (highComplexityKeywords.some(keyword => intent.includes(keyword))) {
      return 'high'
    }
    
    if (lowComplexityKeywords.some(keyword => intent.includes(keyword))) {
      return 'low'
    }
    
    return 'medium'
  }
}
