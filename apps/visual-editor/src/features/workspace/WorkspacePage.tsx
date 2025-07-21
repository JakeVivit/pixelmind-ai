import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { WorkspaceHeader } from './components/WorkspaceHeader'
import { ProjectSidebarNew as ProjectSidebar } from './components/ProjectSidebarNew'
import { PreviewPanel } from './components/PreviewPanel'
import { AIAssistantSimple } from './components/AIAssistantSimple'
import { cn } from '../../utils/cn'

/**
 * 项目工作台页面
 * 左侧：页面和组件管理，右侧：预览区域+AI对话
 */
export const WorkspacePage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [aiPanelVisible, setAiPanelVisible] = useState(true)

  return (
    <div className={cn('h-screen flex flex-col', 'bg-gray-50 dark:bg-gray-950')}>
      {/* 工作台头部操作栏 */}
      <WorkspaceHeader
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onToggleAI={() => setAiPanelVisible(!aiPanelVisible)}
        sidebarCollapsed={sidebarCollapsed}
        aiPanelVisible={aiPanelVisible}
      />

      {/* 主要工作区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧边栏 - 页面和组件管理 */}
        <div
          className={cn(
            'transition-all duration-300',
            sidebarCollapsed ? 'w-0' : 'w-80',
            'border-r border-gray-200 dark:border-gray-700',
            'bg-white dark:bg-gray-900'
          )}
        >
          {!sidebarCollapsed && <ProjectSidebar />}
        </div>

        {/* 右侧区域 - 预览和AI对话 */}
        <div className="flex-1 flex">
          {/* 预览区域 */}
          <div className={cn('transition-all duration-300', aiPanelVisible ? 'flex-1' : 'w-full')}>
            <PreviewPanel />
          </div>

          {/* AI 对话区域 */}
          {aiPanelVisible && (
            <div
              className={cn(
                'w-96 border-l border-gray-200 dark:border-gray-700 border-l-fix',
                'bg-white dark:bg-gray-900'
              )}
            >
              <AIAssistantSimple />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
