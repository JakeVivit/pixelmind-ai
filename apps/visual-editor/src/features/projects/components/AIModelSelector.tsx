import React from 'react'
import { Brain, Zap, DollarSign, Clock } from 'lucide-react'
import { cn } from '../../../utils/cn'

interface AIModel {
  id: string
  name: string
  description: string
  inputPrice: number
  outputPrice: number
  maxTokens: number
  recommended?: boolean
  features: string[]
}

const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: '性价比最高，速度快，适合大多数项目',
    inputPrice: 0.00015,
    outputPrice: 0.0006,
    maxTokens: 128000,
    recommended: true,
    features: ['超低成本', '快速响应', '高质量代码', '大上下文']
  },
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    description: '代码质量最高，适合复杂项目',
    inputPrice: 0.003,
    outputPrice: 0.015,
    maxTokens: 200000,
    features: ['顶级代码质量', '超大上下文', '复杂逻辑处理', '架构设计']
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: '平衡性能和成本，全能型模型',
    inputPrice: 0.005,
    outputPrice: 0.015,
    maxTokens: 128000,
    features: ['平衡性能', '稳定输出', '多任务处理', '可靠性高']
  }
]

interface AIModelSelectorProps {
  selectedModel: string
  onModelChange: (modelId: string) => void
  className?: string
}

export const AIModelSelector: React.FC<AIModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  className
}) => {
  const formatPrice = (price: number) => {
    if (price < 0.001) {
      return `$${(price * 1000).toFixed(2)}/1K tokens`
    }
    return `$${price.toFixed(3)}/1K tokens`
  }

  const getCostRating = (inputPrice: number, outputPrice: number) => {
    const avgPrice = (inputPrice + outputPrice) / 2
    if (avgPrice < 0.001) return { rating: 5, label: '极低成本' }
    if (avgPrice < 0.005) return { rating: 4, label: '低成本' }
    if (avgPrice < 0.01) return { rating: 3, label: '中等成本' }
    return { rating: 2, label: '较高成本' }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          选择 AI 模型
        </h3>
      </div>

      <div className="grid gap-4">
        {AI_MODELS.map((model) => {
          const isSelected = selectedModel === model.id
          const costRating = getCostRating(model.inputPrice, model.outputPrice)

          return (
            <div
              key={model.id}
              className={cn(
                'relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200',
                'hover:shadow-md',
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              )}
              onClick={() => onModelChange(model.id)}
            >
              {/* 推荐标签 */}
              {model.recommended && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  推荐
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {model.name}
                    </h4>
                    <div className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      costRating.rating >= 4 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : costRating.rating >= 3
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    )}>
                      {costRating.label}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {model.description}
                  </p>

                  {/* 特性标签 */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {model.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* 价格和性能信息 */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">输入价格</div>
                        <div className="font-medium">{formatPrice(model.inputPrice)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">输出价格</div>
                        <div className="font-medium">{formatPrice(model.outputPrice)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">上下文长度</div>
                        <div className="font-medium">{(model.maxTokens / 1000).toFixed(0)}K tokens</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-orange-500" />
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">性能等级</div>
                        <div className="font-medium">
                          {model.id.includes('mini') ? '快速' : 
                           model.id.includes('claude') ? '顶级' : '高级'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 选择指示器 */}
                <div className={cn(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center ml-4',
                  isSelected
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300 dark:border-gray-600'
                )}>
                  {isSelected && (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 使用建议 */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          💡 选择建议
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• <strong>首次使用</strong>：推荐 GPT-4o Mini，成本最低，效果很好</li>
          <li>• <strong>复杂项目</strong>：选择 Claude 3.5 Sonnet，代码质量最高</li>
          <li>• <strong>生产项目</strong>：GPT-4o 提供最佳的稳定性和可靠性</li>
        </ul>
      </div>
    </div>
  )
}
