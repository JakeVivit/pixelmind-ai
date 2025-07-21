import React from 'react'
import { Button, Space, Dropdown, Typography, Breadcrumb, Tooltip } from 'antd'
import {
  Menu,
  PanelLeftOpen,
  Bot,
  Play,
  Save,
  Share,
  Settings,
  FolderOpen,
  Home,
  MoreHorizontal,
  Eye,
  PanelLeft,
} from 'lucide-react'
import type { MenuProps } from 'antd'
import { cn } from '../../../utils/cn'
import { useAppStore } from '../../../core/store/useAppStore'

const { Text } = Typography

interface WorkspaceHeaderProps {
  onToggleSidebar: () => void
  onToggleAI: () => void
  sidebarCollapsed: boolean
  aiPanelVisible: boolean
}

/**
 * 工作台头部组件
 * 简化的操作栏，包含项目信息和面板切换
 */
export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  onToggleSidebar,
  onToggleAI,
  sidebarCollapsed,
  aiPanelVisible,
}) => {
  const { setCurrentView } = useAppStore()

  // 项目操作菜单
  const projectMenuItems: MenuProps['items'] = [
    {
      key: 'save',
      icon: <Save className="w-4 h-4" />,
      label: '保存项目',
    },
    {
      key: 'export',
      icon: <Share className="w-4 h-4" />,
      label: '导出项目',
    },
    {
      key: 'preview',
      icon: <Eye className="w-4 h-4" />,
      label: '预览项目',
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      icon: <Settings className="w-4 h-4" />,
      label: '项目设置',
    },
  ]

  const handleProjectMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'save':
        console.log('保存项目')
        break
      case 'export':
        console.log('导出项目')
        break
      case 'preview':
        console.log('预览项目')
        break
      case 'settings':
        console.log('项目设置')
        break
    }
  }

  const handlePublishProject = () => {
    console.log('发布项目')
  }

  return (
    <div
      className={cn(
        'h-14 px-4 flex items-center justify-between',
        'bg-white dark:bg-gray-900',
        'border-b border-gray-200 dark:border-gray-700',
        'shadow-sm'
      )}
    >
      {/* 左侧 - 导航和项目信息 */}
      <div className="flex items-center gap-4">
        {/* 侧边栏切换 */}
        <Button
          type="text"
          icon={
            sidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeft className="w-4 h-4" />
            )
          }
          onClick={onToggleSidebar}
          className={cn(
            'w-8 h-8 p-0',
            'text-gray-600 dark:text-gray-300',
            'hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
        />

        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            {
              title: (
                <Button
                  type="link"
                  icon={<Home className="w-4 h-4" />}
                  onClick={() => setCurrentView('home')}
                  className="p-0 h-auto text-gray-500 dark:text-gray-400"
                >
                  首页
                </Button>
              ),
            },
            {
              title: (
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-primary-500" />
                  <Text className="text-gray-900 dark:text-gray-100 font-medium">电商网站项目</Text>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* 右侧 - 项目操作和面板切换 */}
      <div className="flex items-center gap-1">
        {/* 项目操作图标 */}
        <Tooltip title="发布项目">
          <Button
            type="text"
            icon={<Play className="w-4 h-4" />}
            onClick={handlePublishProject}
            className={cn(
              'w-8 h-8 p-0',
              'text-gray-600 dark:text-gray-300',
              'hover:text-blue-600 dark:hover:text-blue-400',
              'hover:bg-blue-50 dark:hover:bg-blue-900/20'
            )}
          />
        </Tooltip>

        <Dropdown
          menu={{
            items: projectMenuItems,
            onClick: handleProjectMenuClick,
          }}
          placement="bottomRight"
        >
          <Tooltip title="项目操作">
            <Button
              type="text"
              icon={<MoreHorizontal className="w-4 h-4" />}
              className={cn(
                'w-8 h-8 p-0',
                'text-gray-600 dark:text-gray-300',
                'hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            />
          </Tooltip>
        </Dropdown>

        {/* 分隔线 */}
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* 面板切换 */}
        <Tooltip title={sidebarCollapsed ? '显示资源面板' : '隐藏资源面板'}>
          <Button
            type="text"
            icon={
              sidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )
            }
            onClick={onToggleSidebar}
            className={cn(
              'w-8 h-8 p-0',
              'text-gray-600 dark:text-gray-300',
              'hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          />
        </Tooltip>

        <Tooltip title={aiPanelVisible ? '隐藏 AI 助手' : '显示 AI 助手'}>
          <Button
            type="text"
            icon={<Bot className="w-4 h-4" />}
            onClick={onToggleAI}
            className={cn(
              'w-8 h-8 p-0',
              aiPanelVisible
                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50'
                : 'text-gray-600 dark:text-gray-300',
              'hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          />
        </Tooltip>
      </div>
    </div>
  )
}
