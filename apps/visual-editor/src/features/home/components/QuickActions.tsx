import React from 'react'
import { motion } from 'framer-motion'
import { Button } from 'antd'
import { 
  PlusOutlined, 
  CodeOutlined, 
  RobotOutlined, 
  AppstoreOutlined,
  ImportOutlined,
  PlayCircleOutlined,
  ArrowRightOutlined
} from '@ant-design/icons'
import { cn } from '../../../utils/cn'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  action: () => void
  primary?: boolean
  color: string
}

/**
 * 快速操作组件
 */
export const QuickActions: React.FC = () => {
  const quickActions: QuickAction[] = [
    {
      id: 'create-project',
      title: '创建新项目',
      description: '从零开始创建 React 或 Vue 项目，选择你喜欢的模板和配置',
      icon: <PlusOutlined className="text-xl" />,
      action: () => console.log('创建新项目'),
      primary: true,
      color: 'from-primary-500 to-primary-600'
    },
    {
      id: 'webcontainer-demo',
      title: 'WebContainer 演示',
      description: '体验完整的浏览器开发环境，包括代码编辑、依赖安装和实时预览',
      icon: <CodeOutlined className="text-xl" />,
      action: () => console.log('WebContainer 演示'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'ai-playground',
      title: 'AI 代码助手',
      description: '体验 AI 驱动的代码生成，通过自然语言描述生成 React 组件',
      icon: <RobotOutlined className="text-xl" />,
      action: () => console.log('AI 代码助手'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'template-gallery',
      title: '模板库',
      description: '浏览精心设计的项目模板，包括管理后台、电商网站、博客等',
      icon: <AppstoreOutlined className="text-xl" />,
      action: () => console.log('模板库'),
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'import-project',
      title: '导入现有项目',
      description: '导入你的 GitHub 项目或本地代码，在云端继续开发',
      icon: <ImportOutlined className="text-xl" />,
      action: () => console.log('导入项目'),
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'interactive-tutorial',
      title: '交互式教程',
      description: '通过实际操作学习如何使用 PixelMind AI 的各种功能',
      icon: <PlayCircleOutlined className="text-xl" />,
      action: () => console.log('交互式教程'),
      color: 'from-indigo-500 to-blue-500'
    }
  ]

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
            立即开始使用
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
            选择最适合你的方式开始探索 PixelMind AI 的强大功能
          </motion.p>
        </div>

        {/* 操作卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className={cn(
                'group relative p-6 rounded-2xl',
                'bg-white dark:bg-gray-900',
                'border border-gray-200 dark:border-gray-700',
                'shadow-sm hover:shadow-xl',
                'transition-all duration-300',
                'overflow-hidden cursor-pointer',
                action.primary && 'ring-2 ring-primary-500/20'
              )}
              onClick={action.action}
            >
              {/* 背景渐变效果 */}
              <div className={cn(
                'absolute inset-0 opacity-0 group-hover:opacity-5',
                'bg-gradient-to-br',
                action.color,
                'transition-opacity duration-300'
              )} />

              {/* 主要内容 */}
              <div className="relative">
                {/* 图标和标题 */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    'bg-gradient-to-br',
                    action.color,
                    'text-white shadow-lg',
                    'group-hover:scale-110 transition-transform duration-300'
                  )}>
                    {action.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={cn(
                      'text-lg font-semibold mb-2',
                      'text-gray-900 dark:text-gray-100',
                      'group-hover:text-primary-600 dark:group-hover:text-primary-400',
                      'transition-colors duration-300'
                    )}>
                      {action.title}
                    </h3>
                  </div>
                </div>

                {/* 描述 */}
                <p className={cn(
                  'text-gray-600 dark:text-gray-300',
                  'leading-relaxed mb-4',
                  'text-sm'
                )}>
                  {action.description}
                </p>

                {/* 操作按钮 */}
                <Button
                  type={action.primary ? 'primary' : 'default'}
                  size="small"
                  icon={<ArrowRightOutlined />}
                  className={cn(
                    'opacity-0 group-hover:opacity-100',
                    'transition-opacity duration-300',
                    action.primary && 'bg-primary-600 border-primary-600'
                  )}
                >
                  {action.primary ? '立即开始' : '了解更多'}
                </Button>
              </div>

              {/* 装饰元素 */}
              <div className={cn(
                'absolute top-0 right-0 w-16 h-16',
                'bg-gradient-to-br',
                action.color,
                'opacity-0 group-hover:opacity-10',
                'rounded-full blur-xl',
                'transition-opacity duration-300',
                'transform translate-x-6 -translate-y-6'
              )} />
            </motion.div>
          ))}
        </div>

        {/* 底部 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full',
            'bg-primary-50 dark:bg-primary-950/50',
            'border border-primary-200 dark:border-primary-800',
            'text-primary-700 dark:text-primary-300',
            'text-sm'
          )}>
            💡 提示：所有功能都可以免费体验，无需注册
          </div>
        </motion.div>
      </div>
    </div>
  )
}
