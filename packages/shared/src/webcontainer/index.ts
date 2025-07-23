// WebContainer utilities for browser-based development environment

import type { WebContainerFileTree, WebContainerFile, WebContainerDirectory } from '../types'

/**
 * Create a WebContainer file object
 */
export function createWebContainerFile(contents: string): WebContainerFile {
  return {
    file: {
      contents,
    },
  }
}

/**
 * Create a WebContainer directory object
 */
export function createWebContainerDirectory(
  files: Record<string, WebContainerFile | WebContainerDirectory>
): WebContainerDirectory {
  return {
    directory: files,
  }
}

/**
 * Generate a basic React project file tree for WebContainer
 */
export function generateReactProjectTree(projectName: string): WebContainerFileTree {
  return {
    'package.json': createWebContainerFile(
      JSON.stringify(
        {
          name: projectName,
          private: true,
          version: '0.0.0',
          type: 'module',
          scripts: {
            dev: 'vite --host',
            build: 'tsc && vite build',
            preview: 'vite preview --host',
          },
          dependencies: {
            react: '^18.2.0',
            'react-dom': '^18.2.0',
            antd: '^5.12.0',
            '@ant-design/icons': '^5.2.0',
          },
          devDependencies: {
            '@types/react': '^18.2.0',
            '@types/react-dom': '^18.2.0',
            '@vitejs/plugin-react': '^4.2.0',
            typescript: '^5.3.0',
            vite: '^5.0.0',
          },
        },
        null,
        2
      )
    ),

    'index.html': createWebContainerFile(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`),

    'vite.config.ts': createWebContainerFile(`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`),

    'tsconfig.json': createWebContainerFile(
      JSON.stringify(
        {
          compilerOptions: {
            target: 'ES2020',
            useDefineForClassFields: true,
            lib: ['ES2020', 'DOM', 'DOM.Iterable'],
            module: 'ESNext',
            skipLibCheck: true,
            moduleResolution: 'bundler',
            allowImportingTsExtensions: true,
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
            jsx: 'react-jsx',
            strict: true,
            noUnusedLocals: true,
            noUnusedParameters: true,
            noFallthroughCasesInSwitch: true,
          },
          include: ['src'],
          references: [{ path: './tsconfig.node.json' }],
        },
        null,
        2
      )
    ),

    src: createWebContainerDirectory({
      'main.tsx': createWebContainerFile(`import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import App from './App.tsx'
import './index.css'

// PixelMind 元素选择器支持
if (typeof window !== 'undefined') {
  console.log('PixelMind: 设置消息监听器')

  window.addEventListener('message', function(event) {
    console.log('PixelMind: 收到消息', event.data?.type)

    if (event.data?.type === 'EVAL' || event.data?.type === 'INJECT_SCRIPT' || event.data?.type === 'EXECUTE_SCRIPT') {
      try {
        console.log('PixelMind: 执行脚本', event.data.script?.substring(0, 100) + '...')
        eval(event.data.script)
      } catch (error) {
        console.error('PixelMind: 脚本执行失败', error)
      }
    }

    if (event.data?.type === 'EVAL_SIMPLE') {
      try {
        console.log('PixelMind: 执行简单脚本')
        eval(event.data.script)
      } catch (error) {
        console.error('PixelMind: 简单脚本执行失败', error)
      }
    }

    if (event.data?.type === 'TEST_PING') {
      console.log('PixelMind: 收到 PING 测试:', event.data.data)
      window.parent.postMessage({ type: 'PONG', data: 'Hello from WebContainer' }, '*')
    }
  })

  console.log('PixelMind: 消息监听器已设置')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)`),

      'App.tsx': createWebContainerFile(`import React, { useState, useEffect } from 'react'
import {
  Button,
  Typography,
  Space,
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Tag,
  Alert,
  Divider
} from 'antd'
import {
  RocketOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CodeOutlined
} from '@ant-design/icons'
import './App.css'

const { Title, Paragraph, Text } = Typography

function App() {
  const [counter, setCounter] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [startTime] = useState(Date.now())
  const [currentTime, setCurrentTime] = useState(Date.now())

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleAsyncAction = async () => {
    setIsLoading(true)
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setCounter(prev => prev + 1)
    setIsLoading(false)
  }

  const uptime = Math.floor((currentTime - startTime) / 1000)

  return (
    <div className="App">
      <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <Title level={1} style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 8
            }}>
              🚀 ${projectName}
            </Title>
            <Paragraph style={{ fontSize: 16, color: '#666' }}>
              WebContainer React Application - Running in Browser!
            </Paragraph>
            <Space>
              <Tag color="green" icon={<CheckCircleOutlined />}>WebContainer Ready</Tag>
              <Tag color="blue" icon={<ClockCircleOutlined />}>Uptime: {uptime}s</Tag>
              <Tag color="purple" icon={<CodeOutlined />}>React 18 + Ant Design</Tag>
            </Space>
          </div>

          {/* Performance Stats */}
          <Card title="📊 Performance Metrics" style={{ marginTop: 24 }}>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="Counter"
                  value={counter}
                  prefix={<ThunderboltOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Uptime"
                  value={uptime}
                  suffix="seconds"
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Memory Usage"
                  value={Math.round(Math.random() * 50 + 10)}
                  suffix="MB"
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Load Time"
                  value={Math.round(Math.random() * 500 + 100)}
                  suffix="ms"
                />
              </Col>
            </Row>
          </Card>

          {/* Interactive Demo */}
          <Card title="🎮 Interactive Demo" style={{ marginTop: 16 }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Alert
                message="WebContainer Performance Test"
                description="This application is running entirely in your browser using WebContainers technology. Click the button below to test async operations and state management."
                type="info"
                showIcon
              />

              <div style={{ textAlign: 'center' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<RocketOutlined />}
                  loading={isLoading}
                  onClick={handleAsyncAction}
                  style={{ marginRight: 16 }}
                >
                  {isLoading ? 'Processing...' : 'Run Async Action'}
                </Button>
                <Button
                  size="large"
                  onClick={() => setCounter(0)}
                >
                  Reset Counter
                </Button>
              </div>

              {counter > 0 && (
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <Progress
                    type="circle"
                    percent={Math.min(counter * 10, 100)}
                    format={() => \`\${counter} actions\`}
                  />
                </div>
              )}
            </Space>
          </Card>

          {/* Feature Showcase */}
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={8}>
              <Card size="small" title="🎨 UI Components">
                <Paragraph>
                  Ant Design components work perfectly in WebContainer environment.
                </Paragraph>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" title="⚡ Hot Reload">
                <Paragraph>
                  Changes to code are reflected instantly with Vite's HMR.
                </Paragraph>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" title="🔧 Full Stack">
                <Paragraph>
                  Complete development environment running in browser.
                </Paragraph>
              </Card>
            </Col>
          </Row>

          <Divider />

          {/* Footer */}
          <div style={{ textAlign: 'center', color: '#999' }}>
            <Text>
              Generated by PixelMind AI • Powered by WebContainers • Built with React & Ant Design
            </Text>
          </div>
        </Space>
      </div>
    </div>
  )
}

export default App`),

      'App.css': createWebContainerFile(`#root {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.App {
  min-height: 100vh;
  background: transparent;
}

/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ant-card {
  animation: fadeInUp 0.6s ease-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.ant-statistic-title {
  font-weight: 500;
}

.ant-progress-circle {
  animation: fadeInUp 0.8s ease-out;
}

/* Responsive design */
@media (max-width: 768px) {
  .ant-col {
    margin-bottom: 16px;
  }

  .ant-statistic {
    text-align: center;
  }
}`),

      'index.css': createWebContainerFile(`body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}`),
    }),
  }
}

/**
 * Generate a basic Vue project file tree for WebContainer
 */
export function generateVueProjectTree(projectName: string): WebContainerFileTree {
  return {
    'package.json': createWebContainerFile(
      JSON.stringify(
        {
          name: projectName,
          private: true,
          version: '0.0.0',
          type: 'module',
          scripts: {
            dev: 'vite',
            build: 'vue-tsc && vite build',
            preview: 'vite preview',
          },
          dependencies: {
            vue: '^3.3.0',
          },
          devDependencies: {
            '@vitejs/plugin-vue': '^4.5.0',
            typescript: '^5.3.0',
            'vue-tsc': '^1.8.0',
            vite: '^5.0.0',
          },
        },
        null,
        2
      )
    ),

    'index.html': createWebContainerFile(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`),

    'vite.config.ts': createWebContainerFile(`import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})`),

    src: createWebContainerDirectory({
      'main.ts': createWebContainerFile(`import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')`),

      'App.vue': createWebContainerFile(`<template>
  <div id="app">
    <h1>Welcome to ${projectName}</h1>
    <p>This is a Vue application generated by PixelMind AI.</p>
  </div>
</template>

<script setup lang="ts">
// Component logic here
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>`),

      'style.css': createWebContainerFile(`body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}`),
    }),
  }
}
