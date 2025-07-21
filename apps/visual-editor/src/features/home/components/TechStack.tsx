import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../../utils/cn'

interface TechItem {
  name: string
  logo: string
  description: string
  category: string
}

const techStack: TechItem[] = [
  // 前端框架
  { name: 'React', logo: '⚛️', description: '现代化的前端框架', category: '前端框架' },
  { name: 'Vue.js', logo: '💚', description: '渐进式前端框架', category: '前端框架' },
  { name: 'TypeScript', logo: '🔷', description: '类型安全的 JavaScript', category: '前端框架' },
  
  // UI 库
  { name: 'Ant Design', logo: '🐜', description: '企业级 UI 设计语言', category: 'UI 库' },
  { name: 'TailwindCSS', logo: '🎨', description: '原子化 CSS 框架', category: 'UI 库' },
  { name: 'Framer Motion', logo: '🎭', description: '强大的动画库', category: 'UI 库' },
  
  // 开发工具
  { name: 'WebContainer', logo: '📦', description: '浏览器中的 Node.js 环境', category: '开发工具' },
  { name: 'Monaco Editor', logo: '📝', description: 'VS Code 编辑器内核', category: '开发工具' },
  { name: 'Vite', logo: '⚡', description: '极速的构建工具', category: '开发工具' },
  
  // AI 技术
  { name: 'Gemini AI', logo: '🤖', description: 'Google 的大语言模型', category: 'AI 技术' },
  { name: 'Code Generation', logo: '🧠', description: '智能代码生成', category: 'AI 技术' },
  { name: 'Natural Language', logo: '💬', description: '自然语言处理', category: 'AI 技术' },
]

const categories = ['前端框架', 'UI 库', '开发工具', 'AI 技术']

/**
 * 技术栈展示组件
 */
export const TechStack: React.FC = () => {
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
            现代化技术栈
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
            基于最新的前端技术和 AI 能力构建，为你提供最佳的开发体验
          </motion.p>
        </div>

        {/* 技术栈分类展示 */}
        <div className="space-y-12">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
              viewport={{ once: true }}
            >
              {/* 分类标题 */}
              <h3 className={cn(
                'text-xl font-semibold mb-6',
                'text-gray-800 dark:text-gray-200',
                'border-l-4 border-primary-500 pl-4'
              )}>
                {category}
              </h3>

              {/* 技术项目网格 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {techStack
                  .filter(tech => tech.category === category)
                  .map((tech, index) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05 }}
                      className={cn(
                        'group p-4 rounded-xl',
                        'bg-white dark:bg-gray-900',
                        'border border-gray-200 dark:border-gray-700',
                        'shadow-sm hover:shadow-md',
                        'transition-all duration-300',
                        'cursor-pointer'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {/* Logo */}
                        <div className={cn(
                          'text-2xl w-10 h-10 flex items-center justify-center',
                          'rounded-lg bg-gray-50 dark:bg-gray-800',
                          'group-hover:scale-110 transition-transform duration-300'
                        )}>
                          {tech.logo}
                        </div>

                        {/* 信息 */}
                        <div className="flex-1">
                          <h4 className={cn(
                            'font-medium text-gray-900 dark:text-gray-100',
                            'group-hover:text-primary-600 dark:group-hover:text-primary-400',
                            'transition-colors duration-300'
                          )}>
                            {tech.name}
                          </h4>
                          <p className={cn(
                            'text-sm text-gray-500 dark:text-gray-400',
                            'mt-1'
                          )}>
                            {tech.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 底部统计 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className={cn(
            'mt-16 p-8 rounded-2xl',
            'bg-gradient-to-r from-primary-50 to-primary-100',
            'dark:from-primary-950/50 dark:to-primary-900/50',
            'border border-primary-200 dark:border-primary-800'
          )}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className={cn(
                'text-2xl md:text-3xl font-bold',
                'text-primary-600 dark:text-primary-400',
                'mb-2'
              )}>
                12+
              </div>
              <div className={cn(
                'text-sm text-gray-600 dark:text-gray-300'
              )}>
                核心技术
              </div>
            </div>
            
            <div>
              <div className={cn(
                'text-2xl md:text-3xl font-bold',
                'text-primary-600 dark:text-primary-400',
                'mb-2'
              )}>
                100%
              </div>
              <div className={cn(
                'text-sm text-gray-600 dark:text-gray-300'
              )}>
                浏览器运行
              </div>
            </div>
            
            <div>
              <div className={cn(
                'text-2xl md:text-3xl font-bold',
                'text-primary-600 dark:text-primary-400',
                'mb-2'
              )}>
                0ms
              </div>
              <div className={cn(
                'text-sm text-gray-600 dark:text-gray-300'
              )}>
                启动时间
              </div>
            </div>
            
            <div>
              <div className={cn(
                'text-2xl md:text-3xl font-bold',
                'text-primary-600 dark:text-primary-400',
                'mb-2'
              )}>
                ∞
              </div>
              <div className={cn(
                'text-sm text-gray-600 dark:text-gray-300'
              )}>
                创意可能
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
