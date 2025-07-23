import React, { useState, useEffect } from 'react'
import { Modal, Input, Button, Alert, Typography, Space } from 'antd'
import { Key, ExternalLink, Eye, EyeOff } from 'lucide-react'
import { GeminiService } from '../services/GeminiService'

const { Text, Link } = Typography

interface GeminiApiKeyModalProps {
  open: boolean
  onClose: () => void
  onConfigured: () => void
}

export const GeminiApiKeyModal: React.FC<GeminiApiKeyModalProps> = ({
  open,
  onClose,
  onConfigured
}) => {
  const [apiKey, setApiKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)

  useEffect(() => {
    if (open) {
      // 加载已保存的 API Key
      const storedKey = GeminiService.getStoredApiKey()
      if (storedKey) {
        setApiKey(storedKey)
      }
      setError(null)
    }
  }, [open])

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError('请输入 Gemini API Key')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // 验证 API Key
      const isValid = GeminiService.initializeGemini(apiKey.trim())
      
      if (isValid) {
        // 保存到本地存储
        GeminiService.saveApiKey(apiKey.trim())
        onConfigured()
        onClose()
      } else {
        setError('API Key 无效，请检查后重试')
      }
    } catch (error) {
      console.error('API Key 验证失败:', error)
      setError('API Key 验证失败，请检查网络连接和 API Key 是否正确')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setApiKey('')
    setError(null)
    onClose()
  }

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          <span>配置 Gemini API Key</span>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={isLoading}
          onClick={handleSave}
          disabled={!apiKey.trim()}
        >
          保存配置
        </Button>
      ]}
      width={600}
      destroyOnClose
    >
      <div className="space-y-4">
        <Alert
          message="需要配置 Gemini API Key"
          description="为了使用 AI 生成项目功能，需要配置 Google Gemini API Key。API Key 将安全地保存在浏览器本地存储中。"
          type="info"
          showIcon
        />

        <div>
          <Text strong>API Key *</Text>
          <div className="mt-2 relative">
            <Input.Password
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="请输入你的 Gemini API Key"
              size="large"
              visibilityToggle={{
                visible: showApiKey,
                onVisibleChange: setShowApiKey,
              }}
              iconRender={(visible) =>
                visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />
              }
            />
          </div>
        </div>

        {error && (
          <Alert
            message="配置失败"
            description={error}
            type="error"
            showIcon
          />
        )}

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <Text strong className="block mb-2">如何获取 Gemini API Key？</Text>
          <Space direction="vertical" size="small">
            <Text>
              1. 访问{' '}
              <Link
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                className="inline-flex items-center gap-1"
              >
                Google AI Studio
                <ExternalLink className="w-3 h-3" />
              </Link>
            </Text>
            <Text>2. 登录你的 Google 账户</Text>
            <Text>3. 点击 "Create API Key" 创建新的 API Key</Text>
            <Text>4. 复制生成的 API Key 并粘贴到上方输入框</Text>
          </Space>
        </div>

        <Alert
          message="隐私说明"
          description="你的 API Key 仅保存在浏览器本地存储中，不会发送到我们的服务器。所有 AI 请求都直接发送到 Google Gemini API。"
          type="success"
          showIcon
        />
      </div>
    </Modal>
  )
}
