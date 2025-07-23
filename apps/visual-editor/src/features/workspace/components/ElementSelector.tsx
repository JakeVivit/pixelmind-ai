import React, { useState, useEffect } from 'react'
import { Button, Card, Typography, Tag, Tooltip, Space, Divider } from 'antd'
import { MousePointer, Target, X, Eye, Code, Layers, Info } from 'lucide-react'
import { ElementSelector as ElementSelectorService } from '../services/ElementSelector'
import type { ElementSelectorState, SelectedElement } from '../services/ElementSelector'
import { cn } from '../../../utils/cn'

const { Text, Title } = Typography

interface ElementSelectorProps {
  iframe: HTMLIFrameElement | null
  onElementSelected?: (element: SelectedElement) => void
  className?: string
}

/**
 * 元素选择器组件
 * 提供在 WebContainer 中选择元素的功能
 */
export const ElementSelector: React.FC<ElementSelectorProps> = ({
  iframe,
  onElementSelected,
  className,
}) => {
  const [state, setState] = useState<ElementSelectorState>({
    isSelecting: false,
    selectedElement: null,
    hoveredElement: null,
  })

  const elementSelector = ElementSelectorService.getInstance()

  // 初始化元素选择器
  useEffect(() => {
    if (iframe) {
      elementSelector.initialize(iframe)
    }
  }, [iframe, elementSelector])

  // 订阅状态变化
  useEffect(() => {
    const unsubscribe = elementSelector.subscribe(setState)
    return unsubscribe
  }, [elementSelector])

  // 当元素被选中时通知父组件
  useEffect(() => {
    if (state.selectedElement && onElementSelected) {
      onElementSelected(state.selectedElement)
    }
  }, [state.selectedElement, onElementSelected])

  // 开始选择
  const handleStartSelecting = () => {
    elementSelector.startSelecting()
  }

  // 停止选择
  const handleStopSelecting = () => {
    elementSelector.stopSelecting()
  }

  // 清除选择
  const handleClearSelection = () => {
    elementSelector.clearSelection()
  }

  // 渲染元素信息
  const renderElementInfo = (element: SelectedElement) => {
    return (
      <div className="space-y-3">
        {/* 基本信息 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-4 h-4 text-blue-500" />
            <Text strong className="text-sm">
              元素信息
            </Text>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <Text type="secondary">标签</Text>
              <Tag size="small" color="blue">
                {element.tagName}
              </Tag>
            </div>
            {element.className && (
              <div className="flex items-center justify-between">
                <Text type="secondary">类名</Text>
                <Text code className="text-xs break-all">
                  {element.className}
                </Text>
              </div>
            )}
            {element.id && (
              <div className="flex items-center justify-between">
                <Text type="secondary">ID</Text>
                <Text code className="text-xs">
                  #{element.id}
                </Text>
              </div>
            )}
          </div>
        </div>

        {/* 选择器信息 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-500" />
            <Text strong className="text-sm">
              选择器
            </Text>
          </div>
          <div className="space-y-1 text-xs">
            <div>
              <Text type="secondary" className="block mb-1">
                CSS 选择器
              </Text>
              <Text code className="text-xs break-all">
                {element.cssSelector}
              </Text>
            </div>
            <div>
              <Text type="secondary" className="block mb-1">
                XPath
              </Text>
              <Text code className="text-xs break-all">
                {element.xpath}
              </Text>
            </div>
          </div>
        </div>

        {/* 组件信息 */}
        {element.componentInfo && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-purple-500" />
              <Text strong className="text-sm">
                组件信息
              </Text>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <Text type="secondary">组件名</Text>
                <Tag
                  size="small"
                  color={element.componentInfo.isReactComponent ? 'cyan' : 'default'}
                >
                  {element.componentInfo.name}
                </Tag>
              </div>
              <div className="flex items-center justify-between">
                <Text type="secondary">类型</Text>
                <Tag
                  size="small"
                  color={element.componentInfo.isReactComponent ? 'green' : 'orange'}
                >
                  {element.componentInfo.isReactComponent ? 'React' : 'HTML'}
                </Tag>
              </div>
            </div>
          </div>
        )}

        {/* 尺寸信息 */}
        {element.boundingRect && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-orange-500" />
              <Text strong className="text-sm">
                尺寸位置
              </Text>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between">
                <Text type="secondary">宽度</Text>
                <Text>{Math.round(element.boundingRect.width)}px</Text>
              </div>
              <div className="flex items-center justify-between">
                <Text type="secondary">高度</Text>
                <Text>{Math.round(element.boundingRect.height)}px</Text>
              </div>
              <div className="flex items-center justify-between">
                <Text type="secondary">X</Text>
                <Text>{Math.round(element.boundingRect.x)}px</Text>
              </div>
              <div className="flex items-center justify-between">
                <Text type="secondary">Y</Text>
                <Text>{Math.round(element.boundingRect.y)}px</Text>
              </div>
            </div>
          </div>
        )}

        {/* 文本内容 */}
        {element.textContent && (
          <div>
            <Text type="secondary" className="block mb-1 text-xs">
              文本内容
            </Text>
            <Text className="text-xs break-all bg-gray-50 dark:bg-gray-800 p-2 rounded">
              {element.textContent}
            </Text>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* 控制按钮 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MousePointer className="w-4 h-4 text-blue-500" />
          <Text strong className="text-sm">
            元素选择器
          </Text>
        </div>

        <div className="flex items-center gap-2">
          {!state.isSelecting ? (
            <Button
              type="primary"
              size="small"
              icon={<Target className="w-3 h-3" />}
              onClick={handleStartSelecting}
              disabled={!iframe}
            >
              开始选择
            </Button>
          ) : (
            <Button size="small" icon={<X className="w-3 h-3" />} onClick={handleStopSelecting}>
              停止选择
            </Button>
          )}

          {state.selectedElement && (
            <Button
              size="small"
              type="text"
              icon={<X className="w-3 h-3" />}
              onClick={handleClearSelection}
            >
              清除选择
            </Button>
          )}
        </div>

        {/* 选择状态提示 */}
        {state.isSelecting && (
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <Text className="text-xs text-blue-600 dark:text-blue-400">
                在预览区域点击要选择的元素，按 ESC 取消
              </Text>
            </div>
          </div>
        )}
      </div>

      {/* 悬停元素信息 */}
      {state.hoveredElement && state.isSelecting && (
        <Card
          size="small"
          title={
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="text-sm">悬停元素</span>
            </div>
          }
        >
          <div className="text-xs">
            <Text code>{state.hoveredElement.tagName}</Text>
            {state.hoveredElement.className && (
              <Text code className="ml-1">
                .{state.hoveredElement.className.split(' ').join('.')}
              </Text>
            )}
            {state.hoveredElement.id && (
              <Text code className="ml-1">
                #{state.hoveredElement.id}
              </Text>
            )}
          </div>
        </Card>
      )}

      {/* 选中元素详细信息 */}
      {state.selectedElement && (
        <Card
          size="small"
          title={
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-500" />
              <span className="text-sm">已选中元素</span>
            </div>
          }
        >
          {renderElementInfo(state.selectedElement)}
        </Card>
      )}

      {/* 使用说明 */}
      {!state.selectedElement && !state.isSelecting && (
        <Card size="small">
          <div className="text-center text-gray-500">
            <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <Text type="secondary" className="text-xs">
              点击"开始选择"按钮，然后在预览区域选择要修改的元素
            </Text>
          </div>
        </Card>
      )}
    </div>
  )
}
