import React, { useState } from 'react'
import { Button, Input, Typography, Tooltip } from 'antd'
import { Plus, Layout, Puzzle } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { useWorkspaceStore } from '../store/useWorkspaceStore'
import { CustomTree, TreeNode } from './CustomTree'
import { FileIcon } from './FileIcons'

const { Text } = Typography
const { Search } = Input

/**
 * 项目资源侧边栏组件
 * 采用 GitHub Codespaces 风格的树形结构管理页面和组件
 */
export const ProjectSidebarNew: React.FC = () => {
  const { selectedPageId, setSelectedPage, setSelectedComponent } = useWorkspaceStore()
  const [searchValue, setSearchValue] = useState('')
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['pages', 'page-1', 'page-2'])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([selectedPageId || 'page-1'])

  // 构建树形数据结构 - 页面管理，每个页面下包含组件
  const treeData: TreeNode[] = [
    {
      key: 'pages',
      title: '页面',
      icon: <FileIcon type="folder" />,
      type: 'folder',
      children: [
        {
          key: 'page-1',
          title: '首页',
          icon: <FileIcon type="page" />,
          type: 'page',
          children: [
            {
              key: 'comp-header-nav',
              title: 'HeaderNav',
              icon: <FileIcon type="component" />,
              type: 'component',
              isLeaf: true,
            },
            {
              key: 'comp-hero',
              title: 'HeroSection',
              icon: <FileIcon type="component" />,
              type: 'component',
              isLeaf: true,
            },
            {
              key: 'comp-features',
              title: 'FeatureGrid',
              icon: <FileIcon type="component" />,
              type: 'component',
              isLeaf: true,
            },
            {
              key: 'comp-footer',
              title: 'FooterSection',
              icon: <FileIcon type="component" />,
              type: 'component',
              isLeaf: true,
            },
          ],
        },
        {
          key: 'page-2',
          title: '产品列表',
          icon: <FileIcon type="page" />,
          type: 'page',
          children: [
            {
              key: 'comp-product-card',
              title: 'ProductCard',
              icon: <FileIcon type="component" />,
              type: 'component',
              isLeaf: true,
            },
            {
              key: 'comp-filter',
              title: 'FilterSidebar',
              icon: <FileIcon type="component" />,
              type: 'component',
              isLeaf: true,
            },
            {
              key: 'comp-search',
              title: 'SearchBar',
              icon: <FileIcon type="component" />,
              type: 'component',
              isLeaf: true,
            },
            {
              key: 'comp-pagination',
              title: 'Pagination',
              icon: <FileIcon type="component" />,
              type: 'component',
              isLeaf: true,
            },
          ],
        },
        {
          key: 'page-3',
          title: '产品详情',
          icon: <FileIcon type="page" />,
          type: 'page',
          children: [
            {
              key: 'comp-gallery',
              title: 'ProductGallery',
              icon: <FileIcon type="component" />,
              type: 'component',
              isLeaf: true,
            },
            {
              key: 'comp-info',
              title: 'ProductInfo',
              icon: <FileIcon type="component" />,
              type: 'component',
              isLeaf: true,
            },
            {
              key: 'comp-reviews',
              title: 'ReviewSection',
              icon: <FileIcon type="component" />,
              type: 'component',
              isLeaf: true,
            },
            {
              key: 'comp-related',
              title: 'RelatedProducts',
              icon: <FileIcon type="component" />,
              type: 'component',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      key: 'components',
      title: '组件库',
      icon: <FileIcon type="folder" />,
      type: 'folder',
      children: [
        {
          key: 'comp-button',
          title: 'Button',
          icon: <FileIcon type="component" />,
          type: 'component',
          isLeaf: true,
        },
        {
          key: 'comp-input',
          title: 'Input',
          icon: <FileIcon type="component" />,
          type: 'component',
          isLeaf: true,
        },
        {
          key: 'comp-modal',
          title: 'Modal',
          icon: <FileIcon type="component" />,
          type: 'component',
          isLeaf: true,
        },
        {
          key: 'comp-table',
          title: 'Table',
          icon: <FileIcon type="component" />,
          type: 'component',
          isLeaf: true,
        },
      ],
    },
  ]

  const handleSelect = (keys: string[], node: TreeNode) => {
    setSelectedKeys(keys)
    const selectedKey = keys[0]

    if (selectedKey) {
      // 根据选中的节点类型进行不同的处理
      if (node.type === 'page') {
        setSelectedPage(selectedKey)
        // 清除组件选择
        setSelectedComponent('')
      } else if (node.type === 'component') {
        setSelectedComponent(selectedKey)
        // 如果选择组件，也需要设置对应的页面
        const pageKey = findParentPage(selectedKey)
        if (pageKey) {
          setSelectedPage(pageKey)
        }
      }
    }
  }

  // 查找组件所属的页面
  const findParentPage = (componentKey: string): string | null => {
    for (const page of treeData) {
      if (page.children) {
        for (const pageItem of page.children) {
          if (pageItem.children) {
            for (const component of pageItem.children) {
              if (component.key === componentKey) {
                return pageItem.key
              }
            }
          }
        }
      }
    }
    return null
  }

  const handleExpand = (keys: string[]) => {
    setExpandedKeys(keys)
  }

  const handleAddPage = () => {
    console.log('添加页面')
  }

  const handleAddComponent = () => {
    console.log('添加组件')
  }

  return (
    <div className={cn('h-full flex flex-col', 'bg-white dark:bg-gray-900')}>
      {/* 头部搜索 */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <Search
          placeholder="搜索文件..."
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          size="small"
          className="text-sm"
        />
      </div>

      {/* 文件树 */}
      <div className="flex-1 overflow-auto">
        <CustomTree
          treeData={treeData}
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          onSelect={handleSelect}
          onExpand={handleExpand}
          className="p-2"
        />
      </div>

      {/* 底部操作区域 */}
      <div
        className={cn(
          'p-3 border-t border-gray-200 dark:border-gray-700',
          'bg-gray-50 dark:bg-gray-800'
        )}
      >
        <div className="flex gap-2">
          <Tooltip title="添加页面">
            <Button
              type="dashed"
              icon={<Layout className="w-4 h-4" />}
              size="small"
              onClick={handleAddPage}
              className="flex-1"
            >
              页面
            </Button>
          </Tooltip>

          <Tooltip title="添加组件">
            <Button
              type="dashed"
              icon={<Puzzle className="w-4 h-4" />}
              size="small"
              onClick={handleAddComponent}
              className="flex-1"
            >
              组件
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
