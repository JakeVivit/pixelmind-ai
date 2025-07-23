import React, { useState } from 'react'
import { Typography, Badge, Tooltip } from 'antd'
import {
  FileText,
  Route,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react'
import type { PageInfo, RouteInfo } from '../types/page'
import { cn } from '../../../utils/cn'

const { Text } = Typography

interface CustomPageTreeProps {
  pages: PageInfo[]
  routes: RouteInfo[]
  selectedPageId?: string
  onPageSelect?: (pageId: string) => void
  loading?: boolean
}

/**
 * 自定义页面树形组件
 * 替换 Antd Tree，提供更好的控制和样式
 */
export const CustomPageTree: React.FC<CustomPageTreeProps> = ({
  pages,
  routes,
  selectedPageId,
  onPageSelect,
  loading = false,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['routes', 'pages']))

  // 切换节点展开状态
  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  // 获取复杂度徽章
  const getComplexityBadge = (complexity: 'low' | 'medium' | 'high') => {
    const config = {
      low: { color: 'green', icon: CheckCircle },
      medium: { color: 'orange', icon: Clock },
      high: { color: 'red', icon: AlertCircle },
    }

    const { color, icon: Icon } = config[complexity]

    return (
      <div
        className={cn(
          'w-2 h-2 rounded-full',
          color === 'green' && 'bg-green-400',
          color === 'orange' && 'bg-orange-400',
          color === 'red' && 'bg-red-400'
        )}
      />
    )
  }

  // 处理页面选择
  const handlePageSelect = (pageId: string) => {
    onPageSelect?.(pageId)
  }

  // 渲染路由节点
  const renderRouteNode = (route: RouteInfo, level: number = 0) => {
    const page = pages.find(p => p.route.id === route.id)
    const nodeId = `route-${route.id}`
    const isExpanded = expandedNodes.has(nodeId)
    const hasChildren = route.children && route.children.length > 0
    const isSelected = page?.id === selectedPageId

    return (
      <div key={route.id}>
        <div
          className={cn(
            'flex items-center gap-2 px-3 cursor-pointer rounded-md transition-colors',
            isSelected && '!text-indigo-600',
            level > 0 && 'ml-4'
          )}
          onClick={() => page && handlePageSelect(page.id)}
        >
          {/* 展开/收起图标 */}
          {hasChildren && (
            <button
              onClick={e => {
                e.stopPropagation()
                toggleExpanded(nodeId)
              }}
              className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-gray-500" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-500" />
              )}
            </button>
          )}

          {/* 路由图标 */}
          {/* <Route className="w-4 h-4 text-blue-500 flex-shrink-0" /> */}

          {/* 路由信息 */}
          <div className="flex-1 min-w-0 pl-10 py-1 pr-3">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <Text className="font-mono text-sm truncate">{route.path}</Text>
                <Text type="secondary" className="text-xs block truncate">
                  {route.component}
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* 子路由 */}
        {hasChildren && isExpanded && (
          <div className="ml-2">
            {route.children!.map(childRoute => renderRouteNode(childRoute, level + 1))}
          </div>
        )}
      </div>
    )
  }

  // 渲染页面节点
  const renderPageNode = (page: PageInfo) => {
    const isSelected = page.id === selectedPageId

    return (
      <div
        key={page.id}
        className={cn(
          'flex items-center gap-2  cursor-pointer rounded-md transition-colors ml-4',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          isSelected && 'bg-blue-50 dark:bg-blue-900/20 '
        )}
        onClick={() => handlePageSelect(page.id)}
      >
        {/* 页面图标 */}
        {/* <FileText className="w-4 h-4 text-green-500 flex-shrink-0" /> */}

        {/* 页面信息 */}
        <div className="flex-1 min-w-0 pl-10 py-1 pr-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <Text strong className="text-sm truncate">
                {page.name}
              </Text>
              <Text type="secondary" className="text-xs block truncate">
                {page.analysis.usage.length} 组件 · {page.lines} 行
              </Text>
            </div>

            {/* 复杂度指示器 */}
            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
              {getComplexityBadge(page.analysis.complexity)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (routes.length === 0 && pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-gray-500">
        <FileText className="w-8 h-8 mb-2" />
        <Text type="secondary">暂无页面数据</Text>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {/* 路由分组 */}
      {routes.length > 0 && (
        <div>
          <div
            className="flex items-center gap-2 py-2 px-3 cursor-pointer rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => toggleExpanded('routes')}
          >
            {expandedNodes.has('routes') ? (
              <ChevronDown className="w-3 h-3 text-gray-500" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-500" />
            )}
            <Route className="w-4 h-4 text-blue-500" />
            <Text strong className="text-sm">
              路由 ({routes.length})
            </Text>
          </div>

          {expandedNodes.has('routes') && <div>{routes.map(route => renderRouteNode(route))}</div>}
        </div>
      )}

      {/* 页面分组 */}
      {pages.length > 0 && (
        <div>
          <div
            className="flex items-center gap-2 py-2 px-3 cursor-pointer rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => toggleExpanded('pages')}
          >
            {expandedNodes.has('pages') ? (
              <ChevronDown className="w-3 h-3 text-gray-500" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-500" />
            )}
            <FileText className="w-4 h-4 text-green-500" />
            <Text strong className="text-sm">
              页面 ({pages.length})
            </Text>
          </div>

          {expandedNodes.has('pages') && <div>{pages.map(page => renderPageNode(page))}</div>}
        </div>
      )}
    </div>
  )
}
