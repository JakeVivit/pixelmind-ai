import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Typography, Spin, Alert, Card } from 'antd'
import {
  Play,
  Square,
  RotateCcw,
  Terminal,
  Folder,
  Maximize2,
  Mouse,
  Smartphone,
} from 'lucide-react'
import { WebContainerService } from '../../../core/webcontainer/WebContainerService'
import { ProjectManager } from '../../projects/services/ProjectManager'
import { ElementSelector } from '../services/ElementSelector'
import type { Project } from '../../projects/types/project'
import type {
  WebContainerFileTree,
  WebContainerFile,
  WebContainerDirectory,
} from '@pixelmind/shared'

const { Title, Text } = Typography

interface ProjectWebContainerProps {
  project?: Project
  onIframeReady?: (iframe: HTMLIFrameElement) => void
}

// 添加内联样式
const logItemStyle = {
  animation: 'fadeInUp 0.3s ease-out',
}

// 添加 CSS 动画到 head
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideInFromLeft {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    .log-item {
      animation: slideInFromLeft 0.5s ease-out forwards;
    }

    .loading-dot {
      animation: pulse 1.5s ease-in-out infinite;
    }
  `
  if (!document.head.querySelector('style[data-log-animations]')) {
    style.setAttribute('data-log-animations', 'true')
    document.head.appendChild(style)
  }
}

/**
 * 项目 WebContainer 管理组件
 * 负责启动、管理和预览用户创建的项目
 */
export const ProjectWebContainer: React.FC<ProjectWebContainerProps> = ({
  project,
  onIframeReady,
}) => {
  const { projectId } = useParams<{ projectId: string }>()
  const [isLoading, setIsLoading] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [currentProject, setCurrentProject] = useState<Project | null>(project || null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const webContainerService: any = useRef<WebContainerService | null>(null)
  const elementSelector = ElementSelector.getInstance()

  // 转换文件格式为 WebContainer 格式
  const convertToWebContainerFormat = (files: Record<string, string>): WebContainerFileTree => {
    const fileTree: WebContainerFileTree = {}

    for (const [filePath, content] of Object.entries(files)) {
      const pathParts = filePath.split('/')
      let current = fileTree

      // 处理嵌套目录
      for (let i = 0; i < pathParts.length - 1; i++) {
        const dirName = pathParts[i]
        if (!current[dirName]) {
          current[dirName] = { directory: {} } as WebContainerDirectory
        }
        current = (current[dirName] as WebContainerDirectory).directory
      }

      // 添加文件
      const fileName = pathParts[pathParts.length - 1]
      current[fileName] = {
        file: {
          contents: content,
        },
      } as WebContainerFile
    }

    return fileTree
  }

  // 加载项目信息
  useEffect(() => {
    if (!currentProject && projectId) {
      loadProject()
    }
  }, [projectId, currentProject])

  const loadProject = async () => {
    try {
      const projectManager = ProjectManager.getInstance()
      const projects = await projectManager.getProjects()
      const foundProject = projects.find(p => p.id === projectId)

      if (foundProject) {
        setCurrentProject(foundProject)
      } else {
        setError('项目未找到')
      }
    } catch (err) {
      console.error('加载项目失败:', err)
      setError('加载项目失败')
    }
  }

  // 启动项目
  const startProject = async () => {
    if (!currentProject) {
      setError('没有选择项目')
      return
    }

    setIsLoading(true)
    setError(null)
    setLogs([])

    try {
      // 初始化 WebContainer 服务
      if (!webContainerService.current) {
        webContainerService.current = WebContainerService.getInstance()
      }

      addLog('正在启动 WebContainer...')
      await webContainerService.current.initialize()

      addLog('正在加载项目文件...')

      // 从文件系统读取项目文件
      const projectManager = ProjectManager.getInstance()
      const projectFiles = await projectManager.getProjectFiles(currentProject.id)

      if (!projectFiles || Object.keys(projectFiles).length === 0) {
        throw new Error('项目文件为空或无法读取')
      }

      addLog(`已加载 ${Object.keys(projectFiles).length} 个文件`)

      // 调试：显示文件列表
      console.log('读取的项目文件:', Object.keys(projectFiles))

      // 检查 package.json 是否存在
      if (projectFiles['package.json']) {
        console.log('package.json 内容:', projectFiles['package.json'])
        try {
          const pkg = JSON.parse(projectFiles['package.json'])
          console.log('解析的 package.json:', pkg)

          // 检查是否有必要的脚本和依赖
          if (!pkg.scripts || !pkg.scripts.dev) {
            addLog('⚠️ 警告: package.json 中缺少 dev 脚本')
          }
          if (!pkg.dependencies && !pkg.devDependencies) {
            addLog('⚠️ 警告: package.json 中没有依赖项')
          }
        } catch (error) {
          addLog('❌ 错误: package.json 格式无效')
          console.error('package.json 解析错误:', error)
        }
      } else {
        addLog('❌ 错误: 未找到 package.json 文件')
        console.log('可用文件:', Object.keys(projectFiles))
      }

      // 转换文件格式并挂载到 WebContainer
      const webContainerFiles = convertToWebContainerFormat(projectFiles)
      await webContainerService.current.mountFiles(webContainerFiles)
      addLog('文件挂载完成')

      // 安装依赖
      addLog('正在安装依赖 (npm install)...')
      await webContainerService.current.installDependencies()
      addLog('依赖安装完成')

      // 等待依赖安装完全完成
      addLog('等待依赖安装完全完成...')
      await new Promise(resolve => setTimeout(resolve, 3000))

      // 启动开发服务器
      addLog('正在启动开发服务器...')
      const devServerProcess = await webContainerService.current.startDevServer()
      addLog('开发服务器进程已启动')

      // 等待一段时间让服务器完全启动
      addLog('等待服务器完全启动...')
      await new Promise(resolve => setTimeout(resolve, 10000))

      // 获取服务器 URL
      addLog('获取服务器 URL...')
      const url = await webContainerService.current.getServerUrl()

      if (url) {
        setPreviewUrl(url)
        setIsRunning(true)
        addLog(`开发服务器已启动: ${url}`)

        // 等待 iframe 加载完成后初始化元素选择器
        initializeElementSelector()
      } else {
        throw new Error('无法获取预览 URL')
      }
    } catch (err) {
      console.error('启动项目失败:', err)
      setError(err instanceof Error ? err.message : '启动失败')
      addLog(`错误: ${err instanceof Error ? err.message : '启动失败'}`)
    } finally {
      setIsLoading(false)
    }
  }

  // 停止项目
  const stopProject = async () => {
    if (webContainerService.current) {
      try {
        await webContainerService.current.stop()
        setIsRunning(false)
        setPreviewUrl(null)
        addLog('项目已停止')
      } catch (err) {
        console.error('停止项目失败:', err)
        setError('停止项目失败')
      }
    }
  }

  // 重启项目
  const restartProject = async () => {
    await stopProject()
    setTimeout(() => {
      startProject()
    }, 1000)
  }

  // 添加日志
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  // 初始化元素选择器
  const initializeElementSelector = () => {
    setTimeout(() => {
      if (iframeRef.current) {
        elementSelector.initialize(iframeRef.current)
        onIframeReady?.(iframeRef.current)
        addLog('元素选择器已初始化')
      }
    }, 3000)
  }

  // 手动重新注入元素选择器
  const reinjectElementSelector = () => {
    if (iframeRef.current) {
      addLog('正在重新注入元素选择器...')
      elementSelector.initialize(iframeRef.current)
      addLog('元素选择器重新注入完成')
    }
  }

  // 在浏览器中打开
  const openInBrowser = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank')
    }
  }

  if (!currentProject) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <Title level={4} type="secondary">
            {projectId ? '加载项目中...' : '请选择一个项目'}
          </Title>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* 控制栏 */}
      <div className="border-b border-gray-200 dark:border-gray-700 h-[40px] items-center">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 px-2">
            {/* 全屏图标 */}
            <div
              onClick={() => console.log('全屏')}
              className="cursor-pointer p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            >
              <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>

            {/* 鼠标图标 */}
            <div
              onClick={() => console.log('鼠标模式')}
              className="cursor-pointer p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            >
              <Mouse className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>

            {/* 设备切换图标 */}
            <div
              onClick={() => console.log('设备切换')}
              className="cursor-pointer p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            >
              <Smartphone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
          <div className="flex p-2 items-center gap-2">
            {!isRunning ? (
              <div
                onClick={!isLoading ? startProject : undefined}
                className={`
                  w-8 h-8 rounded-md flex items-center justify-center cursor-pointer transition-all
                  ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600 active:bg-green-700'
                  }
                `}
              >
                {isLoading ? (
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="w-3 h-3 text-white fill-white" />
                )}
              </div>
            ) : (
              <>
                <div
                  onClick={!isLoading ? stopProject : undefined}
                  className={`
                    w-8 h-8 rounded-md flex items-center justify-center cursor-pointer transition-all
                    ${
                      isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-500 hover:bg-red-600 active:bg-red-700'
                    }
                  `}
                >
                  <Square className="w-3 h-3 text-white fill-white" />
                </div>
                <div
                  onClick={!isLoading ? restartProject : undefined}
                  className={`
                    w-8 h-8 rounded-md flex items-center justify-center cursor-pointer transition-all ml-2
                    ${
                      isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                    }
                  `}
                >
                  <RotateCcw className="w-3 h-3 text-white" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* 运行日志 - 在控制栏下方显示 */}
        {isLoading && logs.length > 0 && (
          <div className="px-4 pb-4 space-y-2 max-h-48 overflow-y-auto">
            {logs.map((log, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transform transition-all duration-500 ease-out"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                  transform: 'translateX(-20px)',
                  animation: 'slideInFromLeft 0.5s ease-out forwards',
                }}
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs text-blue-600 dark:text-blue-400 mb-1">
                    {log.split(']')[0]}]
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {log.split('] ')[1]}
                  </div>
                </div>
                {index === logs.length - 1 && (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 flex">
        {/* 项目预览区域 - 成功后全屏显示 */}
        {previewUrl && !isLoading && (
          <div className="flex-1">
            <iframe
              ref={iframeRef}
              src={previewUrl}
              className="w-full h-full border-0"
              title={`${currentProject?.name} 预览`}
              onLoad={() => {
                // iframe 内容加载完成后，延迟注入元素选择器
                setTimeout(() => {
                  if (iframeRef.current) {
                    elementSelector.initialize(iframeRef.current)
                    addLog('iframe 加载完成，元素选择器已注入')
                  }
                }, 1000)
              }}
            />
          </div>
        )}

        {/* 启动状态显示 */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <Spin size="large" className="mb-4" />
              <Title level={4} className="mb-2">
                正在启动项目
              </Title>
              <Text type="secondary">请稍候，项目正在 WebContainer 中启动...</Text>
            </div>
          </div>
        )}

        {/* 错误提示 */}
        {error && !isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <Alert
              message="启动失败"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
              className="max-w-md"
            />
          </div>
        )}

        {/* 空状态 - 未启动时显示 */}
        {!previewUrl && !isLoading && !error && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Terminal className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <Title level={4} type="secondary">
                点击"启动项目"开始开发
              </Title>
              <Text type="secondary">项目将在 WebContainer 中运行，支持热重载和实时预览</Text>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
