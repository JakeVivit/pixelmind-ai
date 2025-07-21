import React, { useState, useRef, useEffect } from 'react'
import { Button, Input, Space, Typography, Avatar, Spin, Card, Tag } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Trash2, History, Lightbulb, Zap, Star } from 'lucide-react'
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
      content:
        '你好！我是 PixelMind AI 助手。我可以帮你生成代码、修改组件、解答问题。请告诉我你需要什么帮助？',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 快速提示
  const quickPrompts = ['创建一个登录表单', '添加一个数据表格', '修改按钮样式', '创建响应式布局']

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

export default MyComponent`,
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
      minute: '2-digit',
    })
  }

  return (
    <div className="h-full flex flex-col">
      {/* AI 助手头部 - 炫酷设计 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'relative px-4 py-3',
          'bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500',
          'border-b border-primary-300'
        )}
      >
        {/* 背景动画效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-purple-600/20 to-pink-600/20 animate-pulse" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Avatar
                icon={<Bot className="w-5 h-5" />}
                className="bg-white/20 backdrop-blur-sm border-2 border-white/30"
                size="default"
              />
            </motion.div>

            <div>
              <Text className="font-bold text-white text-lg">PixelMind AI</Text>
              <div className="flex items-center gap-1 mt-1">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-green-400 rounded-full"
                />
                <Text className="text-white/80 text-xs">在线助手</Text>
              </div>
            </div>
          </div>

          <Space size="small">
            <Button
              type="text"
              icon={<History className="w-4 h-4" />}
              size="small"
              className="text-white/80 hover:text-white hover:bg-white/10"
              title="聊天历史"
            />
            <Button
              type="text"
              icon={<Trash2 className="w-4 h-4" />}
              size="small"
              onClick={handleClearChat}
              className="text-white/80 hover:text-white hover:bg-white/10"
              title="清空聊天"
            />
          </Space>
        </div>
      </motion.div>

      {/* 快速提示 */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-yellow-500" />
          <Text className="text-sm text-gray-600 dark:text-gray-400">快速开始</Text>
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
        {messages.map(message => (
          <div
            key={message.id}
            className={cn('flex gap-3', message.type === 'user' ? 'flex-row-reverse' : 'flex-row')}
          >
            <Avatar
              icon={
                message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />
              }
              className={cn(message.type === 'user' ? 'bg-blue-500' : 'bg-primary-500')}
              size="small"
            />

            <div
              className={cn(
                'flex-1 max-w-[80%]',
                message.type === 'user' ? 'text-right' : 'text-left'
              )}
            >
              <div
                className={cn(
                  'inline-block p-3 rounded-lg',
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                )}
              >
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
                {message.codeBlocks &&
                  message.codeBlocks.map((code, index) => (
                    <Card key={index} size="small" className="mt-2" bodyStyle={{ padding: 8 }}>
                      <pre
                        className={cn(
                          'text-xs font-mono overflow-auto',
                          'text-gray-800 dark:text-gray-200',
                          'bg-gray-50 dark:bg-gray-900 p-2 rounded'
                        )}
                      >
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

              <div
                className={cn(
                  'text-xs text-gray-500 dark:text-gray-400 mt-1',
                  message.type === 'user' ? 'text-right' : 'text-left'
                )}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {/* AI 正在输入指示器 */}
        {isLoading && (
          <div className="flex gap-3">
            <Avatar icon={<Bot className="w-4 h-4" />} className="bg-primary-500" size="small" />
            <div
              className={cn(
                'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
                'rounded-lg p-3 flex items-center gap-2'
              )}
            >
              <Spin size="small" />
              <Text className="text-sm text-gray-600 dark:text-gray-400">AI 正在思考...</Text>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 炫酷输入区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'relative p-4',
          'bg-gradient-to-r from-gray-50 via-white to-gray-50',
          'dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
          'border-t border-gray-200 dark:border-gray-700'
        )}
      >
        {/* 背景光效 */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-purple-500/5 to-pink-500/5" />

        <div className="relative">
          {/* 输入框容器 */}
          <div
            className={cn(
              'relative flex gap-3 p-3 rounded-2xl',
              'bg-white dark:bg-gray-800',
              'border-2 border-gray-200 dark:border-gray-600',
              'shadow-lg backdrop-blur-sm',
              'transition-all duration-300',
              'hover:border-primary-300 dark:hover:border-primary-600',
              'focus-within:border-primary-500 dark:focus-within:border-primary-400',
              'focus-within:shadow-xl focus-within:shadow-primary-500/20'
            )}
          >
            {/* 魔法光环效果 */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-pink-500/20 opacity-0"
              animate={{ opacity: inputValue ? [0, 0.3, 0] : 0 }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <TextArea
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="✨ 告诉我你想要创建什么..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              onPressEnter={e => {
                if (e.shiftKey) return
                e.preventDefault()
                handleSendMessage()
              }}
              className={cn(
                'flex-1 border-0 bg-transparent resize-none',
                '[&_.ant-input]:border-0 [&_.ant-input]:bg-transparent',
                '[&_.ant-input]:shadow-none [&_.ant-input]:text-base',
                '[&_.ant-input]:placeholder-gray-400',
                '[&_.ant-input:focus]:shadow-none [&_.ant-input:focus]:border-0'
              )}
            />

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="primary"
                icon={<Send className="w-4 h-4" />}
                onClick={handleSendMessage}
                loading={isLoading}
                disabled={!inputValue.trim()}
                className={cn(
                  'h-10 px-6 rounded-xl',
                  'bg-gradient-to-r from-primary-500 to-purple-500',
                  'border-0 shadow-lg',
                  'hover:from-primary-600 hover:to-purple-600',
                  'disabled:from-gray-400 disabled:to-gray-500',
                  'transition-all duration-300'
                )}
              >
                {isLoading ? '思考中...' : '发送'}
              </Button>
            </motion.div>
          </div>

          {/* 提示文字 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-between mt-3 px-1"
          >
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Zap className="w-4 h-4 text-primary-500" />
              <span>按 Enter 发送，Shift + Enter 换行</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>AI 驱动</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
