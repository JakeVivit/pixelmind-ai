import React, { useState } from 'react'
import { Layout } from 'antd'
import { WorkspaceHeader } from './components/WorkspaceHeader'
import { ProjectSidebar } from './components/ProjectSidebar'
import { CodeEditor } from './components/CodeEditor'
import { PreviewPanel } from './components/PreviewPanel'
import { AIAssistant } from './components/AIAssistant'
import { TerminalPanel } from './components/TerminalPanel'
import { cn } from '../../utils/cn'

const { Content } = Layout

/**
 * 工作台主页面
 * 采用 GitHub Codespaces 风格的布局，支持可视化操作和 AI 对话
 */
export const WorkspacePage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [aiPanelVisible, setAiPanelVisible] = useState(true)
  const [terminalVisible, setTerminalVisible] = useState(true)

  return (
    <div className={cn('h-screen flex flex-col', 'bg-gray-50 dark:bg-gray-950')}>
      {/* 工作台头部 */}
      <WorkspaceHeader
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onToggleAI={() => setAiPanelVisible(!aiPanelVisible)}
        onToggleTerminal={() => setTerminalVisible(!terminalVisible)}
        sidebarCollapsed={sidebarCollapsed}
        aiPanelVisible={aiPanelVisible}
        terminalVisible={terminalVisible}
      />

      {/* 主要工作区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧边栏 - 项目文件和管理 */}
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

        {/* 中间区域 - 编辑器和预览 */}
        <div className="flex-1 flex flex-col">
          {/* 编辑器和预览区域 */}
          <div className="flex-1 flex">
            {/* 代码编辑器 */}
            <div className="flex-1 border-r border-gray-200 dark:border-gray-700">
              <CodeEditor />
            </div>

            {/* 预览面板 */}
            <div className="flex-1">
              <PreviewPanel />
            </div>
          </div>

          {/* 底部终端区域 */}
          {terminalVisible && (
            <div
              className={cn(
                'h-64 border-t border-gray-200 dark:border-gray-700',
                'bg-gray-900 dark:bg-gray-950'
              )}
            >
              <TerminalPanel />
            </div>
          )}
        </div>

        {/* 右侧 AI 助手面板 */}
        {aiPanelVisible && (
          <div
            className={cn(
              'w-96 border-l border-gray-200 dark:border-gray-700',
              'bg-white dark:bg-gray-900'
            )}
          >
            <AIAssistant />
          </div>
        )}
      </div>
    </div>
  )
}
