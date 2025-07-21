import React from 'react'
import { cn } from '../../../utils/cn'
import { Calendar, Users, HardDrive, MoreHorizontal, GitBranch } from 'lucide-react'

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description: string
    template: string
    lastModified: string
    size: string
    language: string
    isPrivate?: boolean
    avatar?: string
  }
  onClick?: () => void
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const getLanguageIcon = (language: string) => {
    switch (language.toLowerCase()) {
      case 'react':
        return '⚛️'
      case 'vue':
        return '💚'
      case 'angular':
        return '🅰️'
      case 'javascript':
        return '🟨'
      case 'typescript':
        return '🔷'
      default:
        return '📄'
    }
  }

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4',
        'hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200',
        'cursor-pointer group'
      )}
      onClick={onClick}
    >
      {/* 头部 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <GitBranch className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-white font-medium text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {project.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
              Created from {project.template}
            </p>
          </div>
        </div>

        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
          <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* 描述 */}
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
        {project.description}
      </p>

      {/* 底部信息 */}
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-4">
          {/* 语言 */}
          <div className="flex items-center gap-1">
            <span>{getLanguageIcon(project.language)}</span>
            <span>{project.language}</span>
          </div>

          {/* 大小 */}
          <div className="flex items-center gap-1">
            <HardDrive className="w-3 h-3" />
            <span>{project.size}</span>
          </div>
        </div>

        {/* 最后修改时间 */}
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{project.lastModified}</span>
        </div>
      </div>

      {/* 私有标识 */}
      {project.isPrivate && (
        <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
          <Users className="w-3 h-3" />
          <span>Private</span>
        </div>
      )}
    </div>
  )
}
