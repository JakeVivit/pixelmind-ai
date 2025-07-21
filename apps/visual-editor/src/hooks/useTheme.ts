import { useState, useEffect } from 'react'

export type Theme = 'light' | 'dark' | 'system'

interface UseThemeReturn {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDark: boolean
  toggleTheme: () => void
}

/**
 * 主题切换 Hook
 * 支持明亮、暗黑和跟随系统三种模式
 */
export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>(() => {
    // 从 localStorage 读取保存的主题设置
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pixelmind-theme') as Theme
      return saved || 'system'
    }
    return 'system'
  })

  const [isDark, setIsDark] = useState(false)

  // 获取系统主题偏好
  const getSystemTheme = (): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  // 应用主题到 DOM
  const applyTheme = (newTheme: Theme) => {
    if (typeof window === 'undefined') return

    const root = window.document.documentElement
    const isDarkMode = newTheme === 'dark' || (newTheme === 'system' && getSystemTheme())

    // 更新 DOM 类名
    if (isDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    setIsDark(isDarkMode)
  }

  // 设置主题
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('pixelmind-theme', newTheme)
    applyTheme(newTheme)
  }

  // 切换主题（在 light 和 dark 之间切换）
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  // 监听系统主题变化
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    
    // 初始化主题
    applyTheme(theme)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  return {
    theme,
    setTheme,
    isDark,
    toggleTheme,
  }
}

/**
 * 主题切换组件的配置
 */
export const themeConfig = {
  themes: [
    { value: 'light', label: '明亮模式', icon: '☀️' },
    { value: 'dark', label: '暗黑模式', icon: '🌙' },
    { value: 'system', label: '跟随系统', icon: '💻' },
  ] as const,
}

/**
 * 获取主题图标
 */
export function getThemeIcon(theme: Theme): string {
  const config = themeConfig.themes.find(t => t.value === theme)
  return config?.icon || '💻'
}

/**
 * 获取主题标签
 */
export function getThemeLabel(theme: Theme): string {
  const config = themeConfig.themes.find(t => t.value === theme)
  return config?.label || '跟随系统'
}
