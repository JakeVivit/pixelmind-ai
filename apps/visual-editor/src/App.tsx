import React from 'react'
import { Layout } from 'antd'
import { MainLayout } from '@layouts/MainLayout'
import { WelcomePage } from '@features/welcome/WelcomePage'
import { RealWebContainerDemo } from '@features/webcontainer/RealWebContainerDemo'
import { useAppStore } from '@core/store/useAppStore'

const { Content } = Layout

export const App: React.FC = () => {
  const { currentView } = useAppStore()

  const renderContent = () => {
    switch (currentView) {
      case 'welcome':
        return <WelcomePage />
      case 'editor':
        // TODO: Implement visual editor
        return <div>Visual Editor (Coming Soon)</div>
      case 'preview':
        // TODO: Implement preview
        return <div>Preview (Coming Soon)</div>
      case 'webcontainer':
        return <RealWebContainerDemo />
      default:
        return <WelcomePage />
    }
  }

  return (
    <MainLayout>
      <Content style={{ padding: 0, minHeight: '100vh' }}>{renderContent()}</Content>
    </MainLayout>
  )
}
