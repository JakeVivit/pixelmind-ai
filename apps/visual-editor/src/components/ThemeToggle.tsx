import React from 'react'
import { Button, Dropdown, Space } from 'antd'
import type { MenuProps } from 'antd'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme, getThemeIcon, getThemeLabel } from '../hooks/useTheme'

/**
 * 主题切换组件
 * 支持明亮、暗黑和跟随系统三种模式
 */
export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, isDark } = useTheme()

  const getIcon = (themeName: string) => {
    switch (themeName) {
      case 'light':
        return <Sun className="w-4 h-4" />
      case 'dark':
        return <Moon className="w-4 h-4" />
      case 'system':
        return <Monitor className="w-4 h-4" />
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'light',
      label: (
        <Space>
          <Sun className="w-4 h-4" />
          明亮模式
        </Space>
      ),
      onClick: () => setTheme('light'),
    },
    {
      key: 'dark',
      label: (
        <Space>
          <Moon className="w-4 h-4" />
          暗黑模式
        </Space>
      ),
      onClick: () => setTheme('dark'),
    },
    {
      key: 'system',
      label: (
        <Space>
          <Monitor className="w-4 h-4" />
          跟随系统
        </Space>
      ),
      onClick: () => setTheme('system'),
    },
  ]

  return (
    <Dropdown
      menu={{ items: menuItems, selectedKeys: [theme] }}
      placement="bottomRight"
      trigger={['click']}
    >
      <Button
        type="text"
        icon={getIcon(theme)}
        className="flex items-center justify-center"
        title={`当前主题: ${getThemeLabel(theme)}`}
      >
        {getThemeLabel(theme)}
      </Button>
    </Dropdown>
  )
}
