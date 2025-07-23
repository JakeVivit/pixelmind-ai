#!/usr/bin/env node

/**
 * 测试 AIChat 配置和连接
 */

const { spawn } = require('child_process')
const path = require('path')

const AICHAT_BIN = path.join(__dirname, 'aichat')
const CONFIG_PATH = path.join(__dirname, 'aichat-config.yaml')

async function testAIChat() {
  console.log('🧪 测试 AIChat 配置...\n')

  // 检查 API Key
  if (!process.env.LAOZHANG_API_KEY) {
    console.error('❌ 错误: 请设置 LAOZHANG_API_KEY 环境变量')
    console.log('💡 提示: 复制 .env.example 为 .env 并填入你的 API Key')
    process.exit(1)
  }

  console.log('✅ API Key 已配置')

  // 测试 aichat 版本
  try {
    console.log('📋 检查 aichat 版本...')
    const version = await executeCommand([AICHAT_BIN, '--version'])
    console.log(`✅ AIChat 版本: ${version.trim()}`)
  } catch (error) {
    console.error('❌ aichat 二进制文件不可用:', error.message)
    process.exit(1)
  }

  // 测试配置文件
  try {
    console.log('📋 检查配置文件...')
    const info = await executeCommand([
      AICHAT_BIN,
      '--config', CONFIG_PATH,
      '--info'
    ])
    console.log('✅ 配置文件加载成功')
    console.log('📄 配置信息:')
    console.log(info)
  } catch (error) {
    console.error('❌ 配置文件加载失败:', error.message)
    process.exit(1)
  }

  // 测试简单的 AI 调用
  try {
    console.log('\n🤖 测试 AI 连接...')
    const response = await executeCommand([
      AICHAT_BIN,
      '--config', CONFIG_PATH,
      '-m', 'laozhang:gpt-4o-mini',
      '--no-stream',
      'Hello, please respond with "AIChat is working!"'
    ], {
      env: {
        ...process.env,
        LAOZHANG_API_KEY: process.env.LAOZHANG_API_KEY
      }
    })
    
    console.log('✅ AI 响应成功!')
    console.log('📝 响应内容:', response.trim())
  } catch (error) {
    console.error('❌ AI 调用失败:', error.message)
    console.log('💡 请检查:')
    console.log('   1. API Key 是否正确')
    console.log('   2. 网络连接是否正常')
    console.log('   3. 中转 API 服务是否可用')
    process.exit(1)
  }

  console.log('\n🎉 所有测试通过! AIChat 配置正确，可以正常使用。')
}

function executeCommand(args, options = {}) {
  return new Promise((resolve, reject) => {
    const [command, ...cmdArgs] = args
    const child = spawn(command, cmdArgs, {
      env: options.env || process.env,
      stdio: ['pipe', 'pipe', 'pipe']
    })

    let stdout = ''
    let stderr = ''

    child.stdout?.on('data', (data) => {
      stdout += data.toString()
    })

    child.stderr?.on('data', (data) => {
      stderr += data.toString()
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout)
      } else {
        reject(new Error(stderr || `进程退出码: ${code}`))
      }
    })

    child.on('error', (error) => {
      reject(error)
    })
  })
}

// 运行测试
testAIChat().catch(error => {
  console.error('💥 测试失败:', error.message)
  process.exit(1)
})
