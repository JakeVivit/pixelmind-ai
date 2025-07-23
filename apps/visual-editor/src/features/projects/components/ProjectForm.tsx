import React, { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { ProjectValidator } from '../utils/validation'
import type { CreateProjectData } from '../types/project'

interface ProjectFormProps {
  projectData: CreateProjectData
  onDataChange: (data: CreateProjectData) => void
  errors: Record<string, string>
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  projectData,
  onDataChange,
  errors
}) => {
  const [nameValidation, setNameValidation] = useState({ isValid: true, error: '' })
  const [descriptionValidation, setDescriptionValidation] = useState({ isValid: true, error: '' })

  // 实时验证项目名称
  useEffect(() => {
    if (projectData.name) {
      const validation = ProjectValidator.validateProjectName(projectData.name)
      setNameValidation(validation)
    } else {
      setNameValidation({ isValid: true, error: '' })
    }
  }, [projectData.name])

  // 实时验证项目描述
  useEffect(() => {
    if (projectData.description) {
      const validation = ProjectValidator.validateDescription(projectData.description)
      setDescriptionValidation(validation)
    } else {
      setDescriptionValidation({ isValid: true, error: '' })
    }
  }, [projectData.description])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onDataChange({
      ...projectData,
      name: value
    })
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    onDataChange({
      ...projectData,
      description: value
    })
  }

  const getInputClassName = (hasError: boolean, isValid: boolean) => {
    return cn(
      'w-full px-4 py-3 border rounded-lg transition-colors duration-200',
      'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
      'placeholder-gray-500 dark:placeholder-gray-400',
      'focus:ring-2 focus:ring-offset-2 focus:outline-none',
      hasError || !isValid
        ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
    )
  }

  return (
    <div className="space-y-6">
      {/* 项目名称 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          项目名称 *
        </label>
        <input
          type="text"
          value={projectData.name}
          onChange={handleNameChange}
          placeholder="例如: my-awesome-project"
          className={getInputClassName(!!errors.name, nameValidation.isValid)}
          maxLength={50}
        />
        
        <div className="mt-2 space-y-1">
          {(errors.name || !nameValidation.isValid) && (
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.name || nameValidation.error}
              </p>
            </div>
          )}
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>• 只能包含英文字母、数字、下划线和连字符</p>
            <p>• 长度: {projectData.name.length}/50</p>
          </div>
        </div>
      </div>

      {/* 项目描述 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          项目描述 *
        </label>
        <textarea
          value={projectData.description}
          onChange={handleDescriptionChange}
          placeholder="简要描述你的项目功能和用途..."
          rows={4}
          className={cn(
            getInputClassName(!!errors.description, descriptionValidation.isValid),
            'resize-none'
          )}
          maxLength={200}
        />
        
        <div className="mt-2 space-y-1">
          {(errors.description || !descriptionValidation.isValid) && (
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.description || descriptionValidation.error}
              </p>
            </div>
          )}
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>长度: {projectData.description.length}/200</p>
          </div>
        </div>
      </div>

      {/* 项目预览 */}
      {projectData.name && projectData.description && nameValidation.isValid && descriptionValidation.isValid && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
            ✅ 项目信息预览
          </h4>
          <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
            <div>
              <span className="font-medium">项目名称:</span> {projectData.name}
            </div>
            <div>
              <span className="font-medium">项目描述:</span> {projectData.description}
            </div>
            <div>
              <span className="font-medium">技术栈:</span> React + Vite + TypeScript + Tailwind CSS
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
