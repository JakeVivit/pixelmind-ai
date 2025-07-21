import React from 'react'
import { cn } from '../../../utils/cn'
import { Folder, Plus, FileText, Store, Settings } from 'lucide-react'

interface MenuItem {
  key: string
  label: string
  icon: React.ReactNode
  count?: number
}

interface ProjectSidebarProps {
  activeKey: string
  onMenuClick: (key: string) => void
}

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({ activeKey, onMenuClick }) => {
  const menuItems: MenuItem[] = [
    {
      key: 'my-projects',
      label: '我的项目',
      icon: <Folder className="w-4 h-4" />,
      count: 3,
    },
    {
      key: 'create-project',
      label: '创建新项目',
      icon: <Plus className="w-4 h-4" />,
    },
    {
      key: 'my-templates',
      label: '我的模板',
      icon: <FileText className="w-4 h-4" />,
      count: 2,
    },
    {
      key: 'template-market',
      label: '模板市场',
      icon: <Store className="w-4 h-4" />,
    },
    {
      key: 'theme-test',
      label: '主题测试',
      icon: <Settings className="w-4 h-4" />,
    },
  ]

  return (
    <div className="w-64 h-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col border-r border-gray-200 dark:border-gray-700">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">PixelMind AI</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">项目管理</p>
      </div>

      {/* 菜单列表 */}
      <div className="flex-1 py-4">
        {menuItems.map(item => (
          <button
            key={item.key}
            onClick={() => onMenuClick(item.key)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-3 text-left',
              'hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200',
              'border-l-2 border-transparent',
              activeKey === item.key && ['bg-gray-800 border-l-blue-500', 'text-blue-400']
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex-shrink-0',
                  activeKey === item.key
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                )}
              >
                {item.icon}
              </div>
              <span
                className={cn(
                  'text-sm font-medium',
                  activeKey === item.key
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-800 dark:text-gray-200'
                )}
              >
                {item.label}
              </span>
            </div>

            {item.count && (
              <span
                className={cn(
                  'text-xs px-2 py-1 rounded-full',
                  activeKey === item.key
                    ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 底部信息 */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-600 dark:text-gray-400">
          <p>© 2024 PixelMind AI</p>
          <p className="mt-1">版本 1.0.0</p>
        </div>
      </div>
    </div>
  )
}
