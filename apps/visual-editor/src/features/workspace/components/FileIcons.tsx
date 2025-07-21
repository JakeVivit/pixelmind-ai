import React from 'react'
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  Code, 
  Image, 
  Settings,
  Package,
  FileJson,
  Puzzle
} from 'lucide-react'

interface FileIconProps {
  type: string
  isExpanded?: boolean
  className?: string
}

export const FileIcon: React.FC<FileIconProps> = ({ type, isExpanded, className = "w-4 h-4" }) => {
  // 根据文件类型返回对应的图标和颜色
  switch (type) {
    case 'folder':
      return isExpanded ? 
        <FolderOpen className={`${className} text-blue-500`} /> : 
        <Folder className={`${className} text-blue-500`} />
    
    case 'react':
    case 'jsx':
    case 'tsx':
      return <div className={`${className} flex items-center justify-center text-blue-400 font-bold text-xs`}>⚛</div>
    
    case 'javascript':
    case 'js':
      return <div className={`${className} flex items-center justify-center text-yellow-500 font-bold text-xs`}>JS</div>
    
    case 'typescript':
    case 'ts':
      return <div className={`${className} flex items-center justify-center text-blue-600 font-bold text-xs`}>TS</div>
    
    case 'css':
      return <div className={`${className} flex items-center justify-center text-blue-500 font-bold text-xs`}>#</div>
    
    case 'html':
      return <div className={`${className} flex items-center justify-center text-orange-500 font-bold text-xs`}>H</div>
    
    case 'json':
      return <FileJson className={`${className} text-yellow-600`} />
    
    case 'package':
      return <Package className={`${className} text-green-600`} />
    
    case 'config':
      return <Settings className={`${className} text-gray-500`} />
    
    case 'image':
      return <Image className={`${className} text-purple-500`} />
    
    case 'component':
      return <Puzzle className={`${className} text-purple-500`} />
    
    case 'page':
      return <div className={`${className} flex items-center justify-center text-gray-600 text-xs`}>📄</div>
    
    case 'gitignore':
      return <div className={`${className} flex items-center justify-center text-gray-500 font-bold text-xs`}>◆</div>
    
    case 'readme':
      return <div className={`${className} flex items-center justify-center text-blue-600 font-bold text-xs`}>ⓘ</div>
    
    case 'license':
      return <div className={`${className} flex items-center justify-center text-yellow-600 font-bold text-xs`}>🔒</div>
    
    case 'svg':
      return <div className={`${className} flex items-center justify-center text-purple-500 font-bold text-xs`}>🎨</div>
    
    default:
      return <FileText className={`${className} text-gray-500`} />
  }
}

// 根据文件名获取文件类型
export const getFileType = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase()
  
  if (fileName === '.gitignore') return 'gitignore'
  if (fileName.toLowerCase().includes('readme')) return 'readme'
  if (fileName.toLowerCase().includes('license')) return 'license'
  if (fileName.toLowerCase().includes('package')) return 'package'
  
  switch (extension) {
    case 'jsx':
    case 'tsx':
      return 'react'
    case 'js':
      return 'javascript'
    case 'ts':
      return 'typescript'
    case 'css':
    case 'scss':
    case 'sass':
    case 'less':
      return 'css'
    case 'html':
    case 'htm':
      return 'html'
    case 'json':
      return 'json'
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'webp':
    case 'svg':
      return extension === 'svg' ? 'svg' : 'image'
    case 'config':
    case 'conf':
      return 'config'
    default:
      return 'file'
  }
}
