import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import type { ComponentDependency, ComponentUsage, PageAnalysis } from '../types/page'

/**
 * 组件分析服务
 * 负责分析页面文件中的组件使用情况
 */
export class ComponentAnalyzer {
  private static instance: ComponentAnalyzer | null = null

  static getInstance(): ComponentAnalyzer {
    if (!ComponentAnalyzer.instance) {
      ComponentAnalyzer.instance = new ComponentAnalyzer()
    }
    return ComponentAnalyzer.instance
  }

  /**
   * 分析页面文件
   */
  async analyzePage(fileContent: string, filePath: string): Promise<PageAnalysis> {
    try {
      const ast = parser.parse(fileContent, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx']
      })

      const analysis: PageAnalysis = {
        filePath,
        componentName: this.extractComponentName(filePath),
        dependencies: [],
        usage: [],
        hooks: [],
        imports: {
          react: [],
          router: [],
          ui: [],
          utils: [],
          custom: []
        },
        exports: {
          named: []
        },
        hasState: false,
        hasEffects: false,
        complexity: 'low'
      }

      // 分析导入
      this.analyzeImports(ast, analysis)
      
      // 分析组件使用
      this.analyzeComponentUsage(ast, analysis)
      
      // 分析 Hooks 使用
      this.analyzeHooks(ast, analysis)
      
      // 分析导出
      this.analyzeExports(ast, analysis)
      
      // 评估复杂度
      this.evaluateComplexity(analysis)

      return analysis
    } catch (error) {
      console.error('分析页面文件失败:', error)
      return this.createEmptyAnalysis(filePath)
    }
  }

  /**
   * 分析导入语句
   */
  private analyzeImports(ast: t.File, analysis: PageAnalysis): void {
    traverse(ast, {
      ImportDeclaration: (path) => {
        const source = path.node.source.value
        const dependency: ComponentDependency = {
          name: '',
          source,
          type: 'default',
          isLocal: this.isLocalImport(source)
        }

        path.node.specifiers.forEach(spec => {
          if (t.isImportDefaultSpecifier(spec)) {
            dependency.name = spec.local.name
            dependency.type = 'default'
          } else if (t.isImportSpecifier(spec)) {
            const importedName = t.isIdentifier(spec.imported) 
              ? spec.imported.name 
              : spec.imported.value
            dependency.name = spec.local.name
            dependency.type = 'named'
          } else if (t.isImportNamespaceSpecifier(spec)) {
            dependency.name = spec.local.name
            dependency.type = 'namespace'
          }

          // 分类导入
          this.categorizeImport(dependency, analysis)
          analysis.dependencies.push({ ...dependency })
        })
      }
    })
  }

  /**
   * 分析组件使用情况
   */
  private analyzeComponentUsage(ast: t.File, analysis: PageAnalysis): void {
    const componentUsage = new Map<string, ComponentUsage>()

    traverse(ast, {
      JSXElement: (path) => {
        const elementName = this.getJSXElementName(path.node)
        if (elementName) {
          const existing = componentUsage.get(elementName)
          if (existing) {
            existing.count++
          } else {
            componentUsage.set(elementName, {
              component: elementName,
              count: 1,
              props: this.extractProps(path.node),
              children: path.node.children.length > 0
            })
          }
        }
      }
    })

    analysis.usage = Array.from(componentUsage.values())
  }

  /**
   * 分析 Hooks 使用
   */
  private analyzeHooks(ast: t.File, analysis: PageAnalysis): void {
    const hooks = new Set<string>()

    traverse(ast, {
      CallExpression: (path) => {
        if (t.isIdentifier(path.node.callee)) {
          const name = path.node.callee.name
          if (name.startsWith('use') && name.length > 3) {
            hooks.add(name)
            
            // 检查状态和副作用
            if (name === 'useState' || name === 'useReducer') {
              analysis.hasState = true
            }
            if (name === 'useEffect' || name === 'useLayoutEffect') {
              analysis.hasEffects = true
            }
          }
        }
      }
    })

    analysis.hooks = Array.from(hooks)
  }

  /**
   * 分析导出
   */
  private analyzeExports(ast: t.File, analysis: PageAnalysis): void {
    traverse(ast, {
      ExportDefaultDeclaration: (path) => {
        if (t.isIdentifier(path.node.declaration)) {
          analysis.exports.default = path.node.declaration.name
        } else if (t.isFunctionDeclaration(path.node.declaration) && path.node.declaration.id) {
          analysis.exports.default = path.node.declaration.id.name
        }
      },
      ExportNamedDeclaration: (path) => {
        if (path.node.declaration) {
          if (t.isFunctionDeclaration(path.node.declaration) && path.node.declaration.id) {
            analysis.exports.named.push(path.node.declaration.id.name)
          } else if (t.isVariableDeclaration(path.node.declaration)) {
            path.node.declaration.declarations.forEach(decl => {
              if (t.isIdentifier(decl.id)) {
                analysis.exports.named.push(decl.id.name)
              }
            })
          }
        }
        
        if (path.node.specifiers) {
          path.node.specifiers.forEach(spec => {
            if (t.isExportSpecifier(spec)) {
              const exportedName = t.isIdentifier(spec.exported) 
                ? spec.exported.name 
                : spec.exported.value
              analysis.exports.named.push(exportedName)
            }
          })
        }
      }
    })
  }

  /**
   * 评估复杂度
   */
  private evaluateComplexity(analysis: PageAnalysis): void {
    let score = 0

    // 基于不同因素计算复杂度分数
    score += analysis.dependencies.length * 0.5
    score += analysis.usage.length * 1
    score += analysis.hooks.length * 2
    score += analysis.hasState ? 3 : 0
    score += analysis.hasEffects ? 2 : 0

    if (score < 10) {
      analysis.complexity = 'low'
    } else if (score < 25) {
      analysis.complexity = 'medium'
    } else {
      analysis.complexity = 'high'
    }
  }

  /**
   * 提取组件名称
   */
  private extractComponentName(filePath: string): string {
    const fileName = filePath.split('/').pop() || ''
    return fileName.replace(/\.(tsx?|jsx?)$/, '')
  }

  /**
   * 判断是否是本地导入
   */
  private isLocalImport(source: string): boolean {
    return source.startsWith('./') || source.startsWith('../') || source.startsWith('@/')
  }

  /**
   * 分类导入
   */
  private categorizeImport(dependency: ComponentDependency, analysis: PageAnalysis): void {
    const { source, name } = dependency

    if (source === 'react' || source.startsWith('react/')) {
      analysis.imports.react.push(name)
    } else if (source.includes('router')) {
      analysis.imports.router.push(name)
    } else if (this.isUILibrary(source)) {
      analysis.imports.ui.push(name)
    } else if (this.isUtilLibrary(source)) {
      analysis.imports.utils.push(name)
    } else {
      analysis.imports.custom.push(name)
    }
  }

  /**
   * 判断是否是 UI 库
   */
  private isUILibrary(source: string): boolean {
    const uiLibraries = [
      'antd', '@ant-design', 'react-bootstrap', '@mui', 'material-ui',
      'chakra-ui', '@chakra-ui', 'semantic-ui', 'react-semantic-ui',
      '@headlessui', '@radix-ui', 'mantine', '@mantine'
    ]
    return uiLibraries.some(lib => source.includes(lib))
  }

  /**
   * 判断是否是工具库
   */
  private isUtilLibrary(source: string): boolean {
    const utilLibraries = [
      'lodash', 'ramda', 'date-fns', 'moment', 'dayjs',
      'axios', 'fetch', 'swr', 'react-query', '@tanstack/react-query',
      'zustand', 'redux', '@reduxjs', 'mobx'
    ]
    return utilLibraries.some(lib => source.includes(lib))
  }

  /**
   * 获取 JSX 元素名称
   */
  private getJSXElementName(element: t.JSXElement): string | null {
    const name = element.openingElement.name
    if (t.isJSXIdentifier(name)) {
      return name.name
    } else if (t.isJSXMemberExpression(name)) {
      // 处理 Ant.Button 这样的情况
      return this.getJSXMemberExpressionName(name)
    }
    return null
  }

  /**
   * 获取 JSX 成员表达式名称
   */
  private getJSXMemberExpressionName(expr: t.JSXMemberExpression): string {
    const object = expr.object
    const property = expr.property
    
    if (t.isJSXIdentifier(object) && t.isJSXIdentifier(property)) {
      return `${object.name}.${property.name}`
    }
    return ''
  }

  /**
   * 提取组件属性
   */
  private extractProps(element: t.JSXElement): string[] {
    const props: string[] = []
    
    element.openingElement.attributes.forEach(attr => {
      if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
        props.push(attr.name.name)
      }
    })
    
    return props
  }

  /**
   * 创建空的分析结果
   */
  private createEmptyAnalysis(filePath: string): PageAnalysis {
    return {
      filePath,
      componentName: this.extractComponentName(filePath),
      dependencies: [],
      usage: [],
      hooks: [],
      imports: {
        react: [],
        router: [],
        ui: [],
        utils: [],
        custom: []
      },
      exports: {
        named: []
      },
      hasState: false,
      hasEffects: false,
      complexity: 'low'
    }
  }
}
