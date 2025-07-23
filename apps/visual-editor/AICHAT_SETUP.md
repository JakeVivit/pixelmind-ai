# AIChat 集成配置指南

本项目已集成 AIChat CLI 工具，支持使用中转 API 调用多种 AI 模型进行项目生成。

## 🚀 快速开始

### 1. 配置 API Key

复制环境变量示例文件：
```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的 API Key：
```bash
LAOZHANG_API_KEY=your_api_key_here
```

### 2. 测试配置

运行测试脚本验证配置：
```bash
pnpm run test:aichat
```

如果配置正确，你会看到：
```
🧪 测试 AIChat 配置...
✅ API Key 已配置
✅ AIChat 版本: aichat 0.30.0
✅ 配置文件加载成功
🤖 测试 AI 连接...
✅ AI 响应成功!
🎉 所有测试通过! AIChat 配置正确，可以正常使用。
```

### 3. 开始使用

现在你可以在应用中创建项目，系统会自动使用 AIChat 生成完整的项目代码。

## 📋 支持的模型

通过中转 API，你可以使用以下模型：

- **GPT-4o**: 最新的 OpenAI 模型，适合复杂项目
- **GPT-4o-mini**: 轻量版本，速度更快
- **Claude 3.5 Sonnet**: Anthropic 的强大模型，代码生成质量高

## 🔧 配置文件说明

AIChat 配置文件位于 `bin/aichat-config.yaml`，包含：

### 客户端配置
```yaml
clients:
  - type: openai-compatible
    name: laozhang
    api_base: https://api.laozhang.ai/v1
    api_key: ${LAOZHANG_API_KEY}
```

### 角色配置
- `project-generator`: 专门用于生成完整项目结构
- `code-generator`: 用于生成单个代码文件

### 模型配置
每个模型都配置了合适的参数：
- 输入/输出 token 限制
- 价格信息
- 温度设置

## 🛠️ 自定义配置

### 修改默认模型
编辑 `bin/aichat-config.yaml`：
```yaml
model: laozhang:claude-3-5-sonnet-20241022  # 改为你喜欢的模型
```

### 调整生成参数
```yaml
temperature: 0.1  # 降低随机性，提高代码质量
```

### 添加新的角色
```yaml
roles:
  - name: my-custom-role
    prompt: |
      你的自定义提示词...
    model: laozhang:gpt-4o
    temperature: 0.2
```

## 🔍 故障排除

### API Key 错误
```
❌ 错误: 请配置 LAOZHANG_API_KEY 环境变量
```
**解决方案**: 确保 `.env` 文件存在且包含正确的 API Key

### 网络连接问题
```
❌ AI 调用失败: Connection timeout
```
**解决方案**: 
1. 检查网络连接
2. 确认中转 API 服务可用
3. 尝试使用代理

### 模型不可用
```
❌ AI 调用失败: Model not found
```
**解决方案**: 
1. 检查模型名称是否正确
2. 确认你的 API Key 有权限使用该模型
3. 尝试使用其他模型

## 📁 文件结构

```
apps/visual-editor/
├── bin/
│   ├── aichat                    # AIChat 二进制文件
│   ├── aichat-config.yaml        # AIChat 配置文件
│   └── test-aichat.js           # 测试脚本
├── src/features/projects/services/
│   └── AIChatService.ts         # AIChat 服务封装
├── .env.example                 # 环境变量示例
└── AICHAT_SETUP.md             # 本文档
```

## 🎯 使用建议

1. **首次使用**: 建议先用 `gpt-4o-mini` 测试，成本较低
2. **复杂项目**: 使用 `claude-3-5-sonnet-20241022`，代码质量更高
3. **快速原型**: 使用 `gpt-4o-mini`，速度更快
4. **生产项目**: 使用 `gpt-4o` 或 `claude-3-5-sonnet`

## 🔗 相关链接

- [AIChat 官方文档](https://github.com/sigoden/aichat)
- [老张 API 中转服务](https://api.laozhang.ai/)
- [配置指南](https://github.com/sigoden/aichat/wiki/Configuration-Guide)

## 💡 提示

- 定期更新 AIChat 二进制文件以获得最新功能
- 监控 API 使用量，避免超出限额
- 保存重要的配置文件，便于团队共享
