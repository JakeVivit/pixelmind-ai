# 🔧 Gemini API 问题修复记录

## 问题1: 字符编码错误

### 错误信息

```
[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent: Failed to execute 'fetch' on 'Window': Failed to read the 'headers' property from 'RequestInit': String contains non ISO-8859-1 code point.
```

### 原因

在 AI 请求的 prompt 中包含了中文字符，但 HTTP 请求头不支持非 ISO-8859-1 字符。

### 解决方案

将 prompt 改为英文，避免字符编码问题：

```typescript
// 修改前（包含中文）
prompt: `请根据以下指令修改 React 组件代码：${geminiPrompt}`

// 修改后（使用英文）
prompt: `Modify the React component code based on this instruction: ${geminiPrompt}`
```

## 问题2: 模板未注册错误

### 错误信息

```
AI 处理失败: Template not found: react-antd-component
```

### 原因

GeminiAdapter 继承自 PromptEngine，但构造函数中没有注册默认模板。

### 解决方案

在 GeminiAdapter 构造函数中注册所有默认模板：

```typescript
// packages/prompt-engine/src/gemini-adapter.ts
import { DEFAULT_TEMPLATES } from './templates'

constructor(apiKey?: string) {
  super()

  // Register default templates
  DEFAULT_TEMPLATES.forEach(template => {
    this.registerTemplate(template)
  })

  if (apiKey) {
    this.initialize(apiKey)
  }
}
```

## 问题3: Gemini 模型名称过时

### 错误信息

```
models/gemini-pro is not found for API version v1, or is not supported for generateContent. Call ListModels to see the list of available models and their supported methods.
```

### 原因

Google 已经更新了 Gemini API，`gemini-pro` 模型名称已经过时，需要使用新的模型名称。

### 解决方案

更新为当前推荐的模型名称：

```typescript
// 修改前
this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' })

// 修改后
this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
```

**可用的模型名称**:

- `gemini-1.5-flash` - 推荐，速度快，成本低
- `gemini-1.5-pro` - 更强大，但成本更高
- `gemini-1.0-pro` - 旧版本，仍然可用

## 问题4: TypeScript 类型错误

### 错误信息

```
类型"string"的参数不能赋给类型"AllowSharedBufferSource | undefined"的参数
```

### 原因

WebContainer API 的 output stream 类型定义不匹配。

### 解决方案

正确指定 WritableStream 的泛型类型：

```typescript
// 修改前
installProcess.output.pipeTo(
  new WritableStream({
    write(data) {
      const text = new TextDecoder().decode(data)
      // ...
    },
  })
)

// 修改后
installProcess.output.pipeTo(
  new WritableStream<string>({
    write(data: string) {
      if (data.trim()) {
        addLog(`npm: ${data.trim()}`)
      }
    },
  })
)
```

## 问题5: ComponentInfo 类型不完整

### 错误信息

```
类型"{ name: string; code: string; type: "functional"; }"缺少类型"ComponentInfo"中的以下属性: id, props, filePath
```

### 原因

ComponentInfo 接口要求更多属性，但我们只提供了部分属性。

### 解决方案

提供完整的 ComponentInfo 对象：

```typescript
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
```

## 问题6: WebContainer 重复安装依赖

### 问题描述

每次启动 React 项目都要重新安装依赖，浪费时间。

### 解决方案

添加依赖缓存检查机制：

```typescript
// 检查是否需要安装依赖
let needInstall = true
if (isProjectSetup) {
  try {
    const nodeModulesExists = await wc.fs.readdir('/node_modules')
    if (nodeModulesExists.length > 0) {
      needInstall = false
      addLog('检测到已安装的依赖，跳过安装步骤')
    }
  } catch {
    addLog('未检测到依赖，开始安装...')
  }
}

if (needInstall) {
  // 执行安装
} else {
  addLog('跳过依赖安装')
}
```

## 测试步骤

1. **启动应用**

   ```bash
   pnpm dev
   ```

2. **访问演示页面**
   - 打开 http://localhost:3002
   - 点击 "WebContainer Demo"

3. **配置 Gemini API**
   - 点击 "配置 Gemini API"
   - 输入有效的 API Key

4. **测试 AI 代码修改**
   - 启动 React 项目
   - 点击 "AI 代码修改"
   - 输入英文指令，如：
     - "Change button color to red"
     - "Add an input field"
     - "Create a card component"

5. **验证优化效果**
   - 第二次启动项目时应该跳过依赖安装
   - AI 指令应该正常工作，无字符编码错误

## 注意事项

1. **API Key 安全**: 请妥善保管您的 Gemini API Key
2. **网络连接**: 确保网络连接正常，能访问 Google AI 服务
3. **指令语言**: 建议使用英文指令以避免字符编码问题
4. **依赖缓存**: 如果需要重新安装依赖，请先停止项目再重新启动

## 已知限制

1. 目前只支持修改单个文件 (App.tsx)
2. 复杂的组件结构可能需要多次迭代
3. AI 生成的代码可能需要手动调整
4. 依赖缓存机制相对简单，可能在某些情况下失效

## 下一步改进

1. 支持多文件修改
2. 添加代码历史和回滚功能
3. 改进依赖缓存机制
4. 添加更智能的错误处理
5. 支持中文指令（解决字符编码问题）
