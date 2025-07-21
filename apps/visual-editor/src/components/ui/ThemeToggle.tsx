import React from 'react'
import { Button, Dropdown, Tooltip } from 'antd'
import { 
  SunOutlined, 
  MoonOutlined, 
  DesktopOutlined,
  CheckOutlined 
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useTheme, themeConfig, getThemeIcon } from '../../hooks/useTheme'
import { cn } from '../../utils/cn'

/**
 * 主题切换组件
 * 支持明亮、暗黑和跟随系统三种模式
 */
export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, isDark } = useTheme()

  const getIcon = (themeName: string) => {
    switch (themeName) {
      case 'light':
        return <SunOutlined />
      case 'dark':
        return <MoonOutlined />
      case 'system':
        return <DesktopOutlined />
      default:
        return <DesktopOutlined />
    }
  }

  const menuItems: MenuProps['items'] = themeConfig.themes.map(({ value, label }) => ({
    key: value,
    icon: getIcon(value),
    label: (
      <div className="flex items-center justify-between min-w-[120px]">
        <span>{label}</span>
        {theme === value && (
          <CheckOutlined className="text-primary-600 dark:text-primary-400" />
        )}
      </div>
    ),
    onClick: () => setTheme(value),
  }))

  const currentIcon = getIcon(theme)

  return (
    <Dropdown
      menu={{ items: menuItems }}
      placement="bottomRight"
      trigger={['click']}
    >
      <Tooltip title="切换主题">
        <Button
          type="text"
          icon={currentIcon}
          className={cn(
            'flex items-center justify-center',
            'w-8 h-8 p-0',
            'text-gray-600 dark:text-gray-300',
            'hover:text-primary-600 dark:hover:text-primary-400',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'transition-all duration-200'
          )}
        />
      </Tooltip>
    </Dropdown>
  )
}
