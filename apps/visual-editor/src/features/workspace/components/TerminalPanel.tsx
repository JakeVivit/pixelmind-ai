import React, { useState, useRef, useEffect } from 'react'
import { Button, Space, Dropdown, Typography, Tabs, Input } from 'antd'
import {
  PlusOutlined,
  CloseOutlined,
  ClearOutlined,
  MoreOutlined,
  TerminalOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { cn } from '../../../utils/cn'

const { Text } = Typography

interface TerminalSession {
  id: string
  title: string
  output: string[]
  currentCommand: string
  isRunning: boolean
}

/**
 * 终端面板组件
 * 支持多终端会话和命令执行
 */
export const TerminalPanel: React.FC = () => {
  const [activeTerminal, setActiveTerminal] = useState('terminal-1')
  const [terminals, setTerminals] = useState<TerminalSession[]>([
    {
      id: 'terminal-1',
      title: '终端 1',
      output: [
        '$ npm start',
        'Starting development server...',
        'Local:    http://localhost:3000',
        'Network:  http://192.168.1.100:3000',
        '',
        'webpack compiled successfully',
        '$ ',
      ],
      currentCommand: '',
      isRunning: false,
    },
  ])
  
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 终端操作菜单
  const terminalMenuItems: MenuProps['items'] = [
    {
      key: 'split',
      label: '分割终端',
    },
    {
      key: 'rename',
      label: '重命名',
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      label: '终端设置',
    },
  ]

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [terminals])

  const handleCommandSubmit = (command: string) => {
    if (!command.trim()) return

    const currentTerminal = terminals.find(t => t.id === activeTerminal)
    if (!currentTerminal) return

    // 添加命令到输出
    const newOutput = [...currentTerminal.output]
    newOutput[newOutput.length - 1] = `$ ${command}`
    newOutput.push('')

    // 模拟命令执行
    setTerminals(prev => prev.map(terminal => 
      terminal.id === activeTerminal
        ? { 
            ...terminal, 
            output: newOutput,
            currentCommand: '',
            isRunning: true
          }
        : terminal
    ))

    // 模拟命令响应
    setTimeout(() => {
      const response = getCommandResponse(command)
      setTerminals(prev => prev.map(terminal => 
        terminal.id === activeTerminal
          ? { 
              ...terminal, 
              output: [...terminal.output, ...response, '$ '],
              isRunning: false
            }
          : terminal
      ))
    }, 1000)
  }

  const getCommandResponse = (command: string): string[] => {
    const cmd = command.toLowerCase().trim()
    
    if (cmd.startsWith('npm')) {
      if (cmd.includes('install')) {
        return [
          'Installing packages...',
          'added 1234 packages in 15.2s',
          '',
        ]
      } else if (cmd.includes('start')) {
        return [
          'Starting development server...',
          'Local:    http://localhost:3000',
          'webpack compiled successfully',
          '',
        ]
      } else if (cmd.includes('build')) {
        return [
          'Building for production...',
          'Build completed successfully',
          'Output directory: dist/',
          '',
        ]
      }
    } else if (cmd === 'ls' || cmd === 'dir') {
      return [
        'src/',
        'public/',
        'package.json',
        'README.md',
        '',
      ]
    } else if (cmd.startsWith('cd')) {
      return ['']
    } else if (cmd === 'pwd') {
      return ['/workspace/my-project', '']
    } else if (cmd === 'clear') {
      // 清空终端
      setTerminals(prev => prev.map(terminal => 
        terminal.id === activeTerminal
          ? { ...terminal, output: ['$ '] }
          : terminal
      ))
      return []
    } else {
      return [`bash: ${command}: command not found`, '']
    }
    
    return ['']
  }

  const handleNewTerminal = () => {
    const newId = `terminal-${terminals.length + 1}`
    const newTerminal: TerminalSession = {
      id: newId,
      title: `终端 ${terminals.length + 1}`,
      output: ['$ '],
      currentCommand: '',
      isRunning: false,
    }
    setTerminals(prev => [...prev, newTerminal])
    setActiveTerminal(newId)
  }

  const handleCloseTerminal = (terminalId: string) => {
    if (terminals.length === 1) return
    
    const newTerminals = terminals.filter(t => t.id !== terminalId)
    setTerminals(newTerminals)
    
    if (activeTerminal === terminalId) {
      setActiveTerminal(newTerminals[0]?.id || '')
    }
  }

  const handleClearTerminal = () => {
    setTerminals(prev => prev.map(terminal => 
      terminal.id === activeTerminal
        ? { ...terminal, output: ['$ '] }
        : terminal
    ))
  }

  const handleTerminalMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'split':
        handleNewTerminal()
        break
      case 'rename':
        console.log('重命名终端')
        break
      case 'settings':
        console.log('终端设置')
        break
    }
  }

  const currentTerminal = terminals.find(t => t.id === activeTerminal)

  const tabItems = terminals.map(terminal => ({
    key: terminal.id,
    label: (
      <div className="flex items-center gap-2 group">
        <TerminalOutlined />
        <span>{terminal.title}</span>
        {terminal.isRunning && (
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        )}
        {terminals.length > 1 && (
          <Button
            type="text"
            icon={<CloseOutlined />}
            size="small"
            className={cn(
              'w-4 h-4 p-0 opacity-0 group-hover:opacity-100',
              'hover:bg-gray-600'
            )}
            onClick={(e) => {
              e.stopPropagation()
              handleCloseTerminal(terminal.id)
            }}
          />
        )}
      </div>
    ),
  }))

  return (
    <div className="h-full flex flex-col bg-gray-900 text-green-400">
      {/* 终端头部 */}
      <div className={cn(
        'flex items-center justify-between px-3 py-1',
        'bg-gray-800 border-b border-gray-700'
      )}>
        <Text className="text-gray-300 text-sm">终端</Text>
        
        <Space size="small">
          <Button
            type="text"
            icon={<PlusOutlined />}
            size="small"
            onClick={handleNewTerminal}
            className="text-gray-400 hover:text-white hover:bg-gray-700"
          />
          
          <Button
            type="text"
            icon={<ClearOutlined />}
            size="small"
            onClick={handleClearTerminal}
            className="text-gray-400 hover:text-white hover:bg-gray-700"
          />
          
          <Dropdown
            menu={{
              items: terminalMenuItems,
              onClick: handleTerminalMenuClick,
            }}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              size="small"
              className="text-gray-400 hover:text-white hover:bg-gray-700"
            />
          </Dropdown>
        </Space>
      </div>

      {/* 终端标签页 */}
      <div className="border-b border-gray-700">
        <Tabs
          type="card"
          activeKey={activeTerminal}
          onChange={setActiveTerminal}
          items={tabItems}
          size="small"
          className={cn(
            '[&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav]:bg-gray-800',
            '[&_.ant-tabs-tab]:bg-gray-800 [&_.ant-tabs-tab]:border-gray-700',
            '[&_.ant-tabs-tab]:text-gray-400',
            '[&_.ant-tabs-tab-active]:bg-gray-900 [&_.ant-tabs-tab-active]:text-green-400',
            '[&_.ant-tabs-content-holder]:hidden'
          )}
        />
      </div>

      {/* 终端内容 */}
      <div className="flex-1 flex flex-col">
        <div
          ref={terminalRef}
          className="flex-1 p-3 overflow-auto font-mono text-sm leading-relaxed"
        >
          {currentTerminal?.output.map((line, index) => (
            <div key={index} className="whitespace-pre-wrap">
              {line}
              {index === currentTerminal.output.length - 1 && 
               !currentTerminal.isRunning && 
               line.endsWith('$ ') && (
                <Input
                  ref={inputRef}
                  value={currentTerminal.currentCommand}
                  onChange={(e) => {
                    setTerminals(prev => prev.map(terminal => 
                      terminal.id === activeTerminal
                        ? { ...terminal, currentCommand: e.target.value }
                        : terminal
                    ))
                  }}
                  onPressEnter={(e) => {
                    handleCommandSubmit(currentTerminal.currentCommand)
                  }}
                  className={cn(
                    'inline-block bg-transparent border-0 p-0 text-green-400',
                    'focus:shadow-none [&_.ant-input]:bg-transparent [&_.ant-input]:border-0',
                    '[&_.ant-input]:text-green-400 [&_.ant-input]:p-0',
                    '[&_.ant-input:focus]:shadow-none [&_.ant-input:focus]:border-0'
                  )}
                  style={{ width: 'auto', minWidth: '200px' }}
                />
              )}
              {index === currentTerminal.output.length - 1 && 
               currentTerminal.isRunning && (
                <span className="animate-pulse">█</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
