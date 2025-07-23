import { RouteAnalyzer } from './RouteAnalyzer'
import { ComponentAnalyzer } from './ComponentAnalyzer'
import { ProjectManager } from '../../projects/services/ProjectManager'
import type { 
  PageInfo, 
  RouteInfo, 
  ProjectPageStructure, 
  PageManagerConfig,
  PageManagerState,
  PageFilter,
  CreatePageConfig
} from '../types/page'

/**
 * 页面管理服务
 * 整合路由解析和组件分析，提供统一的页面管理接口
 */
export class PageManager {
  private static instance: PageManager | null = null
  private routeAnalyzer: RouteAnalyzer
  private componentAnalyzer: ComponentAnalyzer
  private projectManager: ProjectManager
  private state: PageManagerState
  private listeners: Set<(state: PageManagerState) => void> = new Set()

  private constructor() {
    this.routeAnalyzer = RouteAnalyzer.getInstance()
    this.componentAnalyzer = ComponentAnalyzer.getInstance()
    this.projectManager = ProjectManager.getInstance()
    this.state = {
      isLoading: false,
      isAnalyzing: false,
      error: null,
      structure: null,
      selectedPage: null,
      filter: {}
    }
  }

  static getInstance(): PageManager {
    if (!PageManager.instance) {
      PageManager.instance = new PageManager()
    }
    return PageManager.instance
  }

  /**
   * 分析项目页面结构
   */
  async analyzeProject(projectId: string, config?: Partial<PageManagerConfig>): Promise<ProjectPageStructure> {
    this.updateState({ isAnalyzing: true, error: null })

    try {
      // 获取项目文件
      const projectFiles = await this.projectManager.getProjectFiles(projectId)
      
      const defaultConfig: PageManagerConfig = {
        projectPath: '',
        pagesDirectory: 'src/pages',
        routerFile: 'src/router/index.tsx',
        autoAnalyze: true,
        watchFiles: false,
        ...config
      }

      // 分析路由配置
      const routes = await this.analyzeRoutes(projectFiles, defaultConfig)
      
      // 分析页面文件
      const pages = await this.analyzePages(projectFiles, routes, defaultConfig)
      
      // 生成项目结构
      const structure: ProjectPageStructure = {
        projectId,
        pages,
        routes,
        components: this.analyzeComponentStatistics(pages),
        dependencies: this.analyzeDependencyStatistics(pages),
        lastAnalyzed: new Date()
      }

      this.updateState({ 
        structure, 
        isAnalyzing: false,
        selectedPage: pages.length > 0 ? pages[0] : null
      })

      return structure
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '分析失败'
      this.updateState({ 
        isAnalyzing: false, 
        error: errorMessage 
      })
      throw error
    }
  }

  /**
   * 分析路由配置
   */
  private async analyzeRoutes(
    projectFiles: Record<string, string>, 
    config: PageManagerConfig
  ): Promise<RouteInfo[]> {
    const routerFiles = [
      config.routerFile,
      'src/router/index.ts',
      'src/App.tsx',
      'src/app.tsx'
    ]

    for (const routerFile of routerFiles) {
      if (projectFiles[routerFile]) {
        try {
          // 尝试解析标准路由配置
          let routes = await this.routeAnalyzer.analyzeRouterFile(
            projectFiles[routerFile], 
            routerFile
          )
          
          // 如果标准解析失败，尝试高级解析
          if (routes.length === 0) {
            routes = await this.routeAnalyzer.analyzeAdvancedRouter(
              projectFiles[routerFile]
            )
          }
          
          if (routes.length > 0) {
            return routes
          }
        } catch (error) {
          console.warn(`解析路由文件 ${routerFile} 失败:`, error)
        }
      }
    }

    // 如果没有找到路由配置，扫描页面目录
    return this.scanPagesDirectory(projectFiles, config.pagesDirectory)
  }

  /**
   * 扫描页面目录
   */
  private scanPagesDirectory(
    projectFiles: Record<string, string>, 
    pagesDir: string
  ): RouteInfo[] {
    const routes: RouteInfo[] = []
    const pageFiles = Object.keys(projectFiles).filter(path => 
      path.startsWith(pagesDir) && /\.(tsx?|jsx?)$/.test(path)
    )

    pageFiles.forEach(filePath => {
      const relativePath = filePath.replace(pagesDir + '/', '')
      const componentName = relativePath.replace(/\.(tsx?|jsx?)$/, '')
      
      // 生成路由路径
      let routePath = '/' + componentName.toLowerCase()
      if (componentName.toLowerCase() === 'home' || componentName.toLowerCase() === 'index') {
        routePath = '/'
      }

      routes.push({
        id: `route_${componentName}`,
        path: routePath,
        component: componentName,
        filePath
      })
    })

    return routes
  }

