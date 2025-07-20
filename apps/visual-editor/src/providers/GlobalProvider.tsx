import React, { ReactNode, useEffect } from 'react'
import { App, notification } from 'antd'
import { useAppStore } from '@core/store/useAppStore'

interface GlobalProviderProps {
  children: ReactNode
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const { webContainerError, aiError } = useAppStore()

  // Configure global notification settings
  useEffect(() => {
    notification.config({
      placement: 'topRight',
      duration: 4.5,
      maxCount: 3,
    })
  }, [])

  // Handle WebContainer errors
  useEffect(() => {
    if (webContainerError) {
      notification.error({
        message: 'WebContainer Error',
        description: webContainerError,
        duration: 6,
      })
    }
  }, [webContainerError])

  // Handle AI errors
  useEffect(() => {
    if (aiError) {
      notification.error({
        message: 'AI Processing Error',
        description: aiError,
        duration: 6,
      })
    }
  }, [aiError])

  return (
    <App>
      {children}
    </App>
  )
}
