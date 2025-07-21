import React from 'react'
import { motion } from 'framer-motion'
import { Button } from 'antd'
import { 
  PlayCircleOutlined, 
  RocketOutlined, 
  GithubOutlined,
  ArrowRightOutlined 
} from '@ant-design/icons'
import { cn } from '../../../utils/cn'

/**
 * Hero Section 组件
 * 参考 Linear 的简洁现代设计风格
 */
export const HeroSection: React.FC = () => {
  const handleStartCreating = () => {
    // TODO: 导航到项目创建页面
    console.log('开始创建项目')
  }

  const handleViewDemo = () => {
    // TODO: 导航到演示页面
    console.log('查看演示')
  }

  const handleViewGithub = () => {
    window.open('https://github.com/JakeVivit/pixelmind-ai', '_blank')
  }

  return (
    <div className="container mx-auto px-6 pt-20 pb-16">
      <div className="max-w-4xl mx-auto text-center">
        {/* 标签 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full',
            'bg-primary-50 dark:bg-primary-950/50',
            'border border-primary-200 dark:border-primary-800',
            'text-primary-700 dark:text-primary-300',
            'text-sm font-medium'
          )}>
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            可视化 AI 前端开发环境
          </div>
        </motion.div>

        {/* 主标题 */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className={cn(
            'text-5xl md:text-7xl font-bold mb-6',
            'bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900',
            'dark:from-gray-100 dark:via-primary-300 dark:to-gray-100',
            'bg-clip-text text-transparent',
            'leading-tight'
          )}
        >
          PixelMind AI
        </motion.h1>

        {/* 副标题 */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={cn(
            'text-xl md:text-2xl mb-8',
            'text-gray-600 dark:text-gray-300',
            'max-w-3xl mx-auto leading-relaxed'
          )}
        >
          通过自然语言和可视化操作，在浏览器中创建 React 应用。
          <br />
          <span className="text-primary-600 dark:text-primary-400 font-medium">
            AI 驱动的代码生成，实时预览，完全在线开发。
          </span>
        </motion.p>

        {/* 操作按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Button
            type="primary"
            size="large"
            icon={<RocketOutlined />}
            onClick={handleStartCreating}
            className={cn(
              'h-12 px-8 text-base font-medium',
              'bg-primary-600 hover:bg-primary-700 border-primary-600',
              'shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30',
              'transition-all duration-300'
            )}
          >
            开始创建项目
            <ArrowRightOutlined className="ml-1" />
          </Button>

          <Button
            size="large"
            icon={<PlayCircleOutlined />}
            onClick={handleViewDemo}
            className={cn(
              'h-12 px-8 text-base font-medium',
              'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200',
              'border-gray-200 dark:border-gray-600',
              'hover:bg-gray-50 dark:hover:bg-gray-700',
              'transition-all duration-300'
            )}
          >
            查看演示
          </Button>

          <Button
            size="large"
            icon={<GithubOutlined />}
            onClick={handleViewGithub}
            className={cn(
              'h-12 px-6 text-base',
              'bg-transparent border-0 text-gray-500 dark:text-gray-400',
              'hover:text-gray-700 dark:hover:text-gray-200',
              'transition-all duration-300'
            )}
          >
            GitHub
          </Button>
        </motion.div>

        {/* 特性标签 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400"
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            完全在浏览器运行
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            AI 智能代码生成
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
            实时预览和热重载
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
            可视化拖拽编辑
          </div>
        </motion.div>
      </div>
    </div>
  )
}