  /**
   * 分析页面文件
   */
  private async analyzePages(
    projectFiles: Record<string, string>,
    routes: RouteInfo[],
    config: PageManagerConfig
  ): Promise<PageInfo[]> {
    const pages: PageInfo[] = []

    for (const route of routes) {
      if (projectFiles[route.filePath]) {
        try {
          const analysis = await this.componentAnalyzer.analyzePage(
            projectFiles[route.filePath],
            route.filePath
          )

          const fileContent = projectFiles[route.filePath]
          const page: PageInfo = {
            id: route.id,
            name: route.component,
            route,
            analysis,
            lastModified: new Date(), // 实际项目中应该从文件系统获取
            size: new Blob([fileContent]).size,
            lines: fileContent.split('\n').length
          }

          pages.push(page)
        } catch (error) {
          console.warn(`分析页面 ${route.filePath} 失败:`, error)
        }
      }
    }

    return pages
  }

  /**
   * 分析组件统计信息
   */
  private analyzeComponentStatistics(pages: PageInfo[]) {
    const componentUsage = new Map<string, { count: number; pages: string[] }>()
    let localCount = 0
    let externalCount = 0

    pages.forEach(page => {
      page.analysis.usage.forEach(usage => {
        const existing = componentUsage.get(usage.component)
        if (existing) {
          existing.count += usage.count
          existing.pages.push(page.name)
        } else {
          componentUsage.set(usage.component, {
            count: usage.count,
            pages: [page.name]
          })
        }
      })

      page.analysis.dependencies.forEach(dep => {
        if (dep.isLocal) {
          localCount++
        } else {
          externalCount++
        }
      })
    })

    const mostUsed = Array.from(componentUsage.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      total: componentUsage.size,
      local: localCount,
      external: externalCount,
      mostUsed
    }
  }

  /**
   * 分析依赖统计信息
   */
  private analyzeDependencyStatistics(pages: PageInfo[]) {
    const dependencies = {
      react: new Set<string>(),
      router: new Set<string>(),
      ui: new Set<string>(),
      utils: new Set<string>(),
      external: new Set<string>()
    }

    pages.forEach(page => {
      page.analysis.imports.react.forEach(dep => dependencies.react.add(dep))
      page.analysis.imports.router.forEach(dep => dependencies.router.add(dep))
      page.analysis.imports.ui.forEach(dep => dependencies.ui.add(dep))
      page.analysis.imports.utils.forEach(dep => dependencies.utils.add(dep))
      page.analysis.imports.custom.forEach(dep => dependencies.external.add(dep))
    })

    return {
      react: Array.from(dependencies.react),
      router: Array.from(dependencies.router),
      ui: Array.from(dependencies.ui),
      utils: Array.from(dependencies.utils),
      external: Array.from(dependencies.external)
    }
  }

  /**
   * 获取当前状态
   */
  getState(): PageManagerState {
    return { ...this.state }
  }

  /**
   * 订阅状态变化
   */
  subscribe(listener: (state: PageManagerState) => void): () => void {
    this.listeners.add(listener)
    // 立即发送当前状态
    listener(this.getState())
    
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * 更新状态
   */
  private updateState(updates: Partial<PageManagerState>): void {
    this.state = { ...this.state, ...updates }
    this.notifyListeners()
  }

  /**
   * 通知监听器
   */
  private notifyListeners(): void {
    const currentState = this.getState()
    this.listeners.forEach(listener => {
      try {
        listener(currentState)
      } catch (error) {
        console.error('页面管理状态监听器错误:', error)
      }
    })
  }

  /**
   * 选择页面
   */
  selectPage(pageId: string): void {
    const page = this.state.structure?.pages.find(p => p.id === pageId)
    if (page) {
      this.updateState({ selectedPage: page })
    }
  }

  /**
   * 设置过滤器
   */
  setFilter(filter: PageFilter): void {
    this.updateState({ filter })
  }

  /**
   * 获取过滤后的页面列表
   */
  getFilteredPages(): PageInfo[] {
    if (!this.state.structure) return []
    
    let pages = this.state.structure.pages
    const filter = this.state.filter

    if (filter.keyword) {
      const keyword = filter.keyword.toLowerCase()
      pages = pages.filter(page => 
        page.name.toLowerCase().includes(keyword) ||
        page.route.path.toLowerCase().includes(keyword)
      )
    }

    if (filter.route) {
      pages = pages.filter(page => 
        page.route.path.includes(filter.route!)
      )
    }

    if (filter.hasComponent) {
      pages = pages.filter(page =>
        page.analysis.usage.some(usage => 
          usage.component.toLowerCase().includes(filter.hasComponent!.toLowerCase())
        )
      )
    }

    if (filter.complexity) {
      pages = pages.filter(page => 
        page.analysis.complexity === filter.complexity
      )
    }

    return pages
  }
}
