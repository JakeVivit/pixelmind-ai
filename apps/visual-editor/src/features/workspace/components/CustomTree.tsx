import React, { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '../../../utils/cn'

export interface TreeNode {
  key: string
  title: string
  icon?: React.ReactNode
  children?: TreeNode[]
  isLeaf?: boolean
  type?: 'folder' | 'file' | 'component'
}

interface CustomTreeProps {
  treeData: TreeNode[]
  selectedKeys?: string[]
  expandedKeys?: string[]
  onSelect?: (keys: string[], node: TreeNode) => void
  onExpand?: (keys: string[]) => void
  className?: string
}

export const CustomTree: React.FC<CustomTreeProps> = ({
  treeData,
  selectedKeys = [],
  expandedKeys = [],
  onSelect,
  onExpand,
  className,
}) => {
  const [internalExpandedKeys, setInternalExpandedKeys] = useState<string[]>(expandedKeys)
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<string[]>(selectedKeys)

  const currentExpandedKeys = expandedKeys.length > 0 ? expandedKeys : internalExpandedKeys
  const currentSelectedKeys = selectedKeys.length > 0 ? selectedKeys : internalSelectedKeys

  const handleToggle = (key: string) => {
    const newExpandedKeys = currentExpandedKeys.includes(key)
      ? currentExpandedKeys.filter(k => k !== key)
      : [...currentExpandedKeys, key]

    setInternalExpandedKeys(newExpandedKeys)
    onExpand?.(newExpandedKeys)
  }

  const handleSelect = (key: string, node: TreeNode) => {
    const newSelectedKeys = [key]
    setInternalSelectedKeys(newSelectedKeys)
    onSelect?.(newSelectedKeys, node)
  }

  const renderTreeNode = (node: TreeNode, level: number = 0): React.ReactNode => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = currentExpandedKeys.includes(node.key)
    const isSelected = currentSelectedKeys.includes(node.key)
    const paddingLeft = level * 16 + 8 // 每级缩进 16px

    return (
      <div key={node.key}>
        {/* 节点内容 */}
        <div
          className={cn(
            'flex items-center h-6 cursor-pointer text-sm',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
            'transition-colors duration-150',
            isSelected && 'bg-blue-50 dark:bg-blue-900/20'
          )}
          style={{ paddingLeft: `${paddingLeft}px` }}
          onClick={() => handleSelect(node.key, node)}
        >
          {/* 展开/折叠图标 */}
          <div
            className="w-4 h-4 flex items-center justify-center mr-1"
            onClick={e => {
              e.stopPropagation()
              if (hasChildren) {
                handleToggle(node.key)
              }
            }}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="w-3 h-3 text-gray-500" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-500" />
              )
            ) : (
              <div className="w-3 h-3" />
            )}
          </div>

          {/* 文件/文件夹图标 */}
          <div className="w-4 h-4 flex items-center justify-center mr-2">{node.icon}</div>

          {/* 标题 */}
          <span
            className={cn(
              'flex-1 truncate',
              'text-gray-700 dark:text-gray-300',
              isSelected && 'text-blue-600 dark:text-blue-400'
            )}
          >
            {node.title}
          </span>
        </div>

        {/* 子节点 */}
        {hasChildren && isExpanded && (
          <div>{node.children!.map(child => renderTreeNode(child, level + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('text-sm', className)}>{treeData.map(node => renderTreeNode(node))}</div>
  )
}
