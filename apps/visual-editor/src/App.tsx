import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from 'antd'
import { MainLayout } from '@layouts/MainLayout'
import { WelcomePage } from '@features/welcome/WelcomePage'
import { RealWebContainerDemo } from '@features/webcontainer/RealWebContainerDemo'
import { HomePage } from '@features/home/HomePage'
import { ProjectsPageNew as ProjectsPage } from '@features/projects/ProjectsPageNew'
import { WorkspacePage } from '@features/workspace/WorkspacePage'

const { Content } = Layout

/**
 * Main application component with React Router
 */
export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 首页 - 使用主布局 */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Content style={{ padding: 0, minHeight: '100vh' }}>
                <HomePage />
              </Content>
            </MainLayout>
          }
        />

        {/* 欢迎页 - 使用主布局 */}
        <Route
          path="/welcome"
          element={
            <MainLayout>
              <Content style={{ padding: 0, minHeight: '100vh' }}>
                <WelcomePage />
              </Content>
            </MainLayout>
          }
        />

        {/* WebContainer 演示 - 使用主布局 */}
        <Route
          path="/webcontainer"
          element={
            <MainLayout>
              <Content style={{ padding: 0, minHeight: '100vh' }}>
                <RealWebContainerDemo />
              </Content>
            </MainLayout>
          }
        />

        {/* 项目管理页面 - 独立布局 */}
        <Route path="/projects" element={<ProjectsPage />} />

        {/* 项目工作台 - 独立布局，带项目ID参数 */}
        <Route path="/workspace/:projectId" element={<WorkspacePage />} />

        {/* 默认重定向到首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
