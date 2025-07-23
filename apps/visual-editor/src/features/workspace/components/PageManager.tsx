import React, { useState, useEffect } from 'react'
import { Input, Button, Tabs, Space, Typography, Alert, Spin } from 'antd'
import { Search, Plus, RefreshCw, Filter } from 'lucide-react'
import { CustomPageTree } from './CustomPageTree'
import { PageDetails } from './PageDetails'
import { PageManager as PageManagerService } from '../services/PageManager'
import type { PageManagerState, PageFilter } from '../types/page'
import { cn } from '../../../utils/cn'

const { Search: SearchInput } = Input
const { Title } = Typography

interface PageManagerProps {
  projectId: string
  className?: string
}

/**
 * 页面管理主组件
 * 整合页面树、详情面板和搜索功能
 */
export const PageManager: React.FC<PageManagerProps> = ({ projectId, className }) => {
  const [state, setState] = useState<PageManagerState>({
    isLoading: false,
    isAnalyzing: false,
    error: null,
    structure: null,
    selectedPage: null,
    filter: {},
  })
  const [activeTab, setActiveTab] = useState('tree')
  const [searchKeyword, setSearchKeyword] = useState('')

  const pageManager = PageManagerService.getInstance()

  // 订阅页面管理器状态
  useEffect(() => {
    const unsubscribe = pageManager.subscribe(setState)
    return unsubscribe
  }, [pageManager])

  // 初始化分析项目
  useEffect(() => {
    if (projectId) {
      analyzeProject()
    }
  }, [projectId])

  // 分析项目
  const analyzeProject = async () => {
    try {
      await pageManager.analyzeProject(projectId)
    } catch (error) {
      console.error('分析项目失败:', error)
    }
  }

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchKeyword(value)
    const filter: PageFilter = {
      ...state.filter,
      keyword: value || undefined,
    }
    pageManager.setFilter(filter)
  }

  // 处理页面选择
  const handlePageSelect = (pageId: string) => {
    pageManager.selectPage(pageId)
  }

  // 处理刷新
  const handleRefresh = () => {
    analyzeProject()
  }

  // 处理新增页面
  const handleAddPage = () => {
    console.log('新增页面功能开发中...')
    // TODO: 实现新增页面功能
  }

  // 获取过滤后的页面
  const filteredPages = pageManager.getFilteredPages()

  const tabItems = [
    {
      key: 'tree',
      label: (
        <div className="flex items-center gap-2">
          <span>页面结构</span>
          {state.structure && (
            <span className="text-xs text-gray-500">({state.structure.pages.length})</span>
          )}
        </div>
      ),
      children: (
        <div className="space-y-4">
          {/* 搜索和操作栏 */}
          <div className="space-y-3">
            <SearchInput
              placeholder="搜索页面或路由..."
              value={searchKeyword}
              onChange={e => handleSearch(e.target.value)}
              onSearch={handleSearch}
              allowClear
              size="small"
            />

            <div className="flex items-center justify-end gap-2">
              <Button
                type="text"
                icon={<RefreshCw className="w-3 h-3" />}
                onClick={handleRefresh}
                loading={state.isAnalyzing}
                size="small"
                className="!p-1"
                title="刷新"
              />

              <Button
                type="text"
                icon={<Plus className="w-3 h-3" />}
                onClick={handleAddPage}
                size="small"
                className="!p-1"
                title="新增页面"
              />
            </div>
          </div>

          {/* 页面树 */}
          <div className="flex-1 overflow-y-auto">
            {state.structure && (
              <CustomPageTree
                pages={filteredPages}
                routes={state.structure.routes}
                selectedPageId={state.selectedPage?.id}
                onPageSelect={handlePageSelect}
                loading={state.isAnalyzing}
              />
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'details',
      label: '页面详情',
      children: (
        <div className="h-full overflow-y-auto">
          <PageDetails page={state.selectedPage} className="p-4" />
        </div>
      ),
    },
  ]

  if (state.isLoading && !state.structure) {
    return (
      <div className={cn('flex items-center justify-center h-64', className)}>
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4 text-gray-500">正在加载项目结构...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('h-full flex flex-col', className)}>
      {/* 错误提示 */}
      {state.error && (
        <Alert
          message="分析失败"
          description={state.error}
          type="error"
          closable
          onClose={() => setState(prev => ({ ...prev, error: null }))}
          className="mb-4"
        />
      )}

      {/* 分析中提示 */}
      {state.isAnalyzing && (
        <Alert message="正在分析项目结构..." type="info" showIcon className="mb-4" />
      )}

      {/* 主要内容 */}
      <div className="flex-1 min-h-0">
        {state.structure ? (
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            size="small"
            className="h-full"
            tabBarStyle={{ marginBottom: 16 }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-lg mb-2">暂无页面数据</div>
              <div className="text-sm mb-4">点击刷新按钮分析项目结构</div>
              <Button
                type="primary"
                icon={<RefreshCw className="w-4 h-4" />}
                onClick={handleRefresh}
                loading={state.isAnalyzing}
              >
                开始分析
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
