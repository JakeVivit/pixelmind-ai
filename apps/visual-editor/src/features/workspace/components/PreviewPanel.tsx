import React, { useState, useRef } from 'react'
import { Button, Space, Dropdown, Typography, Select, Tooltip, Spin } from 'antd'
import {
  ReloadOutlined,
  FullscreenOutlined,
  MobileOutlined,
  TabletOutlined,
  DesktopOutlined,
  MoreOutlined,
  ExportOutlined,
  BugOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { cn } from '../../../utils/cn'

const { Text } = Typography
const { Option } = Select

interface DevicePreset {
  name: string
  width: number
  height: number
  icon: React.ReactNode
}

/**
 * 预览面板组件
 * 支持多设备预览和实时更新
 */
export const PreviewPanel: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [currentDevice, setCurrentDevice] = useState('desktop')
  const [previewUrl, setPreviewUrl] = useState('http://localhost:3000')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // 设备预设
  const devicePresets: Record<string, DevicePreset> = {
    mobile: {
      name: '手机',
      width: 375,
      height: 667,
      icon: <MobileOutlined />,
    },
    tablet: {
      name: '平板',
      width: 768,
      height: 1024,
      icon: <TabletOutlined />,
    },
    desktop: {
      name: '桌面',
      width: 1200,
      height: 800,
      icon: <DesktopOutlined />,
    },
  }

  // 预览操作菜单
  const previewMenuItems: MenuProps['items'] = [
    {
      key: 'console',
      icon: <BugOutlined />,
      label: '打开控制台',
    },
    {
      key: 'export',
      icon: <ExportOutlined />,
      label: '导出预览',
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      label: '预览设置',
    },
  ]

  const handleRefresh = () => {
    setIsLoading(true)
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
    // 模拟加载时间
    setTimeout(() => setIsLoading(false), 1000)
  }

  const handleDeviceChange = (device: string) => {
    setCurrentDevice(device)
  }

  const handleFullscreen = () => {
    if (iframeRef.current) {
      iframeRef.current.requestFullscreen()
    }
  }

  const handlePreviewMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'console':
        console.log('打开控制台')
        break
      case 'export':
        console.log('导出预览')
        break
      case 'settings':
        console.log('预览设置')
        break
    }
  }

  const currentPreset = devicePresets[currentDevice]

  return (
    <div className="h-full flex flex-col">
      {/* 预览头部 */}
      <div className={cn(
        'flex items-center justify-between px-3 py-2',
        'bg-gray-50 dark:bg-gray-800',
        'border-b border-gray-200 dark:border-gray-700'
      )}>
        <div className="flex items-center gap-3">
          <Text className="font-medium text-gray-900 dark:text-gray-100">
            实时预览
          </Text>
          
          {isLoading && (
            <Spin size="small" />
          )}
        </div>
        
        <Space size="small">
          {/* 设备选择 */}
          <Select
            value={currentDevice}
            onChange={handleDeviceChange}
            size="small"
            className="w-24"
          >
            {Object.entries(devicePresets).map(([key, preset]) => (
              <Option key={key} value={key}>
                <div className="flex items-center gap-2">
                  {preset.icon}
                  <span className="hidden sm:inline">{preset.name}</span>
                </div>
              </Option>
            ))}
          </Select>
          
          <Tooltip title="刷新预览">
            <Button
              type="text"
              icon={<ReloadOutlined />}
              size="small"
              onClick={handleRefresh}
              loading={isLoading}
            />
          </Tooltip>
          
          <Tooltip title="全屏预览">
            <Button
              type="text"
              icon={<FullscreenOutlined />}
              size="small"
              onClick={handleFullscreen}
            />
          </Tooltip>
          
          <Dropdown
            menu={{
              items: previewMenuItems,
              onClick: handlePreviewMenuClick,
            }}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              size="small"
            />
          </Dropdown>
        </Space>
      </div>

      {/* 预览内容区域 */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
        <div
          className={cn(
            'relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden',
            'transition-all duration-300'
          )}
          style={{
            width: currentDevice === 'desktop' ? '100%' : currentPreset.width,
            height: currentDevice === 'desktop' ? '100%' : currentPreset.height,
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
          {/* 设备框架装饰 */}
          {currentDevice !== 'desktop' && (
            <div className={cn(
              'absolute inset-0 pointer-events-none',
              'border-8 border-gray-800 dark:border-gray-600 rounded-lg'
            )}>
              {/* 手机顶部装饰 */}
              {currentDevice === 'mobile' && (
                <div className={cn(
                  'absolute top-2 left-1/2 transform -translate-x-1/2',
                  'w-16 h-1 bg-gray-600 rounded-full'
                )} />
              )}
            </div>
          )}

          {/* 预览 iframe */}
          <iframe
            ref={iframeRef}
            src={previewUrl}
            className="w-full h-full border-0"
            title="项目预览"
            onLoad={() => setIsLoading(false)}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />

          {/* 加载遮罩 */}
          {isLoading && (
            <div className={cn(
              'absolute inset-0 bg-white/80 dark:bg-gray-900/80',
              'flex items-center justify-center'
            )}>
              <div className="text-center">
                <Spin size="large" />
                <div className="mt-2 text-gray-600 dark:text-gray-400">
                  正在加载预览...
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 预览信息栏 */}
      <div className={cn(
        'px-3 py-2 text-xs',
        'bg-gray-50 dark:bg-gray-800',
        'border-t border-gray-200 dark:border-gray-700',
        'text-gray-500 dark:text-gray-400'
      )}>
        <div className="flex items-center justify-between">
          <span>
            {currentPreset.name}: {currentPreset.width} × {currentPreset.height}
          </span>
          <span>
            {previewUrl}
          </span>
        </div>
      </div>
    </div>
  )
}
