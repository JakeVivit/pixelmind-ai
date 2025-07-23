import React from 'react'
import { Tree, Badge, Tooltip, Typography } from 'antd'
import { FileText, Route, Component, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import type { PageInfo, RouteInfo } from '../types/page'
import { cn } from '../../../utils/cn'

const { Text } = Typography

interface PageTreeProps {
  pages: PageInfo[]
  routes: RouteInfo[]
  selectedPageId?: string
  onPageSelect?: (pageId: string) => void
  loading?: boolean
}

interface TreeNodeData {
  key: string
  title: React.ReactNode
  icon: React.ReactNode
  children?: TreeNodeData[]
  isLeaf?: boolean
  pageInfo?: PageInfo
  routeInfo?: RouteInfo
}

/**
 * 页面树形结构组件
 * 显示项目的页面和路由层次结构
 */
export const PageTree: React.FC<PageTreeProps> = ({
  pages,
  routes,
  selectedPageId,
  onPageSelect,
  loading = false,
}) => {
  // 构建树形数据
  const buildTreeData = (): TreeNodeData[] => {
    const treeData: TreeNodeData[] = []

    // 添加路由节点
    const routeNodes = buildRouteNodes(routes)
    if (routeNodes.length > 0) {
      treeData.push({
        key: 'routes',
        title: (
          <div className="flex items-center gap-2">
            <Text strong className="text-xs">
              路由 ({routes.length})
            </Text>
          </div>
        ),
        icon: <Route className="w-3 h-3 text-blue-500" />,
        children: routeNodes,
      })
    }

    // 添加页面节点
    const pageNodes = buildPageNodes(pages)
    if (pageNodes.length > 0) {
      treeData.push({
        key: 'pages',
        title: (
          <div className="flex items-center gap-2">
            <Text strong className="text-xs">
              页面 ({pages.length})
            </Text>
          </div>
        ),
        icon: <FileText className="w-3 h-3 text-green-500" />,
        children: pageNodes,
      })
    }

    return treeData
  }

  // 构建路由节点
  const buildRouteNodes = (routeList: RouteInfo[]): TreeNodeData[] => {
    return routeList.map(route => {
      const page = pages.find(p => p.route.id === route.id)

      return {
        key: `route-${route.id}`,
        title: (
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-0">
              <Text className="font-mono text-xs">{route.path}</Text>
              <Text type="secondary" className="text-xs opacity-70">
                {route.component}
              </Text>
            </div>
            {page && (
              <div className="flex items-center gap-1">
                {getComplexityBadge(page.analysis.complexity)}
              </div>
            )}
          </div>
        ),
        isLeaf: !route.children || route.children.length === 0,
        children: route.children ? buildRouteNodes(route.children) : undefined,
        routeInfo: route,
        pageInfo: page,
      }
    })
  }

  // 构建页面节点
  const buildPageNodes = (pageList: PageInfo[]): TreeNodeData[] => {
    return pageList.map(page => ({
      key: `page-${page.id}`,
      title: (
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-0">
            <Text strong className="text-xs">
              {page.name}
            </Text>
            <Text type="secondary" className="text-xs opacity-70">
              {page.analysis.usage.length} 组件 · {page.lines} 行
            </Text>
          </div>
          <div className="flex items-center gap-1">
            {getComplexityBadge(page.analysis.complexity)}
          </div>
        </div>
      ),
      isLeaf: true,
      pageInfo: page,
    }))
  }

  // 获取复杂度徽章
  const getComplexityBadge = (complexity: 'low' | 'medium' | 'high') => {
    const config = {
      low: { color: 'green', icon: CheckCircle, text: '简单' },
      medium: { color: 'orange', icon: Clock, text: '中等' },
      high: { color: 'red', icon: AlertCircle, text: '复杂' },
    }

    const { color, icon: Icon, text } = config[complexity]

    return (
      <Tooltip title={`复杂度: ${text}`}>
        <Badge color={color} size="small" count={<Icon className="w-3 h-3" />} />
      </Tooltip>
    )
  }

  // 处理节点选择
  const handleSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const key = selectedKeys[0] as string

      // 提取页面 ID
      if (key.startsWith('page-')) {
        const pageId = key.replace('page-', '')
        onPageSelect?.(pageId)
      } else if (key.startsWith('route-')) {
        const routeId = key.replace('route-', '')
        const page = pages.find(p => p.route.id === routeId)
        if (page) {
          onPageSelect?.(page.id)
        }
      }
    }
  }

  // 自定义节点渲染
  const renderTreeNode = (nodeData: TreeNodeData) => {
    const isSelected = nodeData.pageInfo?.id === selectedPageId

    return (
      <div
        className={cn(
          'flex items-center gap-2 p-1 rounded transition-colors',
          isSelected && 'bg-blue-50 dark:bg-blue-900/20'
        )}
      >
        {nodeData.icon}
        <div className="flex-1 min-w-0">{nodeData.title}</div>
      </div>
    )
  }

  const treeData = buildTreeData()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (treeData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-gray-500">
        <FileText className="w-8 h-8 mb-2" />
        <Text type="secondary">暂无页面数据</Text>
      </div>
    )
  }

  return (
    <div className="page-tree">
      <Tree
        treeData={treeData}
        selectedKeys={selectedPageId ? [`page-${selectedPageId}`] : []}
        onSelect={handleSelect}
        showIcon
        defaultExpandAll
        className="custom-tree"
      />

      <style jsx>{`
        .page-tree :global(.ant-tree-node-content-wrapper) {
          width: 100%;
        }

        .page-tree :global(.ant-tree-title) {
          width: 100%;
        }

        .custom-tree :global(.ant-tree-treenode) {
          padding: 2px 0;
        }

        .custom-tree :global(.ant-tree-node-content-wrapper:hover) {
          background-color: rgba(59, 130, 246, 0.1);
        }

        .custom-tree :global(.ant-tree-node-selected) {
          background-color: rgba(59, 130, 246, 0.2) !important;
        }
      `}</style>
    </div>
  )
}
