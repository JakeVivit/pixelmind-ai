import React, { useState, useEffect } from 'react'
import { RefreshCw, AlertCircle, FolderOpen, Calendar, HardDrive, Code, Folder } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { ProjectCard } from './ProjectCard'
import { ProjectManager } from '../services/ProjectManager'
import { UI_LIBRARIES } from '../utils/constants'
import type { Project } from '../types/project'

interface ProjectListProps {
  onProjectClick?: (project: Project) => void
  refreshTrigger?: number // 用于外部触发刷新
}

export const ProjectList: React.FC<ProjectListProps> = ({ onProjectClick, refreshTrigger = 0 }) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadProjects = async () => {
    try {
      setError(null)
      const projectManager = ProjectManager.getInstance()

      if (!projectManager.hasBaseDirectory()) {
        setProjects([])
        setError('请先选择项目存储目录')
        return
      }

      // 如果有基础目录路径但没有文件系统访问权限，显示提示
      if (projectManager.getBaseDirectoryPath() && !projectManager.hasFileSystemAccess()) {
        console.log('检测到保存的目录路径，但需要重新授权访问权限')
        setProjects([])
        setError(
          `检测到之前选择的目录: ${projectManager.getBaseDirectoryPath()}\n\n由于浏览器安全限制，页面刷新后需要重新授权访问权限。请点击上方的设置按钮重新选择目录。`
        )
        return
      }

      const projectList = await projectManager.getProjects()
      setProjects(projectList)
    } catch (err) {
      console.error('加载项目列表失败:', err)
      setError(err instanceof Error ? err.message : '加载项目失败')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadProjects()
  }

  const handleScanNewProjects = async () => {
    try {
      setIsRefreshing(true)
      const projectManager = ProjectManager.getInstance()
      const newProjects = await projectManager.scanForNewProjects()

      if (newProjects.length > 0) {
        await loadProjects() // 重新加载完整列表
        alert(`发现 ${newProjects.length} 个新项目`)
      } else {
        alert('没有发现新项目')
      }
    } catch (err) {
      console.error('扫描新项目失败:', err)
      alert('扫描失败: ' + (err instanceof Error ? err.message : '未知错误'))
    } finally {
      setIsRefreshing(false)
    }
  }

  // 初始加载和外部刷新触发
  useEffect(() => {
    loadProjects()
  }, [refreshTrigger])

  const getUILibraryInfo = (uiLibraryId: string) => {
    return (
      UI_LIBRARIES.find(lib => lib.id === uiLibraryId) || {
        id: uiLibraryId,
        name: uiLibraryId,
        description: '',
        packageName: '',
        installCommand: '',
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>加载项目列表...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertCircle className="w-6 h-6" />
          <span className="text-lg font-medium">加载失败</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">{error}</p>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {isRefreshing ? '重试中...' : '重试'}
          </button>
        </div>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-gray-500 dark:text-gray-400 text-center">
          <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">还没有项目</h3>
          <p className="text-sm max-w-md">点击"创建新项目"开始你的第一个项目，或者扫描现有项目</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleScanNewProjects}
            disabled={isRefreshing}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isRefreshing ? '扫描中...' : '扫描现有项目'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 头部操作栏 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">共 {projects.length} 个项目</div>
        <div className="flex gap-2">
          <button
            onClick={handleScanNewProjects}
            disabled={isRefreshing}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            扫描新项目
          </button>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
          </button>
        </div>
      </div>

      {/* 项目列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(project => (
          <ProjectListCard
            key={project.id}
            project={project}
            uiLibrary={getUILibraryInfo(project.uiLibrary)}
            onClick={() => onProjectClick?.(project)}
          />
        ))}
      </div>
    </div>
  )
}

interface ProjectListCardProps {
  project: Project
  uiLibrary: (typeof UI_LIBRARIES)[0]
  onClick: () => void
}

const ProjectListCard: React.FC<ProjectListCardProps> = ({ project, uiLibrary, onClick }) => {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 dark:text-green-400'
      case 'missing':
        return 'text-red-600 dark:text-red-400'
      case 'invalid':
        return 'text-yellow-600 dark:text-yellow-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return '正常'
      case 'missing':
        return '文件缺失'
      case 'invalid':
        return '配置错误'
      default:
        return '未知'
    }
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 border rounded-lg cursor-pointer transition-all duration-200',
        'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
        'hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md',
        project.status !== 'active' && 'opacity-75'
      )}
    >
      {/* 项目头部 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{project.name}</h3>
            <div className={cn('text-xs', getStatusColor(project.status))}>
              {getStatusText(project.status)}
            </div>
          </div>
        </div>
      </div>

      {/* 项目描述 */}
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
        {project.description}
      </p>

      {/* 技术栈信息 */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <span className="font-medium">UI库:</span>
          <span>{uiLibrary.name}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <span className="font-medium">技术栈:</span>
          <span>React + Vite + TypeScript</span>
        </div>
      </div>

      {/* 底部信息 */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <FolderOpen className="w-3 h-3" />
          <span>{project.path}</span>
        </div>
      </div>
    </div>
  )
}
