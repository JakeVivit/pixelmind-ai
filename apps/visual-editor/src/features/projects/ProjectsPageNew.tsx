import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { ProjectSidebar } from './components/ProjectSidebar'
import { ProjectCard } from './components/ProjectCard'
import { TemplateCard } from './components/TemplateCard'
import { CreateProjectPage } from './components/CreateProjectPage'
import { AntdThemeTest } from './components/AntdThemeTest'
import { ProjectList } from './components/ProjectList'
import { ProjectLocationSelector } from './components/ProjectLocationSelector'
import { ThemeToggle } from '../../components/ThemeToggle'
import { ProjectManager } from './services/ProjectManager'
import { Search, Plus, Folder, Settings } from 'lucide-react'
import type { Project } from './types/project'

interface Template {
  id: string
  name: string
  description: string
  author: string
  icon: string
  color: string
}

export const ProjectsPageNew: React.FC = () => {
  const navigate = useNavigate()
  const [activeMenu, setActiveMenu] = useState('my-projects')
  const [searchValue, setSearchValue] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [showDirectorySetup, setShowDirectorySetup] = useState(false)
  const [currentDirectoryPath, setCurrentDirectoryPath] = useState<string | null>(null)

  // 检查目录状态
  useEffect(() => {
    const projectManager = ProjectManager.getInstance()
    const path = projectManager.getBaseDirectoryPath()
    setCurrentDirectoryPath(path)

    // 只有当完全没有保存的目录路径时，才显示目录设置界面
    // 如果有路径但没有权限，让 ProjectList 组件处理并显示提示
    if (!path) {
      setShowDirectorySetup(true)
    } else {
      setShowDirectorySetup(false)
    }
  }, [refreshTrigger])

  // 处理项目创建成功
  const handleProjectCreated = (project: Project) => {
    console.log('项目创建成功:', project)
    setActiveMenu('my-projects')
    setRefreshTrigger(prev => prev + 1) // 触发项目列表刷新
  }

  // 处理项目点击
  const handleProjectClick = (project: Project) => {
    console.log('打开项目:', project)
    // 导航到工作区页面
    navigate(`/workspace/${project.id}`)
  }

  // 处理目录选择
  const handleDirectorySelected = (dirHandle: FileSystemDirectoryHandle, path: string) => {
    console.log('目录已选择:', path)
    setCurrentDirectoryPath(path)
    setShowDirectorySetup(false)
    setRefreshTrigger(prev => prev + 1) // 触发项目列表刷新
  }

  // 重新设置目录
  const handleResetDirectory = async () => {
    try {
      const projectManager = ProjectManager.getInstance()

      // 如果有保存的路径，尝试重新获取权限而不是重置
      if (projectManager.getBaseDirectoryPath()) {
        console.log('重新获取目录访问权限...')
        const result = await projectManager.setBaseDirectory(true) // 强制重新选择
        if (result.success && result.path) {
          setCurrentDirectoryPath(result.path)
          setRefreshTrigger(prev => prev + 1)
          return
        }
      }

      // 如果重新获取失败或没有保存的路径，则完全重置
      projectManager.reset()
      localStorage.removeItem('pixelmind-base-directory')
      setCurrentDirectoryPath(null)
      setShowDirectorySetup(true)
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      console.error('重新设置目录失败:', error)
      alert('重新设置目录失败，请重试')
    }
  }

  // 模拟项目数据（保留用于模板市场等其他功能）
  const mockProjects = [
    {
      id: '1',
      name: 'redesigned-potato',
      description: 'A modern e-commerce website with shopping cart and user management features',
      template: 'github/codespaces-react',
      lastModified: 'Last used about 1 hour ago',
      size: '368 KB',
      language: 'React',
      isPrivate: true,
    },
    {
      id: '2',
      name: 'fictional-cod',
      description: 'Interactive dashboard for data visualization and analytics',
      template: 'github/codespaces-react',
      lastModified: 'Last used about 2 hours ago',
      size: '512 KB',
      language: 'Vue',
      isPrivate: true,
    },
    {
      id: '3',
      name: 'jubilant-computing-machine',
      description: 'Portfolio website with modern design and animations',
      template: 'github/codespaces-react',
      lastModified: 'Last used about 7 hours ago',
      size: '234 KB',
      language: 'Next.js',
      isPrivate: false,
    },
  ]

  // 模拟模板数据
  const templates: Template[] = [
    {
      id: 'blank',
      name: 'Blank',
      description: 'Start with a blank canvas or import any packages you need.',
      author: 'github',
      icon: '📄',
      color: '#374151',
    },
    {
      id: 'react',
      name: 'React',
      description:
        'A popular JavaScript library for building user interfaces based on UI components.',
      author: 'github',
      icon: '⚛️',
      color: '#3B82F6',
    },
    {
      id: 'jupyter',
      name: 'Jupyter Notebook',
      description:
        'Jupyter is the latest web-based interactive development environment for notebooks, code, and data.',
      author: 'github',
      icon: '📊',
      color: '#F97316',
    },
    {
      id: 'dotnet',
      name: '.NET',
      description:
        'A full-stack web application template written in C# leveraging the power of .NET 8.',
      author: 'github',
      icon: '🔷',
      color: '#8B5CF6',
    },
  ]

  // 这个函数已经被 handleProjectCreated 替代

  const handleUseTemplate = (templateId: string) => {
    console.log('Using template:', templateId)
    // 这里可以添加使用模板的逻辑
  }

  const renderContent = () => {
    switch (activeMenu) {
      case 'create-project':
        return (
          <CreateProjectPage
            onBack={() => setActiveMenu('my-projects')}
            onCreate={handleProjectCreated}
          />
        )

      case 'theme-test':
        return (
          <div className="h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-auto">
            <AntdThemeTest />
          </div>
        )

      case 'my-templates':
        return (
          <div className="h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-auto">
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">我的模板</h1>
                <p className="text-gray-600 dark:text-gray-400">管理你创建的项目模板</p>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索模板..."
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <Plus className="w-12 h-12 mx-auto mb-4" />
                  <p>你还没有创建任何模板</p>
                  <p className="text-sm">从现有项目创建模板，方便复用</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'template-market':
        return (
          <div className="h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-auto">
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">模板市场</h1>
                <p className="text-gray-600 dark:text-gray-400">探索快速启动模板</p>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索模板..."
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">探索快速启动模板</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {templates.map(template => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onUse={() => handleUseTemplate(template.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      default: // my-projects
        return (
          <div className="h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-auto">
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">我的项目</h1>
                <p className="text-gray-600 dark:text-gray-400">管理你的开发项目</p>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索项目..."
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">我的项目列表</h2>
                  <div className="flex items-center gap-3">
                    {currentDirectoryPath && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Folder className="w-4 h-4" />
                        <span className="max-w-xs truncate">{currentDirectoryPath}</span>
                        <button
                          onClick={handleResetDirectory}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                          title="重新选择目录"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <ThemeToggle />
                    <button
                      onClick={() => setActiveMenu('create-project')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      创建新项目
                    </button>
                  </div>
                </div>

                {showDirectorySetup ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="text-center mb-6">
                      <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">选择项目存储目录</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        请选择一个文件夹来存储你的项目文件
                      </p>
                    </div>
                    <ProjectLocationSelector
                      onLocationSelected={handleDirectorySelected}
                      selectedLocation={currentDirectoryPath}
                      allowReselect={true}
                    />
                  </div>
                ) : (
                  <ProjectList
                    onProjectClick={handleProjectClick}
                    refreshTrigger={refreshTrigger}
                  />
                )}
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* 左侧菜单 */}
      <ProjectSidebar activeKey={activeMenu} onMenuClick={setActiveMenu} />

      {/* 右侧内容区域 */}
      <div className="flex-1">{renderContent()}</div>
    </div>
  )
}
