// React 组件模板

export const REACT_COMPONENTS_TEMPLATE = {
  'src/components/layout/Layout.tsx': `import React from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}`,

  'src/components/layout/Header.tsx': `import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
            {{projectName}}
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              首页
            </Link>
            <Link 
              to="/about" 
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              关于
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              登录
            </Button>
            <Button size="sm">
              注册
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}`,

  'src/components/layout/Footer.tsx': `import React from 'react'

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 {{projectName}}. 由 PixelMind AI 生成.</p>
        </div>
      </div>
    </footer>
  )
}`,

  'src/components/ui/Button.tsx': `import React from 'react'
import { cn } from '../../utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
  children: React.ReactNode
}

export function Button({ 
  className, 
  variant = 'default', 
  size = 'md', 
  asChild = false,
  children,
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800'
  }
  
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg'
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(baseClasses, variants[variant], sizes[size], className),
      ...props
    })
  }

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}`,

  'src/components/ui/Card.tsx': `import React from 'react'
import { cn } from '../../utils/cn'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}`,

  'src/components/ui/Input.tsx': `import React from 'react'
import { cn } from '../../utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}`,

  'src/utils/cn.ts': `import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`,

  'src/utils/constants.ts': `export const APP_NAME = '{{projectName}}'
export const APP_DESCRIPTION = '{{projectDescription}}'

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
} as const`,

  'src/hooks/useLocalStorage.ts': `import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // 获取初始值
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(\`Error reading localStorage key "\${key}":\`, error)
      return initialValue
    }
  })

  // 设置值的函数
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(\`Error setting localStorage key "\${key}":\`, error)
    }
  }

  return [storedValue, setValue] as const
}`,

  'src/types/index.ts': `// 通用类型定义

export interface User {
  id: string
  name: string
  email: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export type Theme = 'light' | 'dark' | 'system'`
}

// 合并所有模板文件
export function getAllTemplateFiles(): Record<string, string> {
  return {
    ...REACT_COMPONENTS_TEMPLATE
  }
}
