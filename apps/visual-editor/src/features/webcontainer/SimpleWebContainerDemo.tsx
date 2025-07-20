import React, { useState, useEffect } from 'react'
import {
  Card,
  Button,
  Space,
  Typography,
  Alert,
  Spin,
  Progress,
  Row,
  Col,
  Statistic,
  Tag,
  Divider,
  message,
  Steps,
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
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography

export const SimpleWebContainerDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [metrics, setMetrics] = useState({
    bootTime: 0,
    operationTime: 0,
    memoryUsage: 45,
    processes: 0,
  })

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const steps = [
    { title: 'Initialize WebContainer', description: 'Setting up browser environment' },
    { title: 'Create React Project', description: 'Generating project files' },
    { title: 'Install Dependencies', description: 'Installing npm packages' },
    { title: 'Start Dev Server', description: 'Launching development server' },
  ]

  const simulateWebContainerDemo = async () => {
    setIsLoading(true)
    setCurrentStep(0)
    setLogs([])
    setIsComplete(false)

    try {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i)
        addLog(`Starting: ${steps[i].title}`)

        const startTime = Date.now()

        // Simulate different operation times
        const operationTime = Math.random() * 2000 + 1000 // 1-3 seconds
        await new Promise(resolve => setTimeout(resolve, operationTime))

        const duration = Date.now() - startTime
        setMetrics(prev => ({
          ...prev,
          operationTime: duration,
          bootTime: i === 0 ? duration : prev.bootTime,
          processes: i === 3 ? 2 : prev.processes,
          memoryUsage: Math.min(45 + (i + 1) * 15, 100),
        }))

        addLog(`Completed: ${steps[i].title} (${duration}ms)`)
      }

      setIsComplete(true)
      addLog('🎉 WebContainer demo completed successfully!')
      addLog('React app is now running at http://localhost:5173')
      message.success('WebContainer demo completed successfully!')
    } catch (err) {
      addLog(`❌ Error: ${err}`)
      message.error('Demo failed')
    } finally {
      setIsLoading(false)
    }
  }

  const resetDemo = () => {
    setCurrentStep(0)
    setIsComplete(false)
    setLogs([])
    setMetrics({
      bootTime: 0,
      operationTime: 0,
      memoryUsage: 45,
      processes: 0,
    })
  }

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <div>
          <Title level={2}>🚀 WebContainer Performance Demo</Title>
          <Paragraph>
            This demo simulates the WebContainer initialization process and shows expected
            performance metrics. WebContainer allows running a complete Node.js development
            environment in your browser!
          </Paragraph>

          <Alert
            message="Demo Mode"
            description="This is a simulation of WebContainer performance. The actual WebContainer integration is in development."
            type="info"
            showIcon
            style={{ marginTop: 16 }}
          />
        </div>

        {/* Performance Metrics */}
        <Row gutter={16}>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Status"
                value={isComplete ? 'Ready' : isLoading ? 'Running' : 'Stopped'}
                prefix={
                  isComplete ? (
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  ) : isLoading ? (
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
                title="Boot Time"
                value={metrics.bootTime}
                suffix="ms"
                prefix={<ThunderboltOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Memory Usage"
                value={metrics.memoryUsage}
                suffix="MB"
                prefix={<CodeOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Processes"
                value={metrics.processes}
                prefix={<PlayCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Demo Controls */}
        <Card title="🎮 Demo Controls">
          <Space size="middle">
            <Button
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              onClick={simulateWebContainerDemo}
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Running Demo...' : 'Start WebContainer Demo'}
            </Button>

            <Button size="large" icon={<ReloadOutlined />} onClick={resetDemo} disabled={isLoading}>
              Reset Demo
            </Button>

            <Button
              size="large"
              icon={<FullscreenOutlined />}
              disabled={!isComplete}
              onClick={() => message.info('In real WebContainer, this would open the live app!')}
            >
              Open Live App
            </Button>
          </Space>
        </Card>

        {/* Progress Steps */}
        <Card title="📊 Progress">
          <Steps
            current={currentStep}
            status={isLoading ? 'process' : isComplete ? 'finish' : 'wait'}
            items={steps}
          />

          {isLoading && (
            <div style={{ marginTop: 16 }}>
              <Progress
                percent={Math.round(((currentStep + 1) / steps.length) * 100)}
                status="active"
                strokeColor={{
                  '0%': '#667eea',
                  '100%': '#764ba2',
                }}
              />
            </div>
          )}
        </Card>

        {/* Simulated Preview */}
        {isComplete && (
          <Card
            title="🖥️ Simulated React App Preview"
            extra={
              <Tag color="green" icon={<CheckCircleOutlined />}>
                Live
              </Tag>
            }
          >
            <div
              style={{
                border: '1px solid #d9d9d9',
                borderRadius: 6,
                padding: 24,
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                textAlign: 'center',
                minHeight: 200,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Title level={3} style={{ color: '#667eea' }}>
                🎉 React App Running!
              </Title>
              <Paragraph>
                This would be your live React application running in WebContainer. Complete with hot
                reload, npm packages, and full development environment.
              </Paragraph>
              <Space>
                <Tag color="blue">React 18</Tag>
                <Tag color="green">Vite</Tag>
                <Tag color="purple">TypeScript</Tag>
                <Tag color="orange">Ant Design1</Tag>
              </Space>
            </div>
          </Card>
        )}

        {/* Execution Logs */}
        <Card title="📝 Execution Logs">
          <div
            style={{
              background: '#001529',
              color: '#fff',
              padding: 16,
              borderRadius: 6,
              fontFamily: 'Monaco, Consolas, monospace',
              fontSize: 12,
              maxHeight: 300,
              overflow: 'auto',
            }}
          >
            {logs.length === 0 ? (
              <Text style={{ color: '#666' }}>
                No logs yet. Start the demo to see execution logs.
              </Text>
            ) : (
              logs.map((log, index) => (
                <div key={index} style={{ marginBottom: 4 }}>
                  {log}
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Performance Summary */}
        <Card title="📈 Performance Analysis">
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ padding: 16, background: '#f9f9f9', borderRadius: 6 }}>
                <Title level={5}>Expected Performance</Title>
                <ul>
                  <li>
                    <strong>Boot Time:</strong> 1-3 seconds (excellent)
                  </li>
                  <li>
                    <strong>Memory Usage:</strong> 50-100 MB (efficient)
                  </li>
                  <li>
                    <strong>Hot Reload:</strong> &lt;500ms (instant)
                  </li>
                  <li>
                    <strong>Package Install:</strong> 10-30 seconds
                  </li>
                </ul>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ padding: 16, background: '#f0f9ff', borderRadius: 6 }}>
                <Title level={5}>WebContainer Benefits</Title>
                <ul>
                  <li>
                    🚀 <strong>No Setup:</strong> Instant development environment
                  </li>
                  <li>
                    🔒 <strong>Secure:</strong> Sandboxed execution
                  </li>
                  <li>
                    ⚡ <strong>Fast:</strong> Native browser performance
                  </li>
                  <li>
                    🌐 <strong>Shareable:</strong> URL-based project sharing
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Card>
      </Space>
    </div>
  )
}
