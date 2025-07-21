import React from 'react'
import { cn } from '../../../utils/cn'

interface TemplateCardProps {
  template: {
    id: string
    name: string
    description: string
    author: string
    icon: string
    color: string
  }
  onUse?: () => void
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onUse }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6',
        'hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200',
        'group cursor-pointer'
      )}
    >
      {/* 图标和标题 */}
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
          style={{ backgroundColor: template.color }}
        >
          {template.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-gray-900 dark:text-white font-medium text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {template.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">By {template.author}</p>
        </div>
      </div>

      {/* 描述 */}
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-6 leading-relaxed">
        {template.description}
      </p>

      {/* 使用按钮 */}
      <button
        onClick={e => {
          e.stopPropagation()
          onUse?.()
        }}
        className={cn(
          'w-full py-2 px-4 rounded-lg text-sm font-medium',
          'bg-blue-600 hover:bg-blue-700 text-white',
          'transition-colors duration-200'
        )}
      >
        Use this template
      </button>
    </div>
  )
}
