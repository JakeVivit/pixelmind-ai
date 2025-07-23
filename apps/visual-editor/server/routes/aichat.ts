import express from 'express'
import { AIChatAPI, type AIChatRequest } from '../api/aichat.js'

const router = express.Router()

/**
 * POST /api/aichat/create-project
 * 创建项目的 API 端点
 */
router.post('/create-project', async (req, res) => {
  try {
    const request: AIChatRequest = req.body

    // 验证请求数据
    if (!request.projectData || !request.projectData.name) {
      return res.status(400).json({
        success: false,
        message: '缺少必要的项目数据',
        error: '项目名称不能为空'
      })
    }

    // 调用 AIChat API
    const result = await AIChatAPI.handleCreateProject(request)

    // 返回结果
    if (result.success) {
      res.json(result)
    } else {
      res.status(500).json(result)
    }
  } catch (error) {
    console.error('AIChat API 错误:', error)
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
})

/**
 * GET /api/aichat/health
 * 健康检查端点
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AIChat API 服务正常',
    timestamp: new Date().toISOString()
  })
})

export default router
