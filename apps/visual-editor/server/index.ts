import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import aichatRoutes from './routes/aichat.js'

// 加载环境变量
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.SERVER_PORT || 3005

// 中间件
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 静态文件服务
app.use('/static', express.static(path.join(__dirname, '../public')))

// API 路由
app.use('/api/aichat', aichatRoutes)

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'PixelMind AI Server 运行正常',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// 错误处理中间件
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('服务器错误:', err)
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : '未知错误'
  })
})

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    path: req.originalUrl
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 PixelMind AI Server 启动成功!`)
  console.log(`📡 服务地址: http://localhost:${PORT}`)
  console.log(`🔧 环境: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🤖 AIChat API: http://localhost:${PORT}/api/aichat`)
  
  // 检查环境变量
  if (!process.env.LAOZHANG_API_KEY) {
    console.warn('⚠️  警告: LAOZHANG_API_KEY 环境变量未设置')
  } else {
    console.log('✅ LAOZHANG_API_KEY 已配置')
  }
})

export default app
