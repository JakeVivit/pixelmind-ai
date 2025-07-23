import { VALIDATION_RULES } from './constants'

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export class ProjectValidator {
  /**
   * 验证项目名称
   */
  static validateProjectName(name: string): ValidationResult {
    if (!name || name.trim().length === 0) {
      return { isValid: false, error: '项目名称不能为空' }
    }

    const trimmedName = name.trim()

    if (trimmedName.length < VALIDATION_RULES.PROJECT_NAME.MIN_LENGTH) {
      return { 
        isValid: false, 
        error: `项目名称至少需要 ${VALIDATION_RULES.PROJECT_NAME.MIN_LENGTH} 个字符` 
      }
    }

    if (trimmedName.length > VALIDATION_RULES.PROJECT_NAME.MAX_LENGTH) {
      return { 
        isValid: false, 
        error: `项目名称不能超过 ${VALIDATION_RULES.PROJECT_NAME.MAX_LENGTH} 个字符` 
      }
    }

    if (!VALIDATION_RULES.PROJECT_NAME.PATTERN.test(trimmedName)) {
      return { 
        isValid: false, 
        error: VALIDATION_RULES.PROJECT_NAME.ERROR_MESSAGE 
      }
    }

    return { isValid: true }
  }

  /**
   * 验证项目描述
   */
  static validateDescription(description: string): ValidationResult {
    if (!description || description.trim().length === 0) {
      return { isValid: false, error: '项目描述不能为空' }
    }

    const trimmedDescription = description.trim()

    if (trimmedDescription.length < VALIDATION_RULES.DESCRIPTION.MIN_LENGTH) {
      return { 
        isValid: false, 
        error: `项目描述至少需要 ${VALIDATION_RULES.DESCRIPTION.MIN_LENGTH} 个字符` 
      }
    }

    if (trimmedDescription.length > VALIDATION_RULES.DESCRIPTION.MAX_LENGTH) {
      return { 
        isValid: false, 
        error: `项目描述不能超过 ${VALIDATION_RULES.DESCRIPTION.MAX_LENGTH} 个字符` 
      }
    }

    return { isValid: true }
  }

  /**
   * 验证 UI 库选择
   */
  static validateUILibrary(uiLibrary: string): ValidationResult {
    if (!uiLibrary || uiLibrary.trim().length === 0) {
      return { isValid: false, error: '请选择一个 UI 组件库' }
    }

    return { isValid: true }
  }

  /**
   * 验证本地路径
   */
  static validateLocalPath(path: string): ValidationResult {
    if (!path || path.trim().length === 0) {
      return { isValid: false, error: '请选择项目存储位置' }
    }

    return { isValid: true }
  }

  /**
   * 验证完整的项目数据
   */
  static validateCreateProjectData(data: {
    name: string
    description: string
    uiLibrary: string
    localPath?: string
  }): ValidationResult {
    const nameValidation = this.validateProjectName(data.name)
    if (!nameValidation.isValid) return nameValidation

    const descriptionValidation = this.validateDescription(data.description)
    if (!descriptionValidation.isValid) return descriptionValidation

    const uiLibraryValidation = this.validateUILibrary(data.uiLibrary)
    if (!uiLibraryValidation.isValid) return uiLibraryValidation

    if (data.localPath !== undefined) {
      const pathValidation = this.validateLocalPath(data.localPath)
      if (!pathValidation.isValid) return pathValidation
    }

    return { isValid: true }
  }
}

/**
 * 生成唯一 ID
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
