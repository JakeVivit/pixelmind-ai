import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { UI_LIBRARIES } from '../utils/constants'
import type { UILibrary } from '../types/project'

interface UILibrarySelectorProps {
  selectedLibrary: string
  onLibrarySelect: (libraryId: string) => void
  error?: string
}

export const UILibrarySelector: React.FC<UILibrarySelectorProps> = ({
  selectedLibrary,
  onLibrarySelect,
  error
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          UI 组件库选择 *
        </label>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          选择一个 UI 组件库，Tailwind CSS 将自动包含
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {UI_LIBRARIES.map((library) => (
          <UILibraryCard
            key={library.id}
            library={library}
            isSelected={selectedLibrary === library.id}
            onSelect={() => onLibrarySelect(library.id)}
          />
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="text-sm text-blue-800 dark:text-blue-200">
          <p className="font-medium">🎨 关于 UI 组件库</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li><strong>Tailwind CSS</strong> 将自动包含在所有项目中</li>
            <li>选择的 UI 组件库将与 Tailwind CSS 配合使用</li>
            <li>可以混合使用两者的样式系统</li>
            <li>项目创建后可以手动添加其他 UI 库</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

interface UILibraryCardProps {
  library: UILibrary
  isSelected: boolean
  onSelect: () => void
}

const UILibraryCard: React.FC<UILibraryCardProps> = ({
  library,
  isSelected,
  onSelect
}) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'relative p-4 border-2 rounded-lg text-left transition-all duration-200',
        'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
      )}
    >
      {isSelected && (
        <div className="absolute top-3 right-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      <div className="pr-8">
        <h3 className={cn(
          'font-semibold text-base mb-2',
          isSelected 
            ? 'text-blue-700 dark:text-blue-300' 
            : 'text-gray-900 dark:text-white'
        )}>
          {library.name}
        </h3>
        
        <p className={cn(
          'text-sm mb-3 leading-relaxed',
          isSelected 
            ? 'text-blue-600 dark:text-blue-400' 
            : 'text-gray-600 dark:text-gray-400'
        )}>
          {library.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              包名:
            </span>
            <code className={cn(
              'text-xs px-2 py-1 rounded font-mono',
              isSelected
                ? 'bg-blue-100 dark:bg-blue-800/30 text-blue-700 dark:text-blue-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            )}>
              {library.packageName}
            </code>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">安装命令:</span>
            <code className={cn(
              'block mt-1 p-2 rounded font-mono text-xs',
              isSelected
                ? 'bg-blue-100 dark:bg-blue-800/30 text-blue-700 dark:text-blue-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            )}>
              {library.installCommand}
            </code>
          </div>
        </div>
      </div>
    </button>
  )
}
