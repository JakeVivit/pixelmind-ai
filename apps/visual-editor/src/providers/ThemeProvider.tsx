import React, { ReactNode } from 'react'
import { ConfigProvider, theme as antdTheme } from 'antd'
import type { ThemeConfig } from 'antd'
import { useTheme } from '../hooks/useTheme'

interface ThemeProviderProps {
  children: ReactNode
}

/**
 * 主题提供者组件
 * 根据当前主题模式动态切换 Ant Design 主题
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { isDark } = useTheme()

  // 基础主题配置
  const baseTheme: ThemeConfig = {
    token: {
      // 使用 Indigo 色系作为主色调
      colorPrimary: '#6366f1', // indigo-500
      colorPrimaryHover: '#4f46e5', // indigo-600
      colorPrimaryActive: '#4338ca', // indigo-700
      
      // 成功色
      colorSuccess: '#10b981', // emerald-500
      colorSuccessHover: '#059669', // emerald-600
      colorSuccessActive: '#047857', // emerald-700
      
      // 警告色
      colorWarning: '#f59e0b', // amber-500
      colorWarningHover: '#d97706', // amber-600
      colorWarningActive: '#b45309', // amber-700
      
      // 错误色
      colorError: '#ef4444', // red-500
      colorErrorHover: '#dc2626', // red-600
      colorErrorActive: '#b91c1c', // red-700
      
      // 信息色
      colorInfo: '#3b82f6', // blue-500
      colorInfoHover: '#2563eb', // blue-600
      colorInfoActive: '#1d4ed8', // blue-700
      
      // 字体设置
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
      fontSize: 14,
      fontSizeHeading1: 32,
      fontSizeHeading2: 24,
      fontSizeHeading3: 20,
      fontSizeHeading4: 16,
      fontSizeHeading5: 14,
      
      // 圆角设置
      borderRadius: 8,
      borderRadiusLG: 12,
      borderRadiusSM: 6,
      borderRadiusXS: 4,
      
      // 控件高度
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 28,
      
      // 动画时长
      motionDurationFast: '0.1s',
      motionDurationMid: '0.2s',
      motionDurationSlow: '0.3s',
      
      // 线框模式
      wireframe: false,
    },
    
    components: {
      // 按钮组件
      Button: {
        borderRadius: 8,
        controlHeight: 36,
        controlHeightLG: 44,
        controlHeightSM: 28,
        fontWeight: 500,
      },
      
      // 输入框组件
      Input: {
        borderRadius: 8,
        controlHeight: 36,
        controlHeightLG: 44,
        controlHeightSM: 28,
      },
      
      // 卡片组件
      Card: {
        borderRadius: 12,
        boxShadowTertiary: isDark 
          ? '0 4px 12px rgba(0, 0, 0, 0.15)' 
          : '0 2px 8px rgba(0, 0, 0, 0.06)',
      },
      
      // 布局组件
      Layout: {
        headerHeight: 64,
        headerBg: isDark ? '#111827' : '#ffffff',
        headerColor: isDark ? '#f9fafb' : '#111827',
        siderBg: isDark ? '#1f2937' : '#fafafa',
        triggerBg: isDark ? '#374151' : '#ffffff',
        triggerColor: isDark ? '#f9fafb' : '#111827',
      },
      
      // 菜单组件
      Menu: {
        itemBg: 'transparent',
        itemSelectedBg: isDark ? '#312e81' : '#eef2ff',
        itemSelectedColor: isDark ? '#a5b4fc' : '#4338ca',
        itemHoverBg: isDark ? '#374151' : '#f3f4f6',
        itemHoverColor: isDark ? '#f9fafb' : '#111827',
        itemColor: isDark ? '#d1d5db' : '#4b5563',
      },
      
      // 表格组件
      Table: {
        borderRadius: 8,
        headerBg: isDark ? '#374151' : '#fafafa',
        headerColor: isDark ? '#f9fafb' : '#111827',
        rowHoverBg: isDark ? '#374151' : '#f9fafb',
      },
      
      // 模态框组件
      Modal: {
        borderRadius: 12,
        headerBg: isDark ? '#1f2937' : '#ffffff',
        contentBg: isDark ? '#1f2937' : '#ffffff',
        footerBg: isDark ? '#1f2937' : '#ffffff',
      },
      
      // 抽屉组件
      Drawer: {
        colorBgElevated: isDark ? '#1f2937' : '#ffffff',
      },
      
      // 标签页组件
      Tabs: {
        itemColor: isDark ? '#9ca3af' : '#6b7280',
        itemSelectedColor: isDark ? '#a5b4fc' : '#4338ca',
        itemHoverColor: isDark ? '#d1d5db' : '#374151',
        inkBarColor: isDark ? '#a5b4fc' : '#4338ca',
      },
      
      // 通知组件
      Notification: {
        colorBgElevated: isDark ? '#1f2937' : '#ffffff',
      },
      
      // 消息组件
      Message: {
        colorBgElevated: isDark ? '#1f2937' : '#ffffff',
      },
      
      // 工具提示组件
      Tooltip: {
        colorBgSpotlight: isDark ? '#374151' : '#ffffff',
      },
    },
    
    // 根据主题模式选择算法
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  }

  return (
    <ConfigProvider theme={baseTheme}>
      {children}
    </ConfigProvider>
  )
}
