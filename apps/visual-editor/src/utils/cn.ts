import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并 Tailwind CSS 类名的工具函数
 * 自动处理类名冲突和条件类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 根据条件返回类名的工具函数
 */
export function conditionalClass(
  condition: boolean,
  trueClass: string,
  falseClass: string = ''
) {
  return condition ? trueClass : falseClass
}

/**
 * 主题相关的类名工具
 */
export const themeClasses = {
  // 背景色
  bg: {
    primary: 'bg-white dark:bg-gray-950',
    secondary: 'bg-gray-50 dark:bg-gray-900',
    card: 'bg-white dark:bg-gray-900',
    overlay: 'bg-black/50 dark:bg-black/70',
  },
  
  // 文字色
  text: {
    primary: 'text-gray-900 dark:text-gray-100',
    secondary: 'text-gray-600 dark:text-gray-400',
    muted: 'text-gray-500 dark:text-gray-500',
    accent: 'text-primary-600 dark:text-primary-400',
  },
  
  // 边框色
  border: {
    default: 'border-gray-200 dark:border-gray-700',
    light: 'border-gray-100 dark:border-gray-800',
    accent: 'border-primary-200 dark:border-primary-800',
  },
  
  // 阴影
  shadow: {
    sm: 'shadow-sm shadow-gray-200/50 dark:shadow-gray-900/50',
    md: 'shadow-md shadow-gray-200/50 dark:shadow-gray-900/50',
    lg: 'shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50',
  },
}

/**
 * 获取主题相关的类名
 */
export function getThemeClass(
  category: keyof typeof themeClasses,
  variant: string
): string {
  const categoryClasses = themeClasses[category] as Record<string, string>
  return categoryClasses[variant] || ''
}
