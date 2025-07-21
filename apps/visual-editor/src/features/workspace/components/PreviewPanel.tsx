import React, { useState, useRef } from 'react'
import { Button, Space, Dropdown, Typography, Select, Tooltip, Spin, Card } from 'antd'
import {
  RotateCcw,
  Maximize,
  Smartphone,
  Tablet,
  Monitor,
  MoreHorizontal,
  Download,
  Bug,
} from 'lucide-react'
import type { MenuProps } from 'antd'
import { cn } from '../../../utils/cn'
import { useWorkspaceStore } from '../store/useWorkspaceStore'

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
  const { selectedPageId, selectedComponentId } = useWorkspaceStore()
  const [isLoading, setIsLoading] = useState(false)
  const [currentDevice, setCurrentDevice] = useState('desktop')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // 设备预设
  const devicePresets: Record<string, DevicePreset> = {
    mobile: {
      name: '手机',
      width: 375,
      height: 667,
      icon: <Smartphone className="w-4 h-4" />,
    },
    tablet: {
      name: '平板',
      width: 768,
      height: 1024,
      icon: <Tablet className="w-4 h-4" />,
    },
    desktop: {
      name: '桌面',
      width: 1200,
      height: 800,
      icon: <Monitor className="w-4 h-4" />,
    },
  }

  // 预览操作菜单
  const previewMenuItems: MenuProps['items'] = [
    {
      key: 'console',
      icon: <Bug className="w-4 h-4" />,
      label: '打开控制台',
    },
    {
      key: 'export',
      icon: <Download className="w-4 h-4" />,
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

  // 模拟页面内容
  const renderPageContent = () => {
    // 根据选中的页面ID渲染不同内容
    switch (selectedPageId) {
      case 'page-1': // 首页
        return (
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-full">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <header className="flex items-center justify-between mb-8 p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
                  <span className="font-bold text-xl">PixelMind</span>
                </div>
                <nav className="flex gap-6">
                  <a href="#" className="text-gray-600 hover:text-blue-500">
                    首页
                  </a>
                  <a href="#" className="text-gray-600 hover:text-blue-500">
                    产品
                  </a>
                  <a href="#" className="text-gray-600 hover:text-blue-500">
                    关于
                  </a>
                </nav>
              </header>

              {/* Hero Section */}
              <section className="text-center mb-12 p-8 bg-white rounded-xl shadow-sm">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">🚀 欢迎来到 PixelMind AI</h1>
                <p className="text-xl text-gray-600 mb-6">智能化的可视化网站构建平台</p>
                <div className="flex gap-4 justify-center">
                  <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    开始创建
                  </button>
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    了解更多
                  </button>
                </div>
              </section>

              {/* Features */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">可视化设计</h3>
                  <p className="text-gray-600">拖拽式界面设计，无需编程知识</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">AI 助手</h3>
                  <p className="text-gray-600">智能代码生成和设计建议</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">快速部署</h3>
                  <p className="text-gray-600">一键发布到云端</p>
                </div>
              </section>
            </div>
          </div>
        )
      case 'page-2': // 产品列表
        return (
          <div className="p-6 bg-gray-50 min-h-full">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">产品列表</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500"></div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">产品 {i}</h3>
                      <p className="text-gray-600 mb-4">这是产品 {i} 的描述信息</p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-blue-500">¥{i * 99}</span>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                          查看详情
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              <div className="text-6xl mb-4">🎨</div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">选择页面预览</h2>
              <p className="text-gray-500">从左侧选择页面或组件来查看预览</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* 预览头部 */}
      <div
        className={cn(
          'flex items-center justify-between px-3 py-2',
          'bg-gray-50 dark:bg-gray-800',
          'border-b border-gray-200 dark:border-gray-700'
        )}
      >
        <div className="flex items-center gap-3">
          <Text className="font-sm text-gray-900 dark:text-gray-100">实时预览</Text>

          {isLoading && <Spin size="small" />}
        </div>

        <Space size="small">
          {/* 设备选择 */}
          <Select value={currentDevice} onChange={handleDeviceChange} size="small" className="w-24">
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
              icon={<RotateCcw className="w-4 h-4" />}
              size="small"
              onClick={handleRefresh}
              loading={isLoading}
              className="!border-none"
            />
          </Tooltip>

          <Tooltip title="全屏预览">
            <Button
              type="text"
              icon={<Maximize className="w-4 h-4" />}
              size="small"
              onClick={handleFullscreen}
              className="!border-none"
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
              className="!border-none"
              icon={<MoreHorizontal className="w-4 h-4" />}
              size="small"
            />
          </Dropdown>
        </Space>
      </div>

      {/* 预览内容区域 */}
      <div className="flex-1 flex items-center justify-center p-0 bg-gray-100 dark:bg-gray-900">
        <div
          className={cn(
            'relative bg-white dark:bg-gray-800 overflow-hidden',
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
            <div
              className={cn(
                'absolute inset-0 pointer-events-none',
                'border-8 border-gray-800 dark:border-gray-600 rounded-lg'
              )}
            >
              {/* 手机顶部装饰 */}
              {currentDevice === 'mobile' && (
                <div
                  className={cn(
                    'absolute top-2 left-1/2 transform -translate-x-1/2',
                    'w-16 h-1 bg-gray-600 rounded-full'
                  )}
                />
              )}
            </div>
          )}

          {/* 预览内容 */}
          <div className="w-full h-full overflow-auto">{renderPageContent()}</div>

          {/* 加载遮罩 */}
          {isLoading && (
            <div
              className={cn(
                'absolute inset-0 bg-white/80 dark:bg-gray-900/80',
                'flex items-center justify-center'
              )}
            >
              <div className="text-center">
                <Spin size="large" />
                <div className="mt-2 text-gray-600 dark:text-gray-400">正在加载预览...</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 预览信息栏 */}
      <div
        className={cn(
          'px-3 py-2 text-xs',
          'bg-gray-50 dark:bg-gray-800',
          'border-t border-gray-200 dark:border-gray-700',
          'text-gray-500 dark:text-gray-400'
        )}
      >
        <div className="flex items-center justify-between">
          <span>
            {currentPreset.name}: {currentPreset.width} × {currentPreset.height}
          </span>
          <span>
            预览模式:{' '}
            {selectedPageId === 'page-1'
              ? '首页'
              : selectedPageId === 'page-2'
                ? '产品列表'
                : selectedPageId === 'page-3'
                  ? '产品详情'
                  : selectedPageId === 'page-4'
                    ? '关于我们'
                    : selectedComponentId
                      ? '组件预览'
                      : '选择页面'}
          </span>
        </div>
      </div>
    </div>
  )
}
