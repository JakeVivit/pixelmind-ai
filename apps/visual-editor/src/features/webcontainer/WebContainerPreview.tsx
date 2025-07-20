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
  message
} from 'antd'
import { 
  PlayCircleOutlined,
  ReloadOutlined,
  StopOutlined,
  FullscreenOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { useWebContainer } from '@core/webcontainer/useWebContainer'

const { Title, Text, Paragraph } = Typography

export const WebContainerPreview: React.FC = () => {
  const {
    status,
    isReady,
    isBooting,
    error,
    serverUrl,
    bootTime,
    lastOperationTime,
    initialize,
    createProject,
    installDependencies,
    startDevServer,
    cleanup
  } = useWebContainer()

  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const steps = [
    { title: 'Initialize WebContainer', action: initialize },
    { title: 'Create React Project', action: () => createProject('webcontainer-demo') },
    { title: 'Install Dependencies', action: installDependencies },
    { title: 'Start Dev Server', action: startDevServer }
  ]

  const runDemo = async () => {
    setIsRunning(true)
    setCurrentStep(0)
    setLogs([])
    
    try {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i)
        addLog(`Starting: ${steps[i].title}`)
        
        const startTime = Date.now()
        await steps[i].action()
        const duration = Date.now() - startTime
        
        addLog(`Completed: ${steps[i].title} (${duration}ms)`)
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      addLog('Demo completed successfully!')
      message.success('WebContainer demo completed successfully!')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      addLog(`Error: ${errorMessage}`)
      message.error(`Demo failed: ${errorMessage}`)
    } finally {
      setIsRunning(false)
    }
  }

  const stopDemo = async () => {
    try {
      await cleanup()
      setIsRunning(false)
      setCurrentStep(0)
      addLog('Demo stopped and cleaned up')
      message.info('Demo stopped')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      message.error(`Failed to stop demo: ${errorMessage}`)
    }
  }

  const openInNewTab = () => {
    if (serverUrl) {
      window.open(serverUrl, '_blank')
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <div>
          <Title level={2}>
            🚀 WebContainer Demo
          </Title>
          <Paragraph>
            Test WebContainer performance by running a complete React application in your browser.
            This demo will initialize WebContainer, create a React project, install dependencies, and start a development server.
          </Paragraph>
        </div>

        {/* Status Cards */}
        <Row gutter={16}>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Status"
                value={isReady ? 'Ready' : isBooting ? 'Booting' : 'Stopped'}
                prefix={
                  isReady ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> :
                  isBooting ? <ClockCircleOutlined style={{ color: '#1890ff' }} /> :
                  <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                }
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Boot Time"
                value={bootTime || 0}
                suffix="ms"
                prefix={<ThunderboltOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Last Operation"
                value={lastOperationTime || 0}
                suffix="ms"
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Processes"
                value={status.processes.length}
                prefix={<PlayCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Error Display */}
        {error && (
          <Alert
            message="WebContainer Error"
            description={error}
            type="error"
            showIcon
            closable
          />
        )}

        {/* Controls */}
        <Card title="🎮 Demo Controls">
          <Space size="middle">
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={runDemo}
              loading={isRunning}
              disabled={isRunning}
            >
              {isRunning ? 'Running Demo...' : 'Start Demo'}
            </Button>
            
            <Button
              size="large"
              icon={<StopOutlined />}
              onClick={stopDemo}
              disabled={!isRunning && !isReady}
            >
              Stop & Cleanup
            </Button>
            
            <Button
              size="large"
              icon={<ReloadOutlined />}
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
            
            {serverUrl && (
              <Button
                size="large"
                icon={<FullscreenOutlined />}
                onClick={openInNewTab}
              >
                Open in New Tab
              </Button>
            )}
          </Space>
        </Card>

        {/* Progress */}
        {isRunning && (
          <Card title="📊 Progress">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Progress
                percent={Math.round(((currentStep + 1) / steps.length) * 100)}
                status={isRunning ? 'active' : 'success'}
                strokeColor={{
                  '0%': '#667eea',
                  '100%': '#764ba2',
                }}
              />
              <div>
                {steps.map((step, index) => (
                  <Tag
                    key={index}
                    color={
                      index < currentStep ? 'green' :
                      index === currentStep ? 'blue' :
                      'default'
                    }
                    style={{ marginBottom: 8 }}
                  >
                    {index + 1}. {step.title}
                  </Tag>
                ))}
              </div>
            </Space>
          </Card>
        )}

        {/* Preview */}
        {serverUrl && (
          <Card 
            title="🖥️ Live Preview" 
            extra={
              <Button 
                icon={<FullscreenOutlined />} 
                onClick={openInNewTab}
              >
                Full Screen
              </Button>
            }
          >
            <div style={{ 
              border: '1px solid #d9d9d9', 
              borderRadius: 6, 
              overflow: 'hidden',
              background: '#fff'
            }}>
              <iframe
                src={serverUrl}
                style={{
                  width: '100%',
                  height: '600px',
                  border: 'none'
                }}
                title="WebContainer Preview"
              />
            </div>
          </Card>
        )}

        {/* Logs */}
        <Card title="📝 Execution Logs">
          <div style={{
            background: '#001529',
            color: '#fff',
            padding: 16,
            borderRadius: 6,
            fontFamily: 'Monaco, Consolas, monospace',
            fontSize: 12,
            maxHeight: 300,
            overflow: 'auto'
          }}>
            {logs.length === 0 ? (
              <Text style={{ color: '#666' }}>No logs yet. Start the demo to see execution logs.</Text>
            ) : (
              logs.map((log, index) => (
                <div key={index} style={{ marginBottom: 4 }}>
                  {log}
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Process List */}
        {status.processes.length > 0 && (
          <Card title="⚙️ Running Processes">
            <Space direction="vertical" style={{ width: '100%' }}>
              {status.processes.map((process) => (
                <div key={process.id} style={{
                  padding: 12,
                  border: '1px solid #f0f0f0',
                  borderRadius: 6,
                  background: '#fafafa'
                }}>
                  <Space>
                    <Tag color={
                      process.status === 'running' ? 'green' :
                      process.status === 'error' ? 'red' : 'default'
                    }>
                      {process.status}
                    </Tag>
                    <Text code>{process.command}</Text>
                  </Space>
                  {process.output.length > 0 && (
                    <div style={{
                      marginTop: 8,
                      padding: 8,
                      background: '#001529',
                      color: '#fff',
                      borderRadius: 4,
                      fontSize: 11,
                      fontFamily: 'Monaco, Consolas, monospace',
                      maxHeight: 100,
                      overflow: 'auto'
                    }}>
                      {process.output.slice(-5).map((line, index) => (
                        <div key={index}>{line}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </Space>
          </Card>
        )}
      </Space>
    </div>
  )
}
