import React, { useState, useRef, useEffect } from 'react'
import { Button, Input, Space, Typography, Avatar, Spin, Card, Tag } from 'antd'
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  ClearOutlined,
  HistoryOutlined,
  BulbOutlined,
} from '@ant-design/icons'
import { cn } from '../../../utils/cn'

const { Text, Paragraph } = Typography
const { TextArea } = Input

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  codeBlocks?: string[]
}

/**
 * AI 助手组件
 * 支持自然语言对话和代码生成
 */
export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: '你好！我是 PixelMind AI 助手。我可以帮你生成代码、修改组件、解答问题。请告诉我你需要什么帮助？',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 快速提示
  const quickPrompts = [
    '创建一个登录表单',
    '添加一个数据表格',
    '修改按钮样式',
    '创建响应式布局',
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // 模拟 AI 响应
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `我理解你想要：${inputValue}\n\n让我为你生成相应的代码：`,
        timestamp: new Date(),
        codeBlocks: [
          `// 基于你的需求生成的代码
import React from 'react'
import { Button } from 'antd'

const MyComponent = () => {
  return (
    <Button type="primary">
      ${inputValue}
    </Button>
  )
}

export default MyComponent`
        ],
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 2000)
  }

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt)
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        type: 'ai',
        content: '聊天记录已清空。有什么我可以帮助你的吗？',
        timestamp: new Date(),
      },
    ])
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="h-full flex flex-col">
      {/* AI 助手头部 */}
      <div className={cn(
        'flex items-center justify-between px-3 py-2',
        'bg-gray-50 dark:bg-gray-800',
        'border-b border-gray-200 dark:border-gray-700'
      )}>
        <div className="flex items-center gap-2">
          <Avatar 
            icon={<RobotOutlined />} 
            className="bg-primary-500"
            size="small"
          />
          <Text className="font-medium text-gray-900 dark:text-gray-100">
            AI 助手
          </Text>
        </div>
        
        <Space size="small">
          <Button
            type="text"
            icon={<HistoryOutlined />}
            size="small"
            title="聊天历史"
          />
          <Button
            type="text"
            icon={<ClearOutlined />}
            size="small"
            onClick={handleClearChat}
            title="清空聊天"
          />
        </Space>
      </div>

      {/* 快速提示 */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <BulbOutlined className="text-yellow-500" />
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            快速开始
          </Text>
        </div>
        <div className="flex flex-wrap gap-1">
          {quickPrompts.map((prompt, index) => (
            <Tag
              key={index}
              className="cursor-pointer hover:border-primary-400"
              onClick={() => handleQuickPrompt(prompt)}
            >
              {prompt}
            </Tag>
          ))}
        </div>
      </div>

      {/* 聊天消息区域 */}
      <div className="flex-1 overflow-auto p-3 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3',
              message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
            )}
          >
            <Avatar
              icon={message.type === 'user' ? <UserOutlined /> : <RobotOutlined />}
              className={cn(
                message.type === 'user' 
                  ? 'bg-blue-500' 
                  : 'bg-primary-500'
              )}
              size="small"
            />
            
            <div className={cn(
              'flex-1 max-w-[80%]',
              message.type === 'user' ? 'text-right' : 'text-left'
            )}>
              <div className={cn(
                'inline-block p-3 rounded-lg',
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
              )}>
                <Paragraph 
                  className={cn(
                    'mb-0 text-sm',
                    message.type === 'user' 
                      ? 'text-white [&_.ant-typography]:text-white' 
                      : 'text-gray-900 dark:text-gray-100'
                  )}
                >
                  {message.content}
                </Paragraph>
                
                {/* 代码块 */}
                {message.codeBlocks && message.codeBlocks.map((code, index) => (
                  <Card
                    key={index}
                    size="small"
                    className="mt-2"
                    bodyStyle={{ padding: 8 }}
                  >
                    <pre className={cn(
                      'text-xs font-mono overflow-auto',
                      'text-gray-800 dark:text-gray-200',
                      'bg-gray-50 dark:bg-gray-900 p-2 rounded'
                    )}>
                      {code}
                    </pre>
                    <div className="mt-2 text-right">
                      <Button size="small" type="link">
                        应用到编辑器
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className={cn(
                'text-xs text-gray-500 dark:text-gray-400 mt-1',
                message.type === 'user' ? 'text-right' : 'text-left'
              )}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {/* AI 正在输入指示器 */}
        {isLoading && (
          <div className="flex gap-3">
            <Avatar
              icon={<RobotOutlined />}
              className="bg-primary-500"
              size="small"
            />
            <div className={cn(
              'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
              'rounded-lg p-3 flex items-center gap-2'
            )}>
              <Spin size="small" />
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                AI 正在思考...
              </Text>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className={cn(
        'p-3 border-t border-gray-200 dark:border-gray-700',
        'bg-white dark:bg-gray-900'
      )}>
        <div className="flex gap-2">
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="描述你想要的功能或问题..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            onPressEnter={(e) => {
              if (e.shiftKey) return
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex-1"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            loading={isLoading}
            disabled={!inputValue.trim()}
            className="self-end"
          >
            发送
          </Button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          按 Enter 发送，Shift + Enter 换行
        </div>
      </div>
    </div>
  )
}
