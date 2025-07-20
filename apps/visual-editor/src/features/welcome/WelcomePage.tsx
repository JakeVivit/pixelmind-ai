import React from 'react'
import { Layout, Typography, Button, Card, Row, Col, Space, Divider, Tag, Steps, List } from 'antd'
import {
  RocketOutlined,
  CodeOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  ApiOutlined,
  BulbOutlined,
  GithubOutlined,
  PlayCircleOutlined,
  BookOutlined,
} from '@ant-design/icons'
import { useAppStore } from '@core/store/useAppStore'

const { Content } = Layout
const { Title, Paragraph, Text } = Typography

export const WelcomePage: React.FC = () => {
  const { setCurrentView } = useAppStore()

  const features = [
    {
      icon: <CodeOutlined style={{ fontSize: 24, color: '#667eea' }} />,
      title: 'Visual Component Builder',
      description: 'Drag-and-drop interface for creating UI components with real-time preview',
    },
    {
      icon: <BulbOutlined style={{ fontSize: 24, color: '#667eea' }} />,
      title: 'AI-Powered Generation',
      description: 'Natural language to React/Vue component conversion using advanced AI',
    },
    {
      icon: <EyeOutlined style={{ fontSize: 24, color: '#667eea' }} />,
      title: 'Real-time Preview',
      description: 'Instant feedback with hot module replacement and live updates',
    },
    {
      icon: <ApiOutlined style={{ fontSize: 24, color: '#667eea' }} />,
      title: 'WebContainers Integration',
      description: 'Full development environment running entirely in your browser',
    },
  ]

  const techStack = [
    { name: 'React 18', color: '#61dafb' },
    { name: 'TypeScript', color: '#3178c6' },
    { name: 'Vite', color: '#646cff' },
    { name: 'Ant Design', color: '#1890ff' },
    { name: 'Zustand', color: '#ff6b6b' },
    { name: 'Monaco Editor', color: '#007acc' },
    { name: 'WebContainers', color: '#000' },
    { name: 'Gemini AI', color: '#4285f4' },
  ]

  const quickStartSteps = [
    {
      title: 'Choose Framework',
      description: 'Select React or Vue as your target framework',
    },
    {
      title: 'Pick UI Library',
      description: 'Choose from Ant Design or Material UI components',
    },
    {
      title: 'Start Building',
      description: 'Use drag-and-drop or AI prompts to create components',
    },
    {
      title: 'Preview & Export',
      description: 'See live preview and export your generated code',
    },
  ]

  const resources = [
    {
      title: 'Documentation',
      description: 'Complete guide to using PixelMind AI',
      icon: <BookOutlined />,
      action: () => console.log('Open docs'),
    },
    {
      title: 'GitHub Repository',
      description: 'Source code and contribution guidelines',
      icon: <GithubOutlined />,
      action: () => window.open('https://github.com/pixelmind-ai/pixelmind-ai', '_blank'),
    },
    {
      title: 'WebContainer Demo',
      description: 'Test WebContainer performance and capabilities',
      icon: <PlayCircleOutlined />,
      action: () => setCurrentView('webcontainer'),
    },
  ]

  return (
    <Content style={{ padding: 0 }}>
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '80px 24px',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Title level={1} style={{ color: 'white', fontSize: 48, marginBottom: 16 }}>
            Welcome to PixelMind AI
          </Title>
          <Paragraph style={{ fontSize: 20, color: 'rgba(255,255,255,0.9)', marginBottom: 32 }}>
            The future of frontend development is here. Create stunning React and Vue components
            using AI-powered visual tools, all running in your browser.
          </Paragraph>
          <Space size="large">
            <Button
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              onClick={() => setCurrentView('webcontainer')}
              style={{
                height: 48,
                fontSize: 16,
                background: 'rgba(255,255,255,0.2)',
                borderColor: 'rgba(255,255,255,0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              Try WebContainer Demo
            </Button>
            <Button
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={() => setCurrentView('webcontainer')}
              style={{
                height: 48,
                fontSize: 16,
                background: 'transparent',
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'white',
              }}
            >
              Test Performance
            </Button>
          </Space>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: '80px 24px', background: '#fafafa' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>
            Powerful Features
          </Title>
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card
                  hoverable
                  style={{
                    height: '100%',
                    textAlign: 'center',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <div style={{ marginBottom: 16 }}>{feature.icon}</div>
                  <Title level={4} style={{ marginBottom: 12 }}>
                    {feature.title}
                  </Title>
                  <Paragraph type="secondary">{feature.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Technology Stack */}
      <div style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>
            Built with Modern Technologies
          </Title>
          <div style={{ textAlign: 'center' }}>
            <Space wrap size="middle">
              {techStack.map((tech, index) => (
                <Tag
                  key={index}
                  style={{
                    padding: '8px 16px',
                    fontSize: 14,
                    borderRadius: 20,
                    border: `2px solid ${tech.color}`,
                    color: tech.color,
                    background: 'transparent',
                  }}
                >
                  {tech.name}
                </Tag>
              ))}
            </Space>
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div style={{ padding: '80px 24px', background: '#fafafa' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Row gutter={48} align="middle">
            <Col xs={24} lg={12}>
              <Title level={2} style={{ marginBottom: 24 }}>
                Get Started in Minutes
              </Title>
              <Paragraph style={{ fontSize: 16, marginBottom: 32 }}>
                PixelMind AI makes frontend development accessible to everyone. Follow these simple
                steps to create your first AI-generated component.
              </Paragraph>
              <Button
                type="primary"
                size="large"
                icon={<ThunderboltOutlined />}
                onClick={() => setCurrentView('editor')}
              >
                Try It Now
              </Button>
            </Col>
            <Col xs={24} lg={12}>
              <Steps
                direction="vertical"
                current={-1}
                items={quickStartSteps}
                style={{ background: 'white', padding: 24, borderRadius: 8 }}
              />
            </Col>
          </Row>
        </div>
      </div>

      {/* Resources Section */}
      <div style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>
            Resources & Support
          </Title>
          <Row gutter={[24, 24]}>
            {resources.map((resource, index) => (
              <Col xs={24} md={8} key={index}>
                <Card
                  hoverable
                  onClick={resource.action}
                  style={{
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <div style={{ fontSize: 32, color: '#667eea', marginBottom: 16 }}>
                    {resource.icon}
                  </div>
                  <Title level={4} style={{ marginBottom: 12 }}>
                    {resource.title}
                  </Title>
                  <Paragraph type="secondary">{resource.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          background: '#001529',
          color: 'white',
          padding: '40px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Paragraph style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 16 }}>
            PixelMind AI - Revolutionizing Frontend Development with AI
          </Paragraph>
          <Text style={{ color: 'rgba(255,255,255,0.6)' }}>
            Version 0.1.0 | Built with ❤️ by the PixelMind AI Team
          </Text>
        </div>
      </div>
    </Content>
  )
}
