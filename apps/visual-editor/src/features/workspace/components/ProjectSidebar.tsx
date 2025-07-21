import React, { useState } from 'react'
import { Tabs, Tree, Button, Input, Space, Typography, Tooltip } from 'antd'
import {
  FolderOutlined,
  FolderOpenOutlined,
  FileOutlined,
  SearchOutlined,
  PlusOutlined,
  MoreOutlined,
  FileTextOutlined,
  CodeOutlined,
  BgColorsOutlined,
  AppstoreOutlined,
} from '@ant-design/icons'
import type { TreeDataNode } from 'antd'
import { cn } from '../../../utils/cn'

const { Text } = Typography
const { Search } = Input

/**
 * 项目侧边栏组件
 * 包含文件树、组件库、模板等功能
 */
export const ProjectSidebar: React.FC = () => {
  const [searchValue, setSearchValue] = useState('')
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['src', 'components'])

  // 模拟文件树数据
  const fileTreeData: TreeDataNode[] = [
    {
      title: 'src',
      key: 'src',
      icon: <FolderOutlined />,
      children: [
        {
          title: 'components',
          key: 'components',
          icon: <FolderOutlined />,
          children: [
            {
              title: 'App.tsx',
              key: 'App.tsx',
              icon: <CodeOutlined className="text-blue-500" />,
              isLeaf: true,
            },
            {
              title: 'Header.tsx',
              key: 'Header.tsx',
              icon: <CodeOutlined className="text-blue-500" />,
              isLeaf: true,
            },
          ],
        },
        {
          title: 'styles',
          key: 'styles',
          icon: <FolderOutlined />,
          children: [
            {
              title: 'globals.css',
              key: 'globals.css',
              icon: <BgColorsOutlined className="text-purple-500" />,
              isLeaf: true,
            },
          ],
        },
        {
          title: 'utils',
          key: 'utils',
          icon: <FolderOutlined />,
          children: [
            {
              title: 'helpers.ts',
              key: 'helpers.ts',
              icon: <FileTextOutlined className="text-yellow-500" />,
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'public',
      key: 'public',
      icon: <FolderOutlined />,
      children: [
        {
          title: 'index.html',
          key: 'index.html',
          icon: <FileOutlined className="text-orange-500" />,
          isLeaf: true,
        },
      ],
    },
    {
      title: 'package.json',
      key: 'package.json',
      icon: <FileTextOutlined className="text-green-500" />,
      isLeaf: true,
    },
  ]

  // 组件库数据
  const componentLibrary = [
    { name: 'Button', category: '基础组件', icon: '🔘' },
    { name: 'Input', category: '基础组件', icon: '📝' },
    { name: 'Card', category: '数据展示', icon: '🃏' },
    { name: 'Table', category: '数据展示', icon: '📊' },
    { name: 'Form', category: '数据录入', icon: '📋' },
    { name: 'Modal', category: '反馈', icon: '🪟' },
  ]

  const handleFileSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      console.log('选中文件:', selectedKeys[0])
    }
  }

  const handleComponentDrag = (component: any) => {
    console.log('拖拽组件:', component.name)
  }

  const tabItems = [
    {
      key: 'files',
      label: '文件',
      icon: <FolderOutlined />,
      children: (
        <div className="p-2">
          {/* 搜索框 */}
          <div className="mb-3">
            <Search
              placeholder="搜索文件..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="text-sm"
            />
          </div>

          {/* 文件操作按钮 */}
          <div className="mb-3 flex gap-1">
            <Tooltip title="新建文件">
              <Button
                type="text"
                icon={<PlusOutlined />}
                size="small"
                className="w-8 h-8 p-0"
              />
            </Tooltip>
            <Tooltip title="新建文件夹">
              <Button
                type="text"
                icon={<FolderOutlined />}
                size="small"
                className="w-8 h-8 p-0"
              />
            </Tooltip>
            <Tooltip title="更多操作">
              <Button
                type="text"
                icon={<MoreOutlined />}
                size="small"
                className="w-8 h-8 p-0"
              />
            </Tooltip>
          </div>

          {/* 文件树 */}
          <Tree
            treeData={fileTreeData}
            expandedKeys={expandedKeys}
            onExpand={setExpandedKeys}
            onSelect={handleFileSelect}
            showIcon
            className={cn(
              '[&_.ant-tree-node-content-wrapper]:rounded-md',
              '[&_.ant-tree-node-content-wrapper]:transition-colors',
              '[&_.ant-tree-node-content-wrapper:hover]:bg-gray-100',
              '[&_.ant-tree-node-content-wrapper:hover]:dark:bg-gray-800',
              '[&_.ant-tree-node-selected]:bg-primary-50',
              '[&_.ant-tree-node-selected]:dark:bg-primary-950/50'
            )}
          />
        </div>
      ),
    },
    {
      key: 'components',
      label: '组件',
      icon: <AppstoreOutlined />,
      children: (
        <div className="p-2">
          <div className="mb-3">
            <Search
              placeholder="搜索组件..."
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            {componentLibrary.map((component) => (
              <div
                key={component.name}
                draggable
                onDragStart={() => handleComponentDrag(component)}
                className={cn(
                  'p-3 rounded-lg border border-gray-200 dark:border-gray-700',
                  'bg-white dark:bg-gray-800',
                  'hover:border-primary-300 dark:hover:border-primary-600',
                  'hover:shadow-sm cursor-grab active:cursor-grabbing',
                  'transition-all duration-200'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{component.icon}</span>
                  <div>
                    <Text className="font-medium text-gray-900 dark:text-gray-100">
                      {component.name}
                    </Text>
                    <br />
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      {component.category}
                    </Text>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: 'templates',
      label: '模板',
      icon: <FileTextOutlined />,
      children: (
        <div className="p-2">
          <Text className="text-gray-500 dark:text-gray-400 text-sm">
            模板功能开发中...
          </Text>
        </div>
      ),
    },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* 侧边栏头部 */}
      <div className={cn(
        'p-3 border-b border-gray-200 dark:border-gray-700',
        'bg-gray-50 dark:bg-gray-800'
      )}>
        <Text className="font-medium text-gray-900 dark:text-gray-100">
          项目资源
        </Text>
      </div>

      {/* 标签页内容 */}
      <div className="flex-1 overflow-hidden">
        <Tabs
          items={tabItems}
          size="small"
          className={cn(
            'h-full',
            '[&_.ant-tabs-content-holder]:h-full',
            '[&_.ant-tabs-tabpane]:h-full',
            '[&_.ant-tabs-tabpane]:overflow-auto'
          )}
        />
      </div>
    </div>
  )
}
