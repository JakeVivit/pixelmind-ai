import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Typography, Space, Dropdown, MenuProps, Input } from 'antd'
import {
  ArrowLeft,
  Upload,
  MoreHorizontal,
  FileText,
  Code,
  Plus,
  MessageCircle,
} from 'lucide-react'
import { ProjectWebContainer } from './components/ProjectWebContainer'
import { PageManager } from './components/PageManager'
import { ElementSelector } from './components/ElementSelector'
import { ElementSelector as ElementSelectorService } from './services/ElementSelector'
import { ProjectManager } from '../projects/services/ProjectManager'
import type { Project } from '../projects/types/project'
import type { SelectedElement } from './services/ElementSelector'
import { cn } from '../../utils/cn'

const { Title, Text } = Typography
const { TextArea } = Input

/**
 * 项目工作台页面
 * 左侧：页面管理，中间：项目预览，右侧：AI对话
 */
export const WorkspacePage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [aiPanelVisible, setAiPanelVisible] = useState(true)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [publishLoading, setPublishLoading] = useState(false)
  const [aiMessage, setAiMessage] = useState('')
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null)
  const [iframeRef, setIframeRef] = useState<HTMLIFrameElement | null>(null)

  // 获取项目信息
  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        setLoading(false)
        return
      }

      try {
        const projectManager = ProjectManager.getInstance()
        const projects = await projectManager.getProjects()
        const project = projects.find(p => p.id === projectId)

        if (project) {
          setCurrentProject(project)
        } else {
          console.error('项目未找到:', projectId)
        }
      } catch (error) {
        console.error('加载项目失败:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [projectId])

  // 如果项目ID存在但项目未找到，显示错误信息
  if (projectId && !loading && !currentProject) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            项目未找到
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">项目 ID: {projectId}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            返回上一页
          </button>
        </div>
      </div>
    )
  }

  // 更多菜单项
  const moreMenuItems: MenuProps['items'] = [
    {
      key: 'export-pdf',
      label: '导出 PDF',
      icon: <FileText className="w-4 h-4" />,
      onClick: () => {
        console.log('导出 PDF')
      },
    },
    {
      key: 'view-source',
      label: '查看源码',
      icon: <Code className="w-4 h-4" />,
      onClick: () => {
        console.log('查看源码')
      },
    },
  ]

  const handlePublish = async () => {
    setPublishLoading(true)
    try {
      console.log('发布项目')
      await new Promise(resolve => setTimeout(resolve, 2000))
    } catch (error) {
      console.error('发布失败:', error)
    } finally {
      setPublishLoading(false)
    }
  }

  const handleBack = () => {
    window.history.back()
  }

  const handleAddPage = () => {
    console.log('新增页面')
  }

  const handleSendMessage = () => {
    if (aiMessage.trim() && selectedElement) {
      console.log('发送消息:', aiMessage, '选中元素:', selectedElement)
      // TODO: 实现 AI 对话功能
      setAiMessage('')
    }
  }

  return (
    <div className={cn('h-screen flex flex-col', 'bg-gray-50 dark:bg-gray-950')}>
      {/* 顶部导航栏 */}
      <div className="h-[50px] border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-between px-4">
        {/* 左侧 */}
        <div className="flex items-center gap-4">
          <Button
            type="text"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            返回
          </Button>

          {currentProject && (
            <div className="flex items-center gap-3">
              <div>
                <Title level={5} className="!mb-0 !text-base">
                  {currentProject.name}
                </Title>
              </div>
              <div className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-md">
                {currentProject.template === 'react-vite-typescript' && 'React + TypeScript'}
                {currentProject.template === 'vue-vite-typescript' && 'Vue + TypeScript'}
                {currentProject.template === 'vanilla-vite' && 'Vanilla JS'}
                {!['react-vite-typescript', 'vue-vite-typescript', 'vanilla-vite'].includes(
                  currentProject.template
                ) && currentProject.template}
              </div>
            </div>
          )}
        </div>

        {/* 右侧 */}
        <Space>
          <Button
            type="primary"
            icon={<Upload className="w-4 h-4" />}
            onClick={handlePublish}
            loading={publishLoading}
          >
            发布
          </Button>

          <Dropdown menu={{ items: moreMenuItems }} placement="bottomRight" trigger={['hover']}>
            <Button
              type="text"
              icon={<MoreHorizontal className="w-4 h-4" />}
              className="flex items-center justify-center"
            />
          </Dropdown>
        </Space>
      </div>

      {/* 主要工作区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧边栏 - 页面管理 */}
        <div
          className={cn(
            'transition-all duration-300',
            sidebarCollapsed ? 'w-0' : 'w-80',
            'border-r border-gray-200 dark:border-gray-700',
            'bg-white dark:bg-gray-900'
          )}
        >
          {!sidebarCollapsed && projectId && (
            <div className="h-full flex flex-col">
              <div className="flex-1 min-h-0">
                <PageManager projectId={projectId} className="h-full p-4" />
              </div>
            </div>
          )}
        </div>

        {/* 中间区域 - 项目预览 */}
        <div className={cn('transition-all duration-300', aiPanelVisible ? 'flex-1' : 'w-full')}>
          <ProjectWebContainer onIframeReady={setIframeRef} />
        </div>

        {/* 右侧 AI 对话区域 */}
        {aiPanelVisible && (
          <div
            className={cn(
              'w-96 border-l border-gray-200 dark:border-gray-700',
              'bg-white dark:bg-gray-900 flex flex-col'
            )}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <Title level={5} className="!mb-0">
                  AI 助手
                </Title>
                {/* 调试按钮 */}
                <div className="flex gap-1">
                  <Button
                    size="small"
                    type="text"
                    onClick={() => {
                      if (iframeRef) {
                        const elementSelector = ElementSelectorService.getInstance()
                        elementSelector.initialize(iframeRef)
                        console.log('手动重新注入元素选择器')
                      }
                    }}
                    className="text-xs"
                  >
                    重新注入
                  </Button>
                  <Button
                    size="small"
                    type="text"
                    onClick={() => {
                      if (iframeRef?.contentWindow) {
                        console.log('发送测试消息到 iframe')
                        iframeRef.contentWindow.postMessage(
                          {
                            type: 'TEST_PING',
                            data: 'Hello from parent',
                          },
                          '*'
                        )
                      }
                    }}
                    className="text-xs"
                  >
                    测试通信
                  </Button>
                  <Button
                    size="small"
                    type="text"
                    onClick={async () => {
                      console.log('手动修复项目文件')
                      if (iframeRef) {
                        const elementSelector = ElementSelectorService.getInstance()
                        try {
                          await elementSelector.manualFixProjectFiles()
                        } catch (error) {
                          console.error('修复文件失败:', error)
                        }
                      }
                    }}
                    className="text-xs"
                  >
                    修复文件
                  </Button>
                </div>
              </div>
            </div>

            {/* AI 对话内容 */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto">
                {/* 元素选择器 */}
                <ElementSelector
                  iframe={iframeRef}
                  onElementSelected={setSelectedElement}
                  className="mb-6"
                />

                {/* 选中元素提示 */}
                {selectedElement && (
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <Text className="text-sm font-medium text-green-700 dark:text-green-300">
                        已选中元素: {selectedElement.tagName}
                      </Text>
                    </div>
                    <Text className="text-xs text-green-600 dark:text-green-400">
                      现在可以开始与 AI 对话，告诉它你想要对这个元素做什么修改
                    </Text>
                  </div>
                )}

                {/* 空状态或对话区域 */}
                {!selectedElement ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <Title level={5} type="secondary" className="!mb-2">
                      选择元素开始对话
                    </Title>
                    <Text type="secondary" className="text-sm">
                      请先在预览区域选择一个元素，然后与 AI 对话进行修改
                    </Text>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Text type="secondary" className="text-sm">
                      请描述你想要对选中元素进行的修改...
                    </Text>

                    {/* 这里后续会添加对话界面 */}
                    <div className="text-gray-400 text-center py-4">AI 对话功能开发中...</div>
                  </div>
                )}
              </div>

              {/* 输入框 */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <TextArea
                    value={aiMessage}
                    onChange={e => setAiMessage(e.target.value)}
                    placeholder={selectedElement ? '描述你想要的修改...' : '请先选择一个元素...'}
                    autoSize={{ minRows: 2, maxRows: 4 }}
                    disabled={!selectedElement}
                    onPressEnter={e => {
                      if (e.shiftKey) return
                      e.preventDefault()
                      handleSendMessage()
                    }}
                  />
                  <Button
                    type="primary"
                    onClick={handleSendMessage}
                    disabled={!aiMessage.trim() || !selectedElement}
                    className="self-end"
                  >
                    发送
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
