import React from 'react'
import { Card, Typography, Tag, Divider, List, Progress, Tooltip, Space } from 'antd'
import {
  FileText,
  Route,
  Component,
  Package,
  Clock,
  Code,
  Eye,
  AlertCircle,
  CheckCircle,
  Zap,
} from 'lucide-react'
import type { PageInfo } from '../types/page'
import { cn } from '../../../utils/cn'

const { Title, Text, Paragraph } = Typography

interface PageDetailsProps {
  page: PageInfo | null
  className?: string
}

/**
 * 页面详情面板组件
 * 显示选中页面的详细信息
 */
export const PageDetails: React.FC<PageDetailsProps> = ({ page, className }) => {
  if (!page) {
    return (
      <div
        className={cn('flex flex-col items-center justify-center h-full text-gray-500', className)}
      >
        <FileText className="w-12 h-12 mb-4 opacity-50" />
        <Text type="secondary">请选择一个页面查看详情</Text>
      </div>
    )
  }

  // 获取复杂度配置
  const getComplexityConfig = (complexity: 'low' | 'medium' | 'high') => {
    const configs = {
      low: {
        color: 'green',
        icon: CheckCircle,
        text: '简单',
        percent: 30,
        description: '代码结构简单，易于维护',
      },
      medium: {
        color: 'orange',
        icon: Clock,
        text: '中等',
        percent: 60,
        description: '代码复杂度适中，需要注意维护',
      },
      high: {
        color: 'red',
        icon: AlertCircle,
        text: '复杂',
        percent: 90,
        description: '代码复杂度较高，建议重构优化',
      },
    }
    return configs[complexity]
  }

  const complexityConfig = getComplexityConfig(page.analysis.complexity)

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // 格式化日期
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* 页面基本信息 */}
      <Card size="small">
        <div className="flex items-start justify-between mb-3">
          <div>
            <Title level={5} className="!mb-1">
              {page.name}
            </Title>
            <Text type="secondary" className="text-sm">
              {page.route.path}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <Tag
              color={complexityConfig.color}
              icon={<complexityConfig.icon className="w-3 h-3" />}
            >
              {complexityConfig.text}
            </Tag>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Code className="w-3 h-3 text-gray-500" />
              <Text type="secondary">代码行数</Text>
            </div>
            <Text strong>{page.lines}</Text>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Package className="w-3 h-3 text-gray-500" />
              <Text type="secondary">文件大小</Text>
            </div>
            <Text strong>{formatFileSize(page.size)}</Text>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Component className="w-3 h-3 text-gray-500" />
              <Text type="secondary">组件数量</Text>
            </div>
            <Text strong>{page.analysis.usage.length}</Text>
          </div>
        </div>
      </Card>

      {/* 复杂度分析 */}
      <Card
        size="small"
        title={
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>复杂度分析</span>
          </div>
        }
      >
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Text>复杂度评分</Text>
              <Text strong>{complexityConfig.text}</Text>
            </div>
            <Progress
              percent={complexityConfig.percent}
              strokeColor={complexityConfig.color}
              size="small"
            />
            <Text type="secondary" className="text-xs mt-1 block">
              {complexityConfig.description}
            </Text>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <Text type="secondary">状态管理</Text>
              <Tag size="small" color={page.analysis.hasState ? 'orange' : 'default'}>
                {page.analysis.hasState ? '是' : '否'}
              </Tag>
            </div>
            <div className="flex items-center justify-between">
              <Text type="secondary">副作用</Text>
              <Tag size="small" color={page.analysis.hasEffects ? 'purple' : 'default'}>
                {page.analysis.hasEffects ? '是' : '否'}
              </Tag>
            </div>
          </div>
        </div>
      </Card>

      {/* 使用的组件 */}
      <Card
        size="small"
        title={
          <div className="flex items-center gap-2">
            <Component className="w-4 h-4" />
            <span>使用的组件 ({page.analysis.usage.length})</span>
          </div>
        }
      >
        {page.analysis.usage.length > 0 ? (
          <List
            size="small"
            dataSource={page.analysis.usage}
            renderItem={usage => (
              <List.Item className="!px-0 !py-1">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1 min-w-0">
                    <Component className="w-3 h-3 text-gray-500 flex-shrink-0" />
                    <Text className="text-xs truncate">{usage.component}</Text>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Tag size="small" className="text-xs">
                      {usage.count}次
                    </Tag>
                  </div>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary" className="text-sm">
            暂无组件使用
          </Text>
        )}
      </Card>

      {/* React Hooks */}
      {page.analysis.hooks.length > 0 && (
        <Card
          size="small"
          title={
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>React Hooks ({page.analysis.hooks.length})</span>
            </div>
          }
        >
          <div className="flex flex-wrap gap-1">
            {page.analysis.hooks.map((hook, index) => (
              <Tag key={index} size="small" color="cyan">
                {hook}
              </Tag>
            ))}
          </div>
        </Card>
      )}

      {/* 依赖导入 */}
      <Card
        size="small"
        title={
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            <span>依赖导入</span>
          </div>
        }
      >
        <div className="space-y-3">
          {page.analysis.imports.react.length > 0 && (
            <div>
              <Text type="secondary" className="text-xs">
                React:
              </Text>
              <div className="flex flex-wrap gap-1 mt-1">
                {page.analysis.imports.react.map((imp, index) => (
                  <Tag key={index} size="small" color="blue">
                    {imp}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {page.analysis.imports.ui.length > 0 && (
            <div>
              <Text type="secondary" className="text-xs">
                UI 组件:
              </Text>
              <div className="flex flex-wrap gap-1 mt-1">
                {page.analysis.imports.ui.map((imp, index) => (
                  <Tag key={index} size="small" color="green">
                    {imp}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {page.analysis.imports.router.length > 0 && (
            <div>
              <Text type="secondary" className="text-xs">
                路由:
              </Text>
              <div className="flex flex-wrap gap-1 mt-1">
                {page.analysis.imports.router.map((imp, index) => (
                  <Tag key={index} size="small" color="orange">
                    {imp}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {page.analysis.imports.utils.length > 0 && (
            <div>
              <Text type="secondary" className="text-xs">
                工具:
              </Text>
              <div className="flex flex-wrap gap-1 mt-1">
                {page.analysis.imports.utils.map((imp, index) => (
                  <Tag key={index} size="small" color="purple">
                    {imp}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {page.analysis.imports.custom.length > 0 && (
            <div>
              <Text type="secondary" className="text-xs">
                自定义:
              </Text>
              <div className="flex flex-wrap gap-1 mt-1">
                {page.analysis.imports.custom.map((imp, index) => (
                  <Tag key={index} size="small" color="default">
                    {imp}
                  </Tag>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 路由信息 */}
      <Card
        size="small"
        title={
          <div className="flex items-center gap-2">
            <Route className="w-4 h-4" />
            <span>路由信息</span>
          </div>
        }
      >
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <Text type="secondary">路径</Text>
            <Text code className="text-xs">
              {page.route.path}
            </Text>
          </div>
          <div className="flex items-center justify-between">
            <Text type="secondary">组件</Text>
            <Text strong className="text-xs">
              {page.route.component}
            </Text>
          </div>
          <div>
            <Text type="secondary" className="block mb-1">
              文件
            </Text>
            <Text code className="text-xs break-all">
              {page.route.filePath}
            </Text>
          </div>
          {page.route.isExact && (
            <div className="flex items-center justify-between">
              <Text type="secondary">精确匹配</Text>
              <Tag size="small" color="blue">
                是
              </Tag>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
