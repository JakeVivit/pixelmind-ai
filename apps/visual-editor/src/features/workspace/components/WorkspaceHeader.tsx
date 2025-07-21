import React from 'react'
import { Button, Space, Dropdown, Typography, Breadcrumb, Tooltip } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RobotOutlined,
  TerminalOutlined,
  PlayCircleOutlined,
  SaveOutlined,
  ShareAltOutlined,
  SettingOutlined,
  FolderOpenOutlined,
  HomeOutlined,
  CodeOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { cn } from '../../../utils/cn'
import { useAppStore } from '../../../core/store/useAppStore'

const { Text } = Typography

interface WorkspaceHeaderProps {
  onToggleSidebar: () => void
  onToggleAI: () => void
  onToggleTerminal: () => void
  sidebarCollapsed: boolean
  aiPanelVisible: boolean
  terminalVisible: boolean
}

/**
 * 工作台头部组件
 * 包含项目信息、工具栏和面板切换按钮
 */
export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  onToggleSidebar,
  onToggleAI,
  onToggleTerminal,
  sidebarCollapsed,
  aiPanelVisible,
  terminalVisible,
}) => {
  const { setCurrentView } = useAppStore()

  // 项目操作菜单
  const projectMenuItems: MenuProps['items'] = [
    {
      key: 'save',
      icon: <SaveOutlined />,
      label: '保存项目',
    },
    {
      key: 'export',
      icon: <ShareAltOutlined />,
      label: '导出代码',
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '项目设置',
    },
  ]

  const handleProjectMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'save':
        console.log('保存项目')
        break
      case 'export':
        console.log('导出代码')
        break
      case 'settings':
        console.log('项目设置')
        break
    }
  }

  const handleRunProject = () => {
    console.log('运行项目')
  }

  return (
    <div className={cn(
      'h-14 px-4 flex items-center justify-between',
      'bg-white dark:bg-gray-900',
      'border-b border-gray-200 dark:border-gray-700',
      'shadow-sm'
    )}>
      {/* 左侧 - 导航和项目信息 */}
      <div className="flex items-center gap-4">
        {/* 侧边栏切换 */}
        <Button
          type="text"
          icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
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
                  icon={<HomeOutlined />}
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
                  <FolderOpenOutlined className="text-primary-500" />
                  <Text className="text-gray-900 dark:text-gray-100 font-medium">
                    我的项目
                  </Text>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* 中间 - 项目操作 */}
      <div className="flex items-center gap-2">
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={handleRunProject}
          className={cn(
            'bg-primary-600 hover:bg-primary-700',
            'border-primary-600 hover:border-primary-700'
          )}
        >
          运行项目
        </Button>

        <Dropdown
          menu={{
            items: projectMenuItems,
            onClick: handleProjectMenuClick,
          }}
          placement="bottomRight"
        >
          <Button icon={<SettingOutlined />}>
            项目操作
          </Button>
        </Dropdown>
      </div>

      {/* 右侧 - 面板切换 */}
      <div className="flex items-center gap-1">
        <Tooltip title={terminalVisible ? '隐藏终端' : '显示终端'}>
          <Button
            type="text"
            icon={<TerminalOutlined />}
            onClick={onToggleTerminal}
            className={cn(
              'w-8 h-8 p-0',
              terminalVisible 
                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50' 
                : 'text-gray-600 dark:text-gray-300',
              'hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          />
        </Tooltip>

        <Tooltip title={aiPanelVisible ? '隐藏 AI 助手' : '显示 AI 助手'}>
          <Button
            type="text"
            icon={<RobotOutlined />}
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
