import type { Plugin } from 'vite'
import { ViteAIChatHandler } from './vite-server.js'

/**
 * Vite 插件：添加 AIChat API 端点
 */
export function aichatPlugin(): Plugin {
  return {
    name: 'aichat-api',
    configureServer(server) {
      server.middlewares.use('/api/aichat/create-project', async (req, res, next) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }

        try {
          let body = ''
          req.on('data', chunk => {
            body += chunk.toString()
          })

          req.on('end', async () => {
            try {
              const requestData = JSON.parse(body)
              console.log('收到 AIChat 请求:', requestData)

              const result = await ViteAIChatHandler.handleCreateProject(requestData)

              res.setHeader('Content-Type', 'application/json')
              res.statusCode = result.success ? 200 : 500
              res.end(JSON.stringify(result))
            } catch (error) {
              console.error('AIChat API 错误:', error)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(
                JSON.stringify({
                  success: false,
                  message: '服务器内部错误',
                  error: error instanceof Error ? error.message : '未知错误',
                })
              )
            }
          })
        } catch (error) {
          console.error('请求处理错误:', error)
          res.statusCode = 500
          res.end('Internal Server Error')
        }
      })

      // 健康检查端点
      server.middlewares.use('/api/aichat/health', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.end(
          JSON.stringify({
            success: true,
            message: 'AIChat API 服务正常',
            timestamp: new Date().toISOString(),
          })
        )
      })
    },
  }
}
