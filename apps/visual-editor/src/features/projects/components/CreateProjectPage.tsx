import React, { useState } from 'react'
import { cn } from '../../../utils/cn'
import { ArrowLeft, Folder, Globe, Lock } from 'lucide-react'

interface CreateProjectPageProps {
  onBack: () => void
  onCreate: (projectData: any) => void
}

export const CreateProjectPage: React.FC<CreateProjectPageProps> = ({ onBack, onCreate }) => {
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState('blank')

  const templates = [
    {
      id: 'blank',
      name: 'Blank',
      description: 'Start with a blank canvas or import any packages you need.',
      icon: '📄',
    },
    {
      id: 'react',
      name: 'React',
      description:
        'A popular JavaScript library for building user interfaces based on UI components.',
      icon: '⚛️',
    },
    {
      id: 'vue',
      name: 'Vue',
      description: 'A progressive framework for building user interfaces.',
      icon: '💚',
    },
    {
      id: 'next',
      name: 'Next.js',
      description: 'A React framework for production with hybrid static & server rendering.',
      icon: '▲',
    },
  ]

  const handleCreate = () => {
    if (!projectName.trim()) return

    const projectData = {
      name: projectName,
      description,
      template: selectedTemplate,
      isPrivate,
      createdAt: new Date().toISOString(),
    }

    onCreate(projectData)
  }

  return (
    <div className="h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-auto">
      {/* 头部 */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">创建新项目</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">选择模板并配置你的新项目</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        {/* 项目基本信息 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">项目信息</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                项目名称 *
              </label>
              <input
                type="text"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                placeholder="输入项目名称"
                className={cn(
                  'w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg',
                  'text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
                  'focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
                  'transition-colors duration-200'
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">项目描述</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="描述你的项目..."
                rows={3}
                className={cn(
                  'w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg',
                  'text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none',
                  'focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
                  'transition-colors duration-200'
                )}
              />
            </div>

            {/* 可见性设置 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                项目可见性
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
                  <input
                    type="radio"
                    name="visibility"
                    checked={isPrivate}
                    onChange={() => setIsPrivate(true)}
                    className="text-blue-500"
                  />
                  <Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">私有</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      只有你可以访问此项目
                    </div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors">
                  <input
                    type="radio"
                    name="visibility"
                    checked={!isPrivate}
                    onChange={() => setIsPrivate(false)}
                    className="text-blue-500"
                  />
                  <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">公开</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      任何人都可以查看此项目
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 选择模板 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">选择模板</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map(template => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={cn(
                  'p-4 border rounded-lg cursor-pointer transition-all duration-200',
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500'
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{template.icon}</span>
                  <h3 className="font-medium text-gray-900 dark:text-white">{template.name}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 创建按钮 */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleCreate}
            disabled={!projectName.trim()}
            className={cn(
              'px-6 py-3 rounded-lg font-medium transition-colors',
              projectName.trim()
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            )}
          >
            创建项目
          </button>
        </div>
      </div>
    </div>
  )
}
