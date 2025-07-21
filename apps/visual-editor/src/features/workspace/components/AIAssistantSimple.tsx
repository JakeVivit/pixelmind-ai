import React, { useState } from 'react'
import { Button, Input, Avatar } from 'antd'
import { Bot, User, Send, X } from 'lucide-react'
import { cn } from '../../../utils/cn'

const { TextArea } = Input

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

/**
 * AI助手组件 - 按照截图简洁样式
 */
export const AIAssistantSimple: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '你好！我是 PixelMind AI，可以帮助你进行网站设计和开发。有什么我可以帮助你的吗？',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // 模拟AI回复
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '我理解你的需求。让我来帮助你实现这个功能。',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* 头部 - 按照截图样式 */}
      <div className="flex items-center justify-between px-4 py-3 ">
        {/* <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <span className="font-medium">PixelMind AI</span>
          <span className="text-xs text-white/80">1 分钟前</span>
        </div> */}
        <button className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={cn('flex gap-3', message.type === 'user' ? 'justify-end' : 'justify-start')}
          >
            {message.type === 'ai' && (
              <Avatar
                icon={<Bot className="w-4 h-4" />}
                size="small"
                className="bg-purple-500 flex-shrink-0"
              />
            )}

            <div
              className={cn(
                'max-w-[80%] px-3 py-2 rounded-lg text-sm',
                message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
              )}
            >
              {message.content}
            </div>

            {message.type === 'user' && (
              <Avatar
                icon={<User className="w-4 h-4" />}
                size="small"
                className="bg-blue-500 flex-shrink-0"
              />
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <Avatar
              icon={<Bot className="w-4 h-4" />}
              size="small"
              className="bg-purple-500 flex-shrink-0"
            />
            <div className="bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-600">
              正在思考...
            </div>
          </div>
        )}
      </div>

      {/* 输入区域 - 按照截图样式 */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <TextArea
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="flex-1"
          />
          <Button
            type="primary"
            icon={<Send className="w-4 h-4" />}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-purple-500 hover:bg-purple-600 border-purple-500 hover:border-purple-600"
          />
        </div>
      </div>
    </div>
  )
}
