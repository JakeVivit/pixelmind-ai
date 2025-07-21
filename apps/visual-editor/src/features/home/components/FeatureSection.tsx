import React from 'react'
import { motion } from 'framer-motion'
import { 
  CodeOutlined, 
  RobotOutlined, 
  EyeOutlined, 
  ThunderboltOutlined,
  CloudOutlined,
  BgColorsOutlined
} from '@ant-design/icons'
import { cn } from '../../../utils/cn'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

const features: Feature[] = [
  {
    icon: <CodeOutlined className="text-2xl" />,
    title: 'WebContainer 开发环境',
    description: '完全在浏览器中运行的真实开发环境，支持 npm 安装、热重载和实时预览',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: <RobotOutlined className="text-2xl" />,
    title: 'AI 智能代码生成',
    description: '基于 Gemini AI 的自然语言代码生成，支持 React 组件和复杂业务逻辑',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: <BgColorsOutlined className="text-2xl" />,
    title: '可视化拖拽编辑',
    description: '直观的可视化编辑器，支持拖拽组件、属性编辑和实时样式调整',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: <EyeOutlined className="text-2xl" />,
    title: '实时预览同步',
    description: '代码修改即时反映在预览中，支持多设备响应式预览和交互测试',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: <CloudOutlined className="text-2xl" />,
    title: '云端项目管理',
    description: '项目自动保存到云端，支持版本控制、团队协作和一键部署',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    icon: <ThunderboltOutlined className="text-2xl" />,
    title: '极速开发体验',
    description: '零配置启动，内置常用模板和组件库，让你专注于创意实现',
    color: 'from-yellow-500 to-orange-500'
  }
]

/**
 * 功能特性展示组件
 */
export const FeatureSection: React.FC = () => {
  return (
    <div className="container mx-auto px-6">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={cn(
              'text-3xl md:text-4xl font-bold mb-4',
              'text-gray-900 dark:text-gray-100'
            )}
          >
            强大的功能特性
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className={cn(
              'text-lg text-gray-600 dark:text-gray-300',
              'max-w-2xl mx-auto'
            )}
          >
            集成最新的 AI 技术和现代开发工具，为你提供前所未有的开发体验
          </motion.p>
        </div>

        {/* 功能卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className={cn(
                'group relative p-6 rounded-2xl',
                'bg-white dark:bg-gray-900',
                'border border-gray-200 dark:border-gray-700',
                'shadow-sm hover:shadow-lg',
                'transition-all duration-300',
                'overflow-hidden'
              )}
            >
              {/* 背景渐变 */}
              <div className={cn(
                'absolute inset-0 opacity-0 group-hover:opacity-5',
                'bg-gradient-to-br',
                feature.color,
                'transition-opacity duration-300'
              )} />

              {/* 图标 */}
              <div className={cn(
                'relative w-12 h-12 rounded-xl mb-4',
                'bg-gradient-to-br',
                feature.color,
                'flex items-center justify-center',
                'text-white shadow-lg'
              )}>
                {feature.icon}
              </div>

              {/* 内容 */}
              <div className="relative">
                <h3 className={cn(
                  'text-xl font-semibold mb-3',
                  'text-gray-900 dark:text-gray-100'
                )}>
                  {feature.title}
                </h3>
                <p className={cn(
                  'text-gray-600 dark:text-gray-300',
                  'leading-relaxed'
                )}>
                  {feature.description}
                </p>
              </div>

              {/* 悬停效果装饰 */}
              <div className={cn(
                'absolute top-0 right-0 w-20 h-20',
                'bg-gradient-to-br',
                feature.color,
                'opacity-0 group-hover:opacity-10',
                'rounded-full blur-2xl',
                'transition-opacity duration-300',
                'transform translate-x-8 -translate-y-8'
              )} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
