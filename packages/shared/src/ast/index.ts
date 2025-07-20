// AST utilities for code analysis and manipulation

import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'

/**
 * Parse JavaScript/TypeScript code into AST
 */
export function parseCode(
  code: string,
  options: {
    typescript?: boolean
    jsx?: boolean
  } = {}
): t.File {
  const { typescript = true, jsx = true } = options

  const plugins: any[] = []

  if (typescript) {
    plugins.push('typescript')
  }

  if (jsx) {
    plugins.push('jsx')
  }

  return parse(code, {
    sourceType: 'module',
    plugins,
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
  })
}

/**
 * Extract component information from React component code
 */
export function extractComponentInfo(code: string): {
  name: string | null
  props: string[]
  imports: string[]
  exports: string[]
} {
  const ast = parseCode(code)
  const result = {
    name: null as string | null,
    props: [] as string[],
    imports: [] as string[],
    exports: [] as string[],
  }

  traverse(ast, {
    // Extract imports
    ImportDeclaration(path: any) {
      if (t.isStringLiteral(path.node.source)) {
        result.imports.push(path.node.source.value)
      }
    },

    // Extract exports
    ExportDefaultDeclaration(path: any) {
      if (t.isIdentifier(path.node.declaration)) {
        result.exports.push(path.node.declaration.name)
      }
    },

    ExportNamedDeclaration(path: any) {
      if (path.node.specifiers) {
        path.node.specifiers.forEach((spec: any) => {
          if (t.isExportSpecifier(spec) && t.isIdentifier(spec.exported)) {
            result.exports.push(spec.exported.name)
          }
        })
      }
    },

    // Extract function component info
    FunctionDeclaration(path: any) {
      if (t.isIdentifier(path.node.id)) {
        result.name = path.node.id.name

        // Extract props from function parameters
        if (path.node.params.length > 0) {
          const firstParam = path.node.params[0]
          if (t.isObjectPattern(firstParam)) {
            firstParam.properties.forEach((prop: any) => {
              if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
                result.props.push(prop.key.name)
              }
            })
          }
        }
      }
    },

    // Extract arrow function component info
    VariableDeclarator(path: any) {
      if (t.isIdentifier(path.node.id) && t.isArrowFunctionExpression(path.node.init)) {
        result.name = path.node.id.name

        // Extract props from arrow function parameters
        if (path.node.init.params.length > 0) {
          const firstParam = path.node.init.params[0]
          if (t.isObjectPattern(firstParam)) {
            firstParam.properties.forEach((prop: any) => {
              if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
                result.props.push(prop.key.name)
              }
            })
          }
        }
      }
    },
  })

  return result
}

/**
 * Check if code contains JSX
 */
export function containsJSX(code: string): boolean {
  try {
    const ast = parseCode(code)
    let hasJSX = false

    traverse(ast, {
      JSXElement() {
        hasJSX = true
      },
      JSXFragment() {
        hasJSX = true
      },
    })

    return hasJSX
  } catch {
    return false
  }
}

/**
 * Extract all JSX element names from code
 */
export function extractJSXElements(code: string): string[] {
  const ast = parseCode(code)
  const elements: string[] = []

  traverse(ast, {
    JSXElement(path: any) {
      if (t.isJSXIdentifier(path.node.openingElement.name)) {
        elements.push(path.node.openingElement.name.name)
      }
    },
  })

  return [...new Set(elements)] // Remove duplicates
}

/**
 * Validate if code is syntactically correct
 */
export function validateCode(code: string): {
  valid: boolean
  error?: string
} {
  try {
    parseCode(code)
    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown parsing error',
    }
  }
}
