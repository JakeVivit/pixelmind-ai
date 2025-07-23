import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import type { RouteInfo } from '../types/page'

/**
 * 路由解析服务
 * 负责解析 React Router 配置文件，提取路由信息
 */
export class RouteAnalyzer {
  private static instance: RouteAnalyzer | null = null

  static getInstance(): RouteAnalyzer {
    if (!RouteAnalyzer.instance) {
      RouteAnalyzer.instance = new RouteAnalyzer()
    }
    return RouteAnalyzer.instance
  }

  /**
   * 解析路由配置文件
   */
  async analyzeRouterFile(fileContent: string, filePath: string): Promise<RouteInfo[]> {
    try {
      const ast = parser.parse(fileContent, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx']
      })

      const routes: RouteInfo[] = []
      const imports = new Map<string, string>() // 组件名 -> 导入路径

      // 首先收集所有导入
      traverse(ast, {
        ImportDeclaration(path) {
          const source = path.node.source.value
          path.node.specifiers.forEach(spec => {
            if (t.isImportDefaultSpecifier(spec)) {
              imports.set(spec.local.name, source)
            } else if (t.isImportSpecifier(spec)) {
              const importedName = t.isIdentifier(spec.imported) 
                ? spec.imported.name 
                : spec.imported.value
              imports.set(spec.local.name, source)
            }
          })
        }
      })

      // 然后解析路由配置
      traverse(ast, {
        JSXElement(path) {
          if (this.isRouteElement(path.node)) {
            const route = this.parseRouteElement(path.node, imports)
            if (route) {
              routes.push(route)
            }
          }
        }
      })

      return routes
    } catch (error) {
      console.error('解析路由文件失败:', error)
      return []
    }
  }

  /**
   * 判断是否是 Route 元素
   */
  private isRouteElement(node: t.JSXElement): boolean {
    if (t.isJSXIdentifier(node.openingElement.name)) {
      return node.openingElement.name.name === 'Route'
    }
    return false
  }

  /**
   * 解析单个 Route 元素
   */
  private parseRouteElement(node: t.JSXElement, imports: Map<string, string>): RouteInfo | null {
    const attributes = node.openingElement.attributes
    let path = ''
    let component = ''
    let element = ''
    let isExact = false

    // 解析属性
    attributes.forEach(attr => {
      if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
        const name = attr.name.name
        const value = attr.value

        if (name === 'path' && t.isStringLiteral(value)) {
          path = value.value
        } else if (name === 'component' && t.isJSXExpressionContainer(value)) {
          if (t.isIdentifier(value.expression)) {
            component = value.expression.name
          }
        } else if (name === 'element' && t.isJSXExpressionContainer(value)) {
          // 处理 element={<Component />} 形式
          if (t.isJSXElement(value.expression)) {
            const elementName = value.expression.openingElement.name
            if (t.isJSXIdentifier(elementName)) {
              element = elementName.name
            }
          }
        } else if (name === 'exact') {
          isExact = true
        }
      }
    })

    const componentName = component || element
    if (!path || !componentName) {
      return null
    }

    // 获取组件文件路径
    const importPath = imports.get(componentName)
    const filePath = this.resolveComponentPath(importPath, componentName)

    // 解析嵌套路由
    const children: RouteInfo[] = []
    node.children?.forEach(child => {
      if (t.isJSXElement(child) && this.isRouteElement(child)) {
        const childRoute = this.parseRouteElement(child, imports)
        if (childRoute) {
          children.push(childRoute)
        }
      }
    })

    return {
      id: this.generateRouteId(path, componentName),
      path,
      component: componentName,
      filePath,
      isExact,
      children: children.length > 0 ? children : undefined
    }
  }

  /**
   * 解析组件文件路径
   */
  private resolveComponentPath(importPath: string | undefined, componentName: string): string {
    if (!importPath) {
      return `src/pages/${componentName}.tsx`
    }

    // 处理相对路径
    if (importPath.startsWith('./') || importPath.startsWith('../')) {
      return importPath.replace(/^\.\//, 'src/').replace(/^\.\.\//, '') + '.tsx'
    }

    // 处理绝对路径
    if (importPath.startsWith('@/')) {
      return importPath.replace('@/', 'src/') + '.tsx'
    }

    // 处理 pages 目录
    if (importPath.includes('/pages/')) {
      return importPath + '.tsx'
    }

    return `src/pages/${componentName}.tsx`
  }

  /**
   * 生成路由 ID
   */
  private generateRouteId(path: string, component: string): string {
    return `route_${path.replace(/[^a-zA-Z0-9]/g, '_')}_${component}`
  }

  /**
   * 分析路由配置的复杂模式
   * 支持更复杂的路由配置，如 createBrowserRouter
   */
  async analyzeAdvancedRouter(fileContent: string): Promise<RouteInfo[]> {
    try {
      const ast = parser.parse(fileContent, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx']
      })

      const routes: RouteInfo[] = []
      const imports = new Map<string, string>()

      // 收集导入
      traverse(ast, {
        ImportDeclaration(path) {
          const source = path.node.source.value
          path.node.specifiers.forEach(spec => {
            if (t.isImportDefaultSpecifier(spec)) {
              imports.set(spec.local.name, source)
            } else if (t.isImportSpecifier(spec)) {
              const importedName = t.isIdentifier(spec.imported) 
                ? spec.imported.name 
                : spec.imported.value
              imports.set(spec.local.name, source)
            }
          })
        }
      })

      // 查找 createBrowserRouter 或路由配置数组
      traverse(ast, {
        CallExpression(path) {
          if (t.isIdentifier(path.node.callee) && 
              (path.node.callee.name === 'createBrowserRouter' || 
               path.node.callee.name === 'createHashRouter')) {
            const routeConfig = path.node.arguments[0]
            if (t.isArrayExpression(routeConfig)) {
              const parsedRoutes = this.parseRouteConfigArray(routeConfig, imports)
              routes.push(...parsedRoutes)
            }
          }
        },
        VariableDeclarator(path) {
          if (t.isIdentifier(path.node.id) && 
              path.node.id.name.toLowerCase().includes('route') &&
              t.isArrayExpression(path.node.init)) {
            const parsedRoutes = this.parseRouteConfigArray(path.node.init, imports)
            routes.push(...parsedRoutes)
          }
        }
      })

      return routes
    } catch (error) {
      console.error('解析高级路由配置失败:', error)
      return []
    }
  }

  /**
   * 解析路由配置数组
   */
  private parseRouteConfigArray(arrayExpr: t.ArrayExpression, imports: Map<string, string>): RouteInfo[] {
    const routes: RouteInfo[] = []

    arrayExpr.elements.forEach(element => {
      if (t.isObjectExpression(element)) {
        const route = this.parseRouteConfigObject(element, imports)
        if (route) {
          routes.push(route)
        }
      }
    })

    return routes
  }

  /**
   * 解析路由配置对象
   */
  private parseRouteConfigObject(objExpr: t.ObjectExpression, imports: Map<string, string>): RouteInfo | null {
    let path = ''
    let component = ''
    let element = ''
    let children: RouteInfo[] = []

    objExpr.properties.forEach(prop => {
      if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
        const key = prop.key.name

        if (key === 'path' && t.isStringLiteral(prop.value)) {
          path = prop.value.value
        } else if (key === 'component' && t.isIdentifier(prop.value)) {
          component = prop.value.name
        } else if (key === 'element') {
          if (t.isJSXElement(prop.value)) {
            const elementName = prop.value.openingElement.name
            if (t.isJSXIdentifier(elementName)) {
              element = elementName.name
            }
          }
        } else if (key === 'children' && t.isArrayExpression(prop.value)) {
          children = this.parseRouteConfigArray(prop.value, imports)
        }
      }
    })

    const componentName = component || element
    if (!path || !componentName) {
      return null
    }

    const importPath = imports.get(componentName)
    const filePath = this.resolveComponentPath(importPath, componentName)

    return {
      id: this.generateRouteId(path, componentName),
      path,
      component: componentName,
      filePath,
      children: children.length > 0 ? children : undefined
    }
  }
}
