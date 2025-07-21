import React, { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Layout, Typography, Space, Button, Dropdown, Avatar, Menu } from 'antd'
import {
  MenuOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  LogoutOutlined,
  GithubOutlined,
  HomeOutlined,
  CodeOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  FolderOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { ThemeToggle } from '../components/ui/ThemeToggle'

const { Header } = Layout
const { Text } = Typography

interface MainLayoutProps {
  children: ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Navigation menu items
  const navigationItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/projects',
      icon: <FolderOutlined />,
      label: '项目管理',
    },
    {
      key: '/welcome',
      icon: <QuestionCircleOutlined />,
      label: '欢迎页',
    },
    {
      key: '/webcontainer',
      icon: <ThunderboltOutlined />,
      label: 'WebContainer 演示',
    },
    {
      key: 'editor',
      icon: <EyeOutlined />,
      label: '可视化编辑器',
      disabled: true, // Coming soon
    },
    {
      key: 'preview',
      icon: <EyeOutlined />,
      label: '预览',
      disabled: true, // Coming soon
    },
  ]

  // User menu items
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'help',
      icon: <QuestionCircleOutlined />,
      label: 'Help & Support',
    },
    {
      key: 'github',
      icon: <GithubOutlined />,
      label: 'GitHub Repository',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      danger: true,
    },
  ]

  const handleNavigationClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key)
  }

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'profile':
        console.log('Open profile')
        break
      case 'settings':
        console.log('Open settings')
        break
      case 'help':
        console.log('Open help')
        break
      case 'github':
        window.open('https://github.com/pixelmind-ai/pixelmind-ai', '_blank')
        break
      case 'logout':
        console.log('Sign out')
        break
      default:
        break
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Left side - Logo, title and navigation */}
        <Space align="center" size="large">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 32,
                height: 32,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: 16,
                cursor: 'pointer',
              }}
              onClick={() => setCurrentView('home')}
            >
              P
            </div>
            <div>
              <Text strong style={{ fontSize: 18, color: '#333' }}>
                PixelMind AI
              </Text>
              <br />
              {/* <Text type="secondary" style={{ fontSize: 12 }}>
                Visual Frontend Development
              </Text> */}
            </div>
          </div>

          {/* Navigation Menu */}
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={navigationItems}
            onClick={handleNavigationClick}
            style={{
              border: 'none',
              background: 'transparent',
              minWidth: 400,
            }}
          />
        </Space>

        {/* Right side - Actions and user menu */}
        <Space align="center" size="middle">
          {/* Quick actions */}
          <Button
            type="text"
            icon={<QuestionCircleOutlined />}
            onClick={() => console.log('Open help')}
          >
            帮助
          </Button>

          <Button
            type="text"
            icon={<GithubOutlined />}
            onClick={() => window.open('https://github.com/JakeVivit/pixelmind-ai', '_blank')}
          >
            GitHub
          </Button>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* User dropdown */}
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick,
            }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Button
              type="text"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 8px',
                height: 'auto',
              }}
            >
              <Avatar
                size="small"
                icon={<UserOutlined />}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              />
              <Text style={{ fontSize: 14 }}>User</Text>
            </Button>
          </Dropdown>
        </Space>
      </Header>

      {/* Main content area */}
      {children}
    </Layout>
  )
}
