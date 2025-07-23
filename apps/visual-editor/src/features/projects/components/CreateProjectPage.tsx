import React, { useState, useEffect } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { ProjectForm } from './ProjectForm'
import { UILibrarySelector } from './UILibrarySelector'
import { ProjectLocationSelector } from './ProjectLocationSelector'
import { AIModelSelector } from './AIModelSelector'
import { ProjectManager } from '../services/ProjectManager'
import { ProjectValidator } from '../utils/validation'
import type { CreateProjectData, Project } from '../types/project'

interface CreateProjectPageProps {
  onBack: () => void
  onCreate: (project: Project) => void
}

export const CreateProjectPage: React.FC<CreateProjectPageProps> = ({ onBack, onCreate }) => {
  const [projectData, setProjectData] = useState<CreateProjectData>({
    name: '',
    description: '',
    uiLibrary: '',
    aiModel: 'gpt-4o-mini', // 默认使用性价比最高的模型
  })
  const [selectedLocation, setSelectedLocation] = useState<FileSystemDirectoryHandle | null>(null)
  const [selectedLocationPath, setSelectedLocationPath] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isCreating, setIsCreating] = useState(false)

  const [creationProgress, setCreationProgress] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState<string>('')

  // 检查是否已有保存的目录路径
  useEffect(() => {
    const projectManager = ProjectManager.getInstance()
    const savedPath = projectManager.getBaseDirectoryPath()
    const savedHandle = projectManager.getBaseDirectoryHandle()

    if (savedPath) {
      setSelectedLocationPath(savedPath)
      if (savedHandle) {
        setSelectedLocation(savedHandle)
      }
      console.log('已恢复保存的目录路径:', savedPath)
    }
  }, [])

  const handleLocationSelected = (dirHandle: FileSystemDirectoryHandle, path: string) => {
    setSelectedLocation(dirHandle)
    setSelectedLocationPath(path)
    setErrors(prev => ({ ...prev, location: '' }))
  }

  // 添加进度日志
  const addProgressLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const logMessage = `[${timestamp}] ${message}`
    setCreationProgress(prev => [...prev, logMessage])
    setCurrentStep(message)
    console.log(logMessage)
  }

  // 清除进度日志
  const clearProgress = () => {
    setCreationProgress([])
    setCurrentStep('')
  }

  const handleLibrarySelect = (libraryId: string) => {
    setProjectData(prev => ({ ...prev, uiLibrary: libraryId }))
    setErrors(prev => ({ ...prev, uiLibrary: '' }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // 验证项目数据
    const dataValidation = ProjectValidator.validateCreateProjectData(projectData)
    if (!dataValidation.isValid) {
      if (projectData.name === '') newErrors.name = '项目名称不能为空'
      else if (!ProjectValidator.validateProjectName(projectData.name).isValid) {
        newErrors.name = ProjectValidator.validateProjectName(projectData.name).error!
      }

      if (projectData.description === '') newErrors.description = '项目描述不能为空'
      else if (!ProjectValidator.validateDescription(projectData.description).isValid) {
        newErrors.description = ProjectValidator.validateDescription(projectData.description).error!
      }

      if (projectData.uiLibrary === '') newErrors.uiLibrary = '请选择一个 UI 组件库'
    }

    // 验证存储位置
    if (!selectedLocation) {
      newErrors.location = '请选择项目存储位置'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateProject = async () => {
    if (!validateForm()) return

    // 不再需要检查 Gemini API 配置，直接使用 ChatAI
    setIsCreating(true)
    clearProgress()

    try {
      addProgressLog('开始创建项目...')
      const projectManager = ProjectManager.getInstance()

      // 检查是否有基础目录路径
      addProgressLog('检查项目配置...')
      console.log('创建项目时的状态检查:')
      console.log('- selectedLocationPath:', selectedLocationPath)
      console.log('- selectedLocation:', selectedLocation)
      console.log('- projectData:', projectData)

      if (!selectedLocationPath) {
        console.error('selectedLocationPath 为空，无法创建项目')
        addProgressLog('❌ 错误: 未选择项目存储目录')
        alert('请先选择项目存储目录')
        setIsCreating(false)
        return
      }

      // 如果没有文件系统访问权限，尝试重新获取
      if (!projectManager.hasFileSystemAccess()) {
        addProgressLog('检查文件系统访问权限...')
        try {
          const result = await projectManager.setBaseDirectory(true) // 强制重新选择
          if (!result.success) {
            addProgressLog('❌ 错误: 需要重新授权访问目录权限')
            alert('需要重新授权访问目录权限，请重新选择目录')
            setIsCreating(false)
            return
          }
          addProgressLog('✅ 文件系统访问权限已获取')
        } catch (error) {
          console.error('重新获取目录权限失败:', error)
          addProgressLog('❌ 错误: 无法访问目录')
          alert('无法访问目录，请重新选择项目存储位置')
          setIsCreating(false)
          return
        }
      }

      addProgressLog('🚀 开始使用 AI 生成项目代码...')
      const project = await projectManager.createProject(projectData)

      addProgressLog('✅ 项目创建成功!')
      console.log('项目创建成功:', project)
      alert(
        `项目 "${project.name}" 创建成功！\n\n项目已保存到本地，并通过 AI 生成了完整的项目结构。`
      )

      // 调用回调函数，通常会跳转到项目列表页面
      onCreate(project)
    } catch (error) {
      console.error('创建项目失败:', error)
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      addProgressLog(`❌ 创建失败: ${errorMessage}`)

      // 检查是否是余额不足错误
      if (errorMessage.includes('insufficient_user_quota') || errorMessage.includes('余额不足')) {
        alert(`创建项目失败: 试用版已经结束，请联系管理员充值\n\n详细错误: ${errorMessage}`)
      } else {
        alert(`创建项目失败: ${errorMessage}`)
      }
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-auto">
      {/* 头部 */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            disabled={isCreating}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">创建新项目</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">配置你的 React + Vite 项目</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        {/* 项目基本信息 */}
        <div>
          <h2 className="text-lg font-semibold mb-6">项目信息</h2>
          <ProjectForm projectData={projectData} onDataChange={setProjectData} errors={errors} />
        </div>

        {/* UI 组件库选择 */}
        <div>
          <UILibrarySelector
            selectedLibrary={projectData.uiLibrary}
            onLibrarySelect={handleLibrarySelect}
            error={errors.uiLibrary}
          />
        </div>

        {/* AI 模型选择 */}
        <div>
          <AIModelSelector
            selectedModel={projectData.aiModel || 'gpt-4o-mini'}
            onModelChange={modelId => setProjectData(prev => ({ ...prev, aiModel: modelId }))}
          />
        </div>

        {/* 项目存储位置 */}
        <div>
          <ProjectLocationSelector
            onLocationSelected={handleLocationSelected}
            selectedLocation={selectedLocationPath}
            error={errors.location}
          />
        </div>
        {/* 创建按钮 */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onBack}
            disabled={isCreating}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            取消
          </button>
          <button
            onClick={handleCreateProject}
            disabled={
              isCreating ||
              !projectData.name ||
              !projectData.description ||
              !projectData.uiLibrary ||
              !selectedLocationPath
            }
            className={cn(
              'px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2',
              isCreating ||
                !projectData.name ||
                !projectData.description ||
                !projectData.uiLibrary ||
                !selectedLocationPath
                ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            )}
          >
            {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
            {isCreating ? '创建中...' : '创建项目'}
          </button>
        </div>
      </div>

      {/* 创建进度显示 */}
      {isCreating && creationProgress.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            创建进度
          </h3>

          {/* 当前步骤 */}
          {currentStep && (
            <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                当前步骤: {currentStep}
              </div>
            </div>
          )}

          {/* 进度日志 */}
          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-3 max-h-40 overflow-y-auto">
            <div className="font-mono text-sm space-y-1">
              {creationProgress.map((log, index) => (
                <div
                  key={index}
                  className={cn(
                    'text-gray-300',
                    log.includes('❌') && 'text-red-400',
                    log.includes('✅') && 'text-green-400',
                    log.includes('🚀') && 'text-blue-400'
                  )}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
