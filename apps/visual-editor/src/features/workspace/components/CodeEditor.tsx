import React, { useState, useRef } from 'react'
import { Tabs, Button, Space, Dropdown, Typography, Tooltip } from 'antd'
import {
  CloseOutlined,
  SaveOutlined,
  MoreOutlined,
  CodeOutlined,
  EyeOutlined,
  SplitCellsOutlined,
  FullscreenOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Editor } from '@monaco-editor/react'
import { cn } from '../../../utils/cn'
import { useTheme } from '../../../hooks/useTheme'

const { Text } = Typography

interface FileTab {
  key: string
  title: string
  content: string
  language: string
  modified: boolean
}

/**
 * 代码编辑器组件
 * 基于 Monaco Editor，支持多标签页和语法高亮
 */
export const CodeEditor: React.FC = () => {
  const { isDark } = useTheme()
  const editorRef = useRef<any>(null)
  
  const [activeTab, setActiveTab] = useState('App.tsx')
  const [tabs, setTabs] = useState<FileTab[]>([
    {
      key: 'App.tsx',
      title: 'App.tsx',
      content: `import React from 'react'
import { Button, Space, Typography } from 'antd'

const { Title } = Typography

function App() {
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>🚀 PixelMind AI 项目</Title>
      <Space>
        <Button type="primary">
          主要按钮
        </Button>
        <Button>
          普通按钮
        </Button>
      </Space>
      <p>这是一个由 PixelMind AI 创建的项目</p>
    </div>
  )
}

export default App`,
      language: 'typescript',
      modified: false,
    },
  ])

  // 编辑器操作菜单
  const editorMenuItems: MenuProps['items'] = [
    {
      key: 'format',
      label: '格式化代码',
    },
    {
      key: 'find',
      label: '查找替换',
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      label: '编辑器设置',
    },
  ]

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setTabs(prev => prev.map(tab => 
        tab.key === activeTab 
          ? { ...tab, content: value, modified: true }
          : tab
      ))
    }
  }

  const handleTabChange = (key: string) => {
    setActiveTab(key)
  }

  const handleTabClose = (targetKey: string) => {
    if (tabs.length === 1) return
    
    const newTabs = tabs.filter(tab => tab.key !== targetKey)
    setTabs(newTabs)
    
    if (activeTab === targetKey) {
      setActiveTab(newTabs[0]?.key || '')
    }
  }

  const handleSave = () => {
    setTabs(prev => prev.map(tab => 
      tab.key === activeTab 
        ? { ...tab, modified: false }
        : tab
    ))
    console.log('保存文件:', activeTab)
  }

  const handleEditorMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'format':
        editorRef.current?.getAction('editor.action.formatDocument')?.run()
        break
      case 'find':
        editorRef.current?.getAction('actions.find')?.run()
        break
      case 'settings':
        console.log('打开编辑器设置')
        break
    }
  }

  const currentTab = tabs.find(tab => tab.key === activeTab)

  const tabItems = tabs.map(tab => ({
    key: tab.key,
    label: (
      <div className="flex items-center gap-2 group">
        <CodeOutlined className="text-blue-500" />
        <span className={cn(
          tab.modified && 'italic'
        )}>
          {tab.title}
          {tab.modified && '*'}
        </span>
        {tabs.length > 1 && (
          <Button
            type="text"
            icon={<CloseOutlined />}
            size="small"
            className={cn(
              'w-4 h-4 p-0 opacity-0 group-hover:opacity-100',
              'hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
            onClick={(e) => {
              e.stopPropagation()
              handleTabClose(tab.key)
            }}
          />
        )}
      </div>
    ),
    children: null, // 内容在下方统一渲染
  }))

  return (
    <div className="h-full flex flex-col">
      {/* 编辑器头部 */}
      <div className={cn(
        'flex items-center justify-between px-3 py-2',
        'bg-gray-50 dark:bg-gray-800',
        'border-b border-gray-200 dark:border-gray-700'
      )}>
        <Text className="font-medium text-gray-900 dark:text-gray-100">
          代码编辑器
        </Text>
        
        <Space size="small">
          <Tooltip title="保存 (Ctrl+S)">
            <Button
              type="text"
              icon={<SaveOutlined />}
              size="small"
              onClick={handleSave}
              className={cn(
                currentTab?.modified 
                  ? 'text-orange-500 hover:text-orange-600' 
                  : 'text-gray-500'
              )}
            />
          </Tooltip>
          
          <Tooltip title="预览模式">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
            />
          </Tooltip>
          
          <Tooltip title="分屏模式">
            <Button
              type="text"
              icon={<SplitCellsOutlined />}
              size="small"
            />
          </Tooltip>
          
          <Tooltip title="全屏">
            <Button
              type="text"
              icon={<FullscreenOutlined />}
              size="small"
            />
          </Tooltip>
          
          <Dropdown
            menu={{
              items: editorMenuItems,
              onClick: handleEditorMenuClick,
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

      {/* 文件标签页 */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <Tabs
          type="card"
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
          size="small"
          className={cn(
            '[&_.ant-tabs-nav]:mb-0',
            '[&_.ant-tabs-tab]:border-b-0',
            '[&_.ant-tabs-content-holder]:hidden'
          )}
        />
      </div>

      {/* 编辑器内容 */}
      <div className="flex-1">
        {currentTab && (
          <Editor
            height="100%"
            language={currentTab.language}
            value={currentTab.content}
            onChange={handleEditorChange}
            theme={isDark ? 'vs-dark' : 'light'}
            options={{
              fontSize: 14,
              fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              minimap: { enabled: true },
              wordWrap: 'on',
              tabSize: 2,
              insertSpaces: true,
              formatOnPaste: true,
              formatOnType: true,
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: 'on',
              quickSuggestions: true,
            }}
            onMount={(editor) => {
              editorRef.current = editor
            }}
          />
        )}
      </div>
    </div>
  )
}
