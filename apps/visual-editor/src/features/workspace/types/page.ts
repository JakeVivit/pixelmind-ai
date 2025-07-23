/**
 * 页面管理相关的数据类型定义
 */

// 路由信息
export interface RouteInfo {
  id: string
  path: string // 路由路径，如 "/", "/about", "/users/:id"
  component: string // 组件名称，如 "Home", "About", "UserDetail"
  filePath: string // 组件文件路径，如 "src/pages/Home.tsx"
  isExact?: boolean // 是否精确匹配
  children?: RouteInfo[] // 嵌套路由
  meta?: {
    title?: string // 页面标题
    description?: string // 页面描述
    requiresAuth?: boolean // 是否需要认证
    [key: string]: any
  }
}

// 组件依赖信息
export interface ComponentDependency {
  name: string // 组件名称
  source: string // 导入来源，如 "react", "./Button", "@/components/ui"
  type: 'default' | 'named' | 'namespace' // 导入类型
  isLocal: boolean // 是否是本地组件
  filePath?: string // 如果是本地组件，对应的文件路径
}

// 组件使用信息
export interface ComponentUsage {
  component: string // 组件名称
  count: number // 使用次数
  props?: string[] // 使用的属性列表
  children?: boolean // 是否有子元素
}

// 页面分析结果
export interface PageAnalysis {
  filePath: string // 页面文件路径
  componentName: string // 页面组件名称
  dependencies: ComponentDependency[] // 依赖的组件
  usage: ComponentUsage[] // 组件使用情况
  hooks: string[] // 使用的 React Hooks
  imports: {
    react: string[] // React 相关导入
    router: string[] // 路由相关导入
    ui: string[] // UI 组件导入
    utils: string[] // 工具函数导入
    custom: string[] // 自定义导入
  }
  exports: {
    default?: string // 默认导出
    named: string[] // 命名导出
  }
  hasState: boolean // 是否有状态管理
  hasEffects: boolean // 是否有副作用
  complexity: 'low' | 'medium' | 'high' // 复杂度评估
}

// 页面信息
export interface PageInfo {
  id: string
  name: string // 页面名称
  route: RouteInfo // 路由信息
  analysis: PageAnalysis // 页面分析结果
  lastModified: Date // 最后修改时间
  size: number // 文件大小（字节）
  lines: number // 代码行数
}

// 项目页面结构
export interface ProjectPageStructure {
  projectId: string
  pages: PageInfo[] // 所有页面
  routes: RouteInfo[] // 路由树结构
  components: {
    // 全局组件统计
    total: number
    local: number // 本地组件数量
    external: number // 外部组件数量
    mostUsed: Array<{
      name: string
      count: number
      pages: string[] // 使用该组件的页面
    }>
  }
  dependencies: {
    // 依赖统计
    react: string[]
    router: string[]
    ui: string[]
    utils: string[]
    external: string[]
  }
  lastAnalyzed: Date // 最后分析时间
}

// 页面创建配置
export interface CreatePageConfig {
  name: string // 页面名称
  route: string // 路由路径
  template: 'blank' | 'form' | 'list' | 'detail' | 'dashboard' // 页面模板
  directory?: string // 创建目录，默认为 src/pages
  withRoute?: boolean // 是否自动添加路由配置
  components?: string[] // 预设组件
}

// 页面编辑操作
export interface PageEditAction {
  type: 'add-component' | 'remove-component' | 'update-route' | 'rename' | 'move'
  pageId: string
  payload: any
}

// 页面管理器配置
export interface PageManagerConfig {
  projectPath: string // 项目根路径
  pagesDirectory: string // 页面目录，默认 "src/pages"
  routerFile: string // 路由配置文件，默认 "src/router/index.tsx"
  autoAnalyze: boolean // 是否自动分析
  watchFiles: boolean // 是否监听文件变化
}

// 页面搜索过滤器
export interface PageFilter {
  keyword?: string // 关键词搜索
  route?: string // 路由过滤
  hasComponent?: string // 包含特定组件
  complexity?: 'low' | 'medium' | 'high' // 复杂度过滤
  lastModified?: {
    from?: Date
    to?: Date
  }
}

// 页面管理器状态
export interface PageManagerState {
  isLoading: boolean
  isAnalyzing: boolean
  error: string | null
  structure: ProjectPageStructure | null
  selectedPage: PageInfo | null
  filter: PageFilter
}
