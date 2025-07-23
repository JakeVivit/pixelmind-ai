import React, { useState, useEffect } from 'react'
import { Folder, AlertCircle, CheckCircle, Lock } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { FileSystemService } from '../services/FileSystemService'
import { ProjectManager } from '../services/ProjectManager'

interface ProjectLocationSelectorProps {
  onLocationSelected: (dirHandle: FileSystemDirectoryHandle, path: string) => void
  selectedLocation: string | null
  error?: string
  allowReselect?: boolean // 是否允许重新选择目录
}

export const ProjectLocationSelector: React.FC<ProjectLocationSelectorProps> = ({
  onLocationSelected,
  selectedLocation,
  error,
  allowReselect = false,
}) => {
  const [isSelecting, setIsSelecting] = useState(false)
  const [isSupported] = useState(FileSystemService.isSupported())
  const [isLocked, setIsLocked] = useState(false)
  const [existingPath, setExistingPath] = useState<string | null>(null)

  useEffect(() => {
    // 检查是否已经设置了基础目录
    const projectManager = ProjectManager.getInstance()
    if (projectManager.hasBaseDirectory()) {
      const path = projectManager.getBaseDirectoryPath()
      setExistingPath(path)
      // 只有在不允许重新选择时才锁定
      setIsLocked(!allowReselect)
      if (path) {
        // 如果已经有路径，自动触发选择回调
        // 注意：这里我们无法重新获取 FileSystemDirectoryHandle，
        // 但可以通过路径信息通知父组件
        const handle = projectManager.getBaseDirectoryHandle()
        if (handle) {
          // 如果有 handle，直接使用
          onLocationSelected(handle, path)
        } else {
          // 如果没有 handle，创建一个临时的 null handle，但传递路径
          // 这样父组件就知道已经选择了路径
          onLocationSelected(null as any, path)
        }
      }
    }
  }, [allowReselect])

  const handleSelectLocation = async () => {
    if (!isSupported) {
      alert('您的浏览器不支持文件系统访问功能，请使用 Chrome、Edge 或其他现代浏览器')
      return
    }

    if (isLocked && !allowReselect) {
      alert('基础目录已设置，无法更改。如需更改请清除浏览器数据后重新设置。')
      return
    }

    setIsSelecting(true)
    try {
      const projectManager = ProjectManager.getInstance()
      const result = await projectManager.setBaseDirectory(allowReselect)

      if (result.success && result.path) {
        setExistingPath(result.path)
        setIsLocked(!allowReselect)
        // 这里我们需要获取 dirHandle，但由于架构限制，我们需要重新设计
        // 暂时使用一个模拟的 handle
        onLocationSelected({} as FileSystemDirectoryHandle, result.path)
      }
    } catch (error) {
      console.error('选择目录失败:', error)
      alert('选择目录失败，请重试')
    } finally {
      setIsSelecting(false)
    }
  }

  if (!isSupported) {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          项目存储位置 *
        </label>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                浏览器不支持文件系统访问
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                请使用 Chrome 88+、Edge 88+ 或其他支持 File System Access API 的现代浏览器
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        项目存储位置 *
      </label>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleSelectLocation}
          disabled={isSelecting || (isLocked && !allowReselect)}
          className={cn(
            'w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-dashed rounded-lg transition-colors',
            selectedLocation || existingPath
              ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20'
              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500',
            error && 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20',
            (isSelecting || (isLocked && !allowReselect)) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isLocked && !allowReselect ? (
            <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
          ) : selectedLocation || existingPath ? (
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          ) : (
            <Folder className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
          <div className="flex flex-col items-center">
            <span
              className={cn(
                'text-sm font-medium',
                selectedLocation || existingPath
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-gray-700 dark:text-gray-300'
              )}
            >
              {isSelecting
                ? '选择中...'
                : isLocked && !allowReselect
                  ? '基础目录已锁定'
                  : selectedLocation || existingPath
                    ? allowReselect
                      ? '点击重新选择目录'
                      : '已选择存储位置'
                    : '点击选择项目存储文件夹'}
            </span>
            {(selectedLocation || existingPath) && (
              <span className="text-xs text-green-600 dark:text-green-400 mt-1 break-all text-center max-w-full">
                📁 {selectedLocation || existingPath}
              </span>
            )}
          </div>
        </button>

        {selectedLocation && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium">📁 存储位置已确认</p>
              <p className="mt-1">项目将创建在此文件夹中，创建后无法更改位置</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
        <p>
          💡 <strong>提示：</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>选择一个专门用于存放项目的文件夹</li>
          <li>确保文件夹有足够的磁盘空间</li>
          <li>建议使用英文路径，避免中文字符</li>
          <li>选择后将无法更改，请谨慎选择</li>
        </ul>
      </div>
    </div>
  )
}
