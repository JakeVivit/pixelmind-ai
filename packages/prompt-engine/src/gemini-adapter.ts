// Gemini AI adapter for PixelMind AI

import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AIGenerationRequest, AIGenerationResponse } from '@pixelmind/shared'
import { PromptEngine, type PromptContext } from './core'

export class GeminiAdapter extends PromptEngine {
  private genAI: GoogleGenerativeAI | null = null
  private model: any = null

  constructor(apiKey?: string) {
    super()
    
    if (apiKey) {
      this.initialize(apiKey)
    }
  }

  /**
   * Initialize Gemini AI with API key
   */
  initialize(apiKey: string): void {
    try {
      this.genAI = new GoogleGenerativeAI(apiKey)
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' })
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error)
      throw new Error('Failed to initialize Gemini AI')
    }
  }

  /**
   * Check if Gemini is properly initialized
   */
  isInitialized(): boolean {
    return this.genAI !== null && this.model !== null
  }

  /**
   * Process AI generation request using Gemini
   */
  async processRequest(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    if (!this.isInitialized()) {
      return {
        success: false,
        error: 'Gemini AI is not initialized. Please provide a valid API key.',
      }
    }

    try {
      // Validate the request
      this.validateRequest(request)

      // Create prompt context
      const context: PromptContext = {
        framework: request.context.framework,
        uiLibrary: request.context.uiLibrary,
        userIntent: request.prompt,
        existingCode: request.context.existingComponents?.map(c => c.code).join('\n\n'),
        additionalContext: {
          includeTypes: request.options.includeTypes,
          includeStyles: request.options.includeStyles,
          includeTests: request.options.includeTests,
          targetElement: request.context.targetElement,
        },
      }

      // Generate the prompt
      const templateId = this.selectTemplate(request)
      const prompt = this.generatePrompt(templateId, context)

      // Call Gemini API
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const generatedCode = response.text()

      // Parse and validate the response
      const parsedResponse = this.parseGeminiResponse(generatedCode, request)

      return {
        success: true,
        code: parsedResponse.code,
        suggestions: parsedResponse.suggestions,
        metadata: parsedResponse.metadata,
      }
    } catch (error) {
      console.error('Gemini generation error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Select appropriate template based on request
   */
  private selectTemplate(request: AIGenerationRequest): string {
    const { framework, uiLibrary } = request.context

    // Default template selection logic
    if (framework === 'react' && uiLibrary === 'antd') {
      return 'react-antd-component'
    } else if (framework === 'react' && uiLibrary === 'material-ui') {
      return 'react-mui-component'
    } else if (framework === 'vue') {
      return 'vue-component'
    }

    // Fallback to generic template
    return 'generic-component'
  }

  /**
   * Parse Gemini response and extract code
   */
  private parseGeminiResponse(
    response: string,
    request: AIGenerationRequest
  ): {
    code: string
    suggestions: string[]
    metadata: {
      componentName: string
      dependencies: string[]
      estimatedComplexity: 'low' | 'medium' | 'high'
    }
  } {
    // Extract code blocks from response
    const codeBlockRegex = /```(?:typescript|tsx|javascript|jsx)?\n([\s\S]*?)\n```/g
    const codeBlocks = []
    let match

    while ((match = codeBlockRegex.exec(response)) !== null) {
      codeBlocks.push(match[1])
    }

    // Use the first code block as the main code
    const code = codeBlocks[0] || response

    // Extract suggestions (lines starting with "// Suggestion:" or "// Note:")
    const suggestionRegex = /\/\/\s*(Suggestion|Note|Tip):\s*(.+)/g
    const suggestions: string[] = []
    
    while ((match = suggestionRegex.exec(response)) !== null) {
      suggestions.push(match[2])
    }

    // Extract component name
    const componentNameMatch = code.match(/(?:function|const)\s+(\w+)|export\s+default\s+(\w+)/)
    const componentName = componentNameMatch?.[1] || componentNameMatch?.[2] || 'Component'

    // Extract dependencies (import statements)
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g
    const dependencies: string[] = []
    
    while ((match = importRegex.exec(code)) !== null) {
      dependencies.push(match[1])
    }

    // Estimate complexity based on code length and patterns
    const estimatedComplexity = this.estimateComplexity(code, request.prompt)

    return {
      code,
      suggestions,
      metadata: {
        componentName,
        dependencies: [...new Set(dependencies)],
        estimatedComplexity,
      },
    }
  }

  /**
   * Estimate complexity of generated code
   */
  private estimateComplexity(code: string, prompt: string): 'low' | 'medium' | 'high' {
    const codeLength = code.length
    const lineCount = code.split('\n').length

    // Check for complex patterns
    const hasState = /useState|useReducer|useContext/.test(code)
    const hasEffects = /useEffect|useCallback|useMemo/.test(code)
    const hasComplexLogic = /if|else|switch|for|while|map|filter|reduce/.test(code)
    const hasAsyncOperations = /async|await|Promise|fetch/.test(code)

    // High complexity indicators
    if (
      codeLength > 1000 ||
      lineCount > 50 ||
      hasAsyncOperations ||
      (hasState && hasEffects && hasComplexLogic)
    ) {
      return 'high'
    }

    // Low complexity indicators
    if (codeLength < 300 || lineCount < 20 || (!hasState && !hasEffects)) {
      return 'low'
    }

    return 'medium'
  }

  /**
   * Validate generation request
   */
  private validateRequest(request: AIGenerationRequest): void {
    if (!request.prompt || request.prompt.trim().length === 0) {
      throw new Error('Prompt is required')
    }

    if (!request.context.framework) {
      throw new Error('Framework is required')
    }

    if (!request.context.uiLibrary) {
      throw new Error('UI library is required')
    }
  }
}
