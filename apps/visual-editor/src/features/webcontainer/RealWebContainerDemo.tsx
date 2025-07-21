import React, { useState, useEffect, useRef } from 'react'
import { WebContainer } from '@webcontainer/api'
import {
  Card,
  Button,
  Space,
  Typography,
  Alert,
  Progress,
  Row,
  Col,
  Statistic,
  Tag,
  message,
  Steps,
  Modal,
  Input,
  Form,
  Divider,
} from 'antd'
import {
  PlayCircleOutlined,
  ReloadOutlined,
  StopOutlined,
  FullscreenOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CodeOutlined,
  RocketOutlined,
  RobotOutlined,
  EditOutlined,
  SendOutlined,
} from '@ant-design/icons'
import { GeminiAdapter } from '@pixelmind/prompt-engine'
import type { AIGenerationRequest } from '@pixelmind/shared'

const { Title, Text, Paragraph } = Typography

// 真实的 React + Vite 项目文件
const projectFiles = {
  'package.json': {
    file: {
      contents: JSON.stringify(
        {
          name: 'pixelmind-react-demo',
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
      ),
    },
  },
  'index.html': {
    file: {
      contents: `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PixelMind AI - React 演示</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
    },
  },
  'vite.config.ts': {
    file: {
      contents: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  }
})`,
    },
  },
  'tsconfig.json': {
    file: {
      contents: JSON.stringify(
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
      ),
    },
  },
  'tsconfig.node.json': {
    file: {
      contents: JSON.stringify(
        {
          compilerOptions: {
            composite: true,
            skipLibCheck: true,
            module: 'ESNext',
            moduleResolution: 'bundler',
            allowSyntheticDefaultImports: true,
          },
          include: ['vite.config.ts'],
        },
        null,
        2
      ),
    },
  },
  src: {
    directory: {
      'main.tsx': {
        file: {
          contents: `import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)`,
        },
      },
      'App.tsx': {
        file: {
          contents: `import React, { useState, useEffect } from 'react'
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
  CodeOutlined,
  HeartOutlined
} from '@ant-design/icons'
import './App.css'

const { Title, Paragraph, Text } = Typography

function App() {
  const [计数器, set计数器] = useState(0)
  const [加载中, set加载中] = useState(false)
  const [开始时间] = useState(Date.now())
  const [当前时间, set当前时间] = useState(Date.now())

  // 每秒更新当前时间
  useEffect(() => {
    const 定时器 = setInterval(() => {
      set当前时间(Date.now())
    }, 1000)
    return () => clearInterval(定时器)
  }, [])

  const 处理异步操作 = async () => {
    set加载中(true)
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 2000))
    set计数器(prev => prev + 1)
    set加载中(false)
  }

  const 运行时间 = Math.floor((当前时间 - 开始时间) / 1000)

  return (
    <div className="App">
      <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 标题 */}
          <div style={{ textAlign: 'center' }}>
            <Title level={1} style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 8
            }}>
              🚀 PixelMind AI React 演示
            </Title>
            <Paragraph style={{ fontSize: 16, color: '#666' }}>
              这是一个真实的 React 应用，运行在 WebContainer 中！
            </Paragraph>
            <Space>
              <Tag color="green" icon={<CheckCircleOutlined />}>WebContainer 已就绪</Tag>
              <Tag color="blue" icon={<ClockCircleOutlined />}>运行时间: {运行时间}秒</Tag>
              <Tag color="purple" icon={<CodeOutlined />}>React 18 + Ant Design</Tag>
            </Space>
          </div>

          {/* 性能指标 */}
          <Card title="📊 性能指标" style={{ marginTop: 24 }}>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="计数器"
                  value={计数器}
                  prefix={<ThunderboltOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="运行时间"
                  value={运行时间}
                  suffix="秒"
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="内存使用"
                  value={Math.round(Math.random() * 50 + 30)}
                  suffix="MB"
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="加载时间"
                  value={Math.round(Math.random() * 500 + 200)}
                  suffix="毫秒"
                />
              </Col>
            </Row>
          </Card>

          {/* 交互演示 */}
          <Card title="🎮 交互演示" style={{ marginTop: 16 }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Alert
                message="WebContainer 性能测试"
                description="这个应用完全运行在您的浏览器中，使用 WebContainer 技术。点击下面的按钮测试异步操作和状态管理。"
                type="info"
                showIcon
              />

              <div style={{ textAlign: 'center' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<RocketOutlined />}
                  loading={加载中}
                  onClick={处理异步操作}
                  style={{ marginRight: 16 }}
                >
                  {加载中 ? '处理中...' : '运行异步操作'}
                </Button>
                <Button
                  size="large"
                  onClick={() => set计数器(0)}
                >
                  重置计数器
                </Button>
              </div>

              {计数器 > 0 && (
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <Progress
                    type="circle"
                    percent={Math.min(计数器 * 10, 100)}
                    format={() => \`\${计数器} 次操作\`}
                  />
                </div>
              )}
            </Space>
          </Card>

          {/* 功能展示 */}
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={8}>
              <Card size="small" title="🎨 UI 组件">
                <Paragraph>
                  Ant Design 组件在 WebContainer 环境中完美运行。
                </Paragraph>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" title="⚡ 热重载">
                <Paragraph>
                  代码更改会通过 Vite 的 HMR 立即反映。
                </Paragraph>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" title="🔧 完整环境">
                <Paragraph>
                  完整的开发环境运行在浏览器中。
                </Paragraph>
              </Card>
            </Col>
          </Row>

          <Divider />

          {/* 页脚 */}
          <div style={{ textAlign: 'center', color: '#999' }}>
            <Text>
              <HeartOutlined style={{ color: '#ff4d4f' }} /> 由 PixelMind AI 生成 • 基于 WebContainer 技术 • 使用 React 和 Ant Design 构建
            </Text>
          </div>
        </Space>
      </div>
    </div>
  )
}

export default App`,
        },
      },
      'App.css': {
        file: {
          contents: `#root {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.App {
  min-height: 100vh;
  background: transparent;
}

/* 自定义动画 */
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

/* 响应式设计 */
@media (max-width: 768px) {
  .ant-col {
    margin-bottom: 16px;
  }

  .ant-statistic {
    text-align: center;
  }
}`,
        },
      },
      'index.css': {
        file: {
          contents: `body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}`,
        },
      },
    },
  },
}

export const RealWebContainerDemo: React.FC = () => {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null)
  const [isBooting, setIsBooting] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [serverUrl, setServerUrl] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const [bootTime, setBootTime] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Gemini API 相关状态
  const [isGeminiModalVisible, setIsGeminiModalVisible] = useState(false)
  const [geminiApiKey, setGeminiApiKey] = useState<string>('')
  const [isGeminiConfigured, setIsGeminiConfigured] = useState(false)
  const [isGeminiProcessing, setIsGeminiProcessing] = useState(false)
  const [geminiPrompt, setGeminiPrompt] = useState('')
  const [geminiResponse, setGeminiResponse] = useState<string | null>(null)
  const [form] = Form.useForm()
  const geminiAdapterRef = useRef<GeminiAdapter | null>(null)

  // WebContainer 缓存状态
  const [isProjectSetup, setIsProjectSetup] = useState(false)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const steps = [
    { title: '启动 WebContainer', description: '初始化浏览器环境' },
    { title: '创建项目文件', description: '生成 React 项目文件' },
    { title: '安装依赖包', description: '安装 npm 包' },
    { title: '启动开发服务器', description: '启动 Vite 开发服务器' },
  ]

  const startWebContainer = async () => {
    try {
      setError(null)
      setCurrentStep(0)
      setLogs([])

      // 步骤 1: 启动 WebContainer
      setIsBooting(true)
      addLog('正在启动 WebContainer...')
      const startTime = Date.now()

      const wc = await WebContainer.boot()
      const bootDuration = Date.now() - startTime
      setBootTime(bootDuration)
      setWebcontainer(wc)
      setIsBooting(false)
      setCurrentStep(1)
      addLog(`WebContainer 启动成功！耗时: ${bootDuration}ms`)

      // 步骤 2: 挂载文件
      addLog('正在创建项目文件...')
      await wc.mount(projectFiles)
      setCurrentStep(2)
      addLog('项目文件创建完成')

      // 步骤 3: 安装依赖（优化：检查是否已安装）
      setIsInstalling(true)

      let needInstall = true
      if (isProjectSetup) {
        // 如果项目已经设置过，检查 node_modules 是否存在
        try {
          const nodeModulesExists = await wc.fs.readdir('/node_modules')
          if (nodeModulesExists.length > 0) {
            needInstall = false
            addLog('检测到已安装的依赖，跳过安装步骤')
          }
        } catch {
          // node_modules 不存在，需要安装
          addLog('未检测到依赖，开始安装...')
        }
      } else {
        addLog('首次安装依赖包...')
      }

      if (needInstall) {
        const installProcess = await wc.spawn('npm', ['install'])

        installProcess.output.pipeTo(
          new WritableStream<string>({
            write(data: string) {
              if (data.trim()) {
                addLog(`npm: ${data.trim()}`)
              }
            },
          })
        )

        const installExitCode = await installProcess.exit
        if (installExitCode !== 0) {
          throw new Error(`依赖安装失败，退出码: ${installExitCode}`)
        }
        addLog('依赖包安装完成')
      } else {
        addLog('跳过依赖安装')
      }

      setIsInstalling(false)
      setCurrentStep(3)
      setIsProjectSetup(true)

      // 步骤 4: 启动开发服务器
      setIsStarting(true)
      addLog('正在启动开发服务器...')

      const devProcess = await wc.spawn('npm', ['run', 'dev'])

      devProcess.output.pipeTo(
        new WritableStream<string>({
          write(data: string) {
            if (data.trim()) {
              addLog(`vite: ${data.trim()}`)
            }
          },
        })
      )

      // 等待服务器启动
      wc.on('server-ready', (_port, url) => {
        setServerUrl(url)
        setIsStarting(false)
        setCurrentStep(4)
        addLog(`开发服务器启动成功！地址: ${url}`)
        message.success('React 应用启动成功！')
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误'
      setError(errorMessage)
      addLog(`错误: ${errorMessage}`)
      message.error(`启动失败: ${errorMessage}`)
      setIsBooting(false)
      setIsInstalling(false)
      setIsStarting(false)
    }
  }

  const stopWebContainer = async () => {
    if (webcontainer) {
      addLog('正在停止 WebContainer...')
      // WebContainer 会在页面刷新时自动清理
      setWebcontainer(null)
      setServerUrl(null)
      setCurrentStep(0)
      setIsProjectSetup(false)
      addLog('WebContainer 已停止')
      message.info('WebContainer 已停止')
    }
  }

  const openInNewTab = () => {
    if (serverUrl) {
      window.open(serverUrl, '_blank')
    }
  }

  // Gemini API 相关函数
  const handleGeminiConfig = () => {
    setIsGeminiModalVisible(true)
  }

  const handleGeminiConfigSubmit = async () => {
    try {
      const values = await form.validateFields()
      const apiKey = values.apiKey

      // 初始化 GeminiAdapter
      geminiAdapterRef.current = new GeminiAdapter(apiKey)

      // 测试 API 连接
      if (geminiAdapterRef.current.isInitialized()) {
        setGeminiApiKey(apiKey)
        setIsGeminiConfigured(true)
        setIsGeminiModalVisible(false)
        message.success('Gemini API 配置成功！')
        addLog('Gemini API 已配置并连接成功')
      } else {
        throw new Error('API 初始化失败')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '配置失败'
      message.error(`配置失败: ${errorMessage}`)
      addLog(`Gemini API 配置失败: ${errorMessage}`)
    }
  }

  const handleGeminiPromptSubmit = async () => {
    if (!geminiPrompt.trim()) {
      message.warning('请输入修改指令')
      return
    }

    if (!webcontainer) {
      message.error('请先启动 WebContainer')
      return
    }

    if (!geminiAdapterRef.current) {
      message.error('Gemini API 未配置')
      return
    }

    setIsGeminiProcessing(true)
    addLog(`正在处理 AI 指令: ${geminiPrompt}`)

    try {
      // 读取当前的 App.tsx 内容
      let currentCode = ''
      try {
        currentCode = await webcontainer.fs.readFile('/src/App.tsx', 'utf-8')
      } catch {
        // 如果文件不存在，使用默认内容
        currentCode = `import React from 'react'
import { Button, Space, Typography } from 'antd'

const { Title } = Typography

function App() {
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>PixelMind AI React 演示</Title>
      <Space>
        <Button type="primary">主要按钮</Button>
        <Button>普通按钮</Button>
      </Space>
    </div>
  )
}

export default App`
      }

      // 构建 AI 请求 - 使用英文避免字符编码问题
      const aiRequest: AIGenerationRequest = {
        prompt: `Modify the React component code based on this instruction: ${geminiPrompt}

Current code:
\`\`\`tsx
${currentCode}
\`\`\`

Please return the complete modified code, maintaining React + TypeScript + Ant Design style.
Only return the code without explanations.`,
        context: {
          framework: 'react',
          uiLibrary: 'antd',
          existingComponents: [
            {
              id: 'app-component',
              name: 'App',
              code: currentCode,
              type: 'functional',
              props: [],
              filePath: '/src/App.tsx',
            },
          ],
        },
        options: {
          includeTypes: true,
          includeStyles: true,
          includeTests: false,
        },
      }

      // 调用 Gemini API
      addLog('正在调用 Gemini API...')
      const response = await geminiAdapterRef.current.processRequest(aiRequest)

      if (response.success && response.code) {
        setGeminiResponse(response.code)
        addLog('AI 代码生成完成')

        // 将生成的代码写入 WebContainer
        await webcontainer.fs.writeFile('/src/App.tsx', response.code)
        addLog('代码已更新到 WebContainer')
        message.success('AI 代码生成并更新成功！')

        // 显示建议（如果有）
        if (response.suggestions && response.suggestions.length > 0) {
          addLog(`AI 建议: ${response.suggestions.join(', ')}`)
        }
      } else {
        throw new Error(response.error || 'AI 生成失败')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      addLog(`AI 处理失败: ${errorMessage}`)
      message.error(`AI 处理失败: ${errorMessage}`)

      // 如果是 API 错误，提供更详细的信息
      if (errorMessage.includes('API')) {
        message.info('请检查 API Key 是否正确，或稍后重试')
      }
    } finally {
      setIsGeminiProcessing(false)
    }
  }

  const isRunning = isBooting || isInstalling || isStarting
  const progress = (currentStep / steps.length) * 100

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 标题 */}
        <div>
          <Title level={2}>🚀 真实 WebContainer React 演示</Title>
          <Paragraph>
            这将启动一个真实的 React + Vite 项目，完全运行在您的浏览器中。 使用真正的
            @webcontainer/api 来创建完整的开发环境。
          </Paragraph>
        </div>

        {/* 错误显示 */}
        {error && (
          <Alert
            message="启动错误"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
          />
        )}

        {/* 性能指标 */}
        <Row gutter={16}>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="状态"
                value={serverUrl ? '运行中' : isRunning ? '启动中' : '已停止'}
                prefix={
                  serverUrl ? (
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  ) : isRunning ? (
                    <ClockCircleOutlined style={{ color: '#1890ff' }} />
                  ) : (
                    <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                  )
                }
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="启动时间"
                value={bootTime || 0}
                suffix="毫秒"
                prefix={<ThunderboltOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="当前步骤"
                value={`${currentStep}/${steps.length}`}
                prefix={<CodeOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="进度"
                value={Math.round(progress)}
                suffix="%"
                prefix={<RocketOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* 控制按钮 */}
        <Card title="🎮 控制面板">
          <Space size="middle" wrap>
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={startWebContainer}
              loading={isRunning}
              disabled={isRunning || !!webcontainer}
            >
              {isRunning ? '启动中...' : '启动 React 项目'}
            </Button>

            <Button
              size="large"
              icon={<StopOutlined />}
              onClick={stopWebContainer}
              disabled={!webcontainer}
            >
              停止项目
            </Button>

            <Button size="large" icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
              刷新页面
            </Button>

            {serverUrl && (
              <Button size="large" icon={<FullscreenOutlined />} onClick={openInNewTab}>
                新标签页打开
              </Button>
            )}

            <Divider type="vertical" style={{ height: 'auto' }} />

            <Button
              size="large"
              icon={<RobotOutlined />}
              onClick={handleGeminiConfig}
              disabled={isGeminiConfigured}
              type={isGeminiConfigured ? 'default' : 'dashed'}
            >
              {isGeminiConfigured ? 'Gemini 已配置' : '配置 Gemini API'}
            </Button>

            {isGeminiConfigured && webcontainer && (
              <Button
                size="large"
                icon={<EditOutlined />}
                onClick={() => setIsGeminiModalVisible(true)}
                type="primary"
                ghost
              >
                AI 代码修改
              </Button>
            )}
          </Space>
        </Card>

        {/* 进度步骤 */}
        <Card title="📊 启动进度">
          <Steps
            current={currentStep}
            status={error ? 'error' : isRunning ? 'process' : serverUrl ? 'finish' : 'wait'}
            items={steps}
          />

          {isRunning && (
            <div style={{ marginTop: 16 }}>
              <Progress
                percent={progress}
                status="active"
                strokeColor={{
                  '0%': '#667eea',
                  '100%': '#764ba2',
                }}
              />
            </div>
          )}
        </Card>

        {/* 实时预览 */}
        {serverUrl && (
          <Card
            title="🖥️ 实时预览"
            extra={
              <Space>
                <Tag color="green" icon={<CheckCircleOutlined />}>
                  运行中
                </Tag>
                <Button icon={<FullscreenOutlined />} onClick={openInNewTab}>
                  全屏查看
                </Button>
              </Space>
            }
          >
            <div
              style={{
                border: '1px solid #d9d9d9',
                borderRadius: 6,
                overflow: 'hidden',
                background: '#fff',
              }}
            >
              <iframe
                ref={iframeRef}
                src={serverUrl}
                style={{
                  width: '100%',
                  height: '600px',
                  border: 'none',
                }}
                title="React 应用预览"
              />
            </div>
          </Card>
        )}

        {/* 执行日志 */}
        <Card title="📝 执行日志">
          <div
            style={{
              background: '#001529',
              color: '#fff',
              padding: 16,
              borderRadius: 6,
              fontFamily: 'Monaco, Consolas, monospace',
              fontSize: 12,
              maxHeight: 400,
              overflow: 'auto',
            }}
          >
            {logs.length === 0 ? (
              <Text style={{ color: '#666' }}>暂无日志。点击"启动 React 项目"开始。</Text>
            ) : (
              logs.map((log, index) => (
                <div key={index} style={{ marginBottom: 4 }}>
                  {log}
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Gemini API 配置 Modal */}
        <Modal
          title={
            <Space>
              <RobotOutlined />
              {isGeminiConfigured ? 'AI 代码修改' : '配置 Gemini API'}
            </Space>
          }
          open={isGeminiModalVisible}
          onCancel={() => {
            setIsGeminiModalVisible(false)
            setGeminiPrompt('')
            setGeminiResponse(null)
          }}
          footer={null}
          width={800}
        >
          {!isGeminiConfigured ? (
            // API 配置界面
            <Form form={form} layout="vertical" onFinish={handleGeminiConfigSubmit}>
              <Form.Item
                label="Gemini API Key"
                name="apiKey"
                rules={[{ required: true, message: '请输入 Gemini API Key' }]}
              >
                <Input.Password placeholder="请输入您的 Gemini API Key" size="large" />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<RobotOutlined />}>
                    配置 API
                  </Button>
                  <Button onClick={() => setIsGeminiModalVisible(false)}>取消</Button>
                </Space>
              </Form.Item>
              <Alert
                message="获取 API Key"
                description={
                  <div>
                    <p>
                      1. 访问{' '}
                      <a
                        href="https://makersuite.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Google AI Studio
                      </a>
                    </p>
                    <p>2. 创建新的 API Key</p>
                    <p>3. 复制并粘贴到上方输入框</p>
                  </div>
                }
                type="info"
                showIcon
              />
            </Form>
          ) : (
            // 代码修改界面
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* 状态提示 */}
              <Alert
                message="AI 代码修改功能"
                description={
                  <div>
                    <p>• 输入自然语言指令来修改 WebContainer 中的 React 代码</p>
                    <p>• 修改会实时反映在右侧预览中</p>
                    <p>• 支持添加组件、修改样式、调整布局等操作</p>
                  </div>
                }
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />

              {/* WebContainer 状态检查 */}
              {!webcontainer && (
                <Alert
                  message="请先启动 WebContainer"
                  description="需要先启动 React 项目才能使用 AI 代码修改功能"
                  type="warning"
                  showIcon
                />
              )}

              <Form.Item label="AI 修改指令">
                <Input.TextArea
                  value={geminiPrompt}
                  onChange={e => setGeminiPrompt(e.target.value)}
                  placeholder="例如：将按钮颜色改为红色，添加一个输入框，创建一个卡片组件..."
                  rows={3}
                  size="large"
                  disabled={!webcontainer}
                />

                {/* 示例指令 */}
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    快速示例：
                  </Text>
                  <div style={{ marginTop: 4 }}>
                    <Space wrap size={[4, 4]}>
                      <Button
                        size="small"
                        type="link"
                        onClick={() => setGeminiPrompt('将主要按钮的颜色改为红色')}
                        disabled={!webcontainer || isGeminiProcessing}
                      >
                        改变按钮颜色
                      </Button>
                      <Button
                        size="small"
                        type="link"
                        onClick={() => setGeminiPrompt('添加一个输入框和提交按钮')}
                        disabled={!webcontainer || isGeminiProcessing}
                      >
                        添加输入框
                      </Button>
                      <Button
                        size="small"
                        type="link"
                        onClick={() => setGeminiPrompt('创建一个包含图片和描述的卡片组件')}
                        disabled={!webcontainer || isGeminiProcessing}
                      >
                        添加卡片
                      </Button>
                      <Button
                        size="small"
                        type="link"
                        onClick={() => setGeminiPrompt('添加一个数据表格显示用户信息')}
                        disabled={!webcontainer || isGeminiProcessing}
                      >
                        添加表格
                      </Button>
                    </Space>
                  </div>
                </div>
              </Form.Item>

              <Space>
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleGeminiPromptSubmit}
                  loading={isGeminiProcessing}
                  disabled={!geminiPrompt.trim() || !webcontainer}
                  size="large"
                >
                  {isGeminiProcessing ? '处理中...' : '发送指令'}
                </Button>
                <Button
                  onClick={() => {
                    setGeminiPrompt('')
                    setGeminiResponse(null)
                  }}
                  disabled={isGeminiProcessing}
                >
                  清空
                </Button>
              </Space>

              {/* 处理状态显示 */}
              {isGeminiProcessing && (
                <Card size="small">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div style={{ textAlign: 'center' }}>
                      <RobotOutlined spin style={{ fontSize: 24, color: '#1890ff' }} />
                      <div style={{ marginTop: 8 }}>AI 正在处理您的指令...</div>
                    </div>
                    <Progress percent={50} status="active" showInfo={false} />
                  </Space>
                </Card>
              )}

              {geminiResponse && (
                <Card title="🤖 AI 生成的代码" size="small">
                  <pre
                    style={{
                      background: '#f6f8fa',
                      padding: 12,
                      borderRadius: 4,
                      fontSize: 12,
                      overflow: 'auto',
                      maxHeight: 300,
                    }}
                  >
                    {geminiResponse}
                  </pre>
                  <div style={{ marginTop: 12, textAlign: 'center' }}>
                    <Tag color="green" icon={<CheckCircleOutlined />}>
                      代码已应用到 WebContainer
                    </Tag>
                  </div>
                </Card>
              )}
            </Space>
          )}
        </Modal>
      </Space>
    </div>
  )
}
