import * as ts from 'typescript'
import * as glob from 'glob'
import * as fs from 'fs'

const isAccessed = Symbol('isAccessed')

// 解析 dts enum
export function parseDTSEnumFac (): Function {
  let enumJson: Record<string, string | number> = {}
  return (dir: string) => {
    function delintNode (node: ts.Node): void {
      if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
        const body = (node as ts.ModuleDeclaration).body
        if ((body != null) && ts.isModuleBlock(body)) {
          const namespace = handleNamespace(node as ts.ModuleDeclaration)
          const currentNamespaceEnum = handleEnums(body, namespace)
          enumJson = {
            ...enumJson,
            ...currentNamespaceEnum
          }
        }
      }
      if (node.kind === ts.SyntaxKind.EnumDeclaration) {
        if (!(node as any)[isAccessed]) {
          const globalEnumJson = handleEnums(node, '')
          enumJson = {
            ...enumJson,
            ...globalEnumJson
          }
        }
      }

      ts.forEachChild(node, delintNode)
    }
    const files = getDTSFiles(dir)
    const sourceFiles = files.map(file => {
      return ts.createSourceFile(file, fs.readFileSync(file, 'utf-8'), ts.ScriptTarget.ESNext, true)
    })
    sourceFiles.forEach(sourceFile => {
      delintNode(sourceFile)
    })
    return enumJson
  }
}

export function getDTSFiles (dir: string): string[] {
  if (!fs.statSync(dir).isDirectory()) {
    return [dir]
  } else {
    const dtsFiles = glob.sync('**/*.d.ts', { cwd: dir, absolute: true })
    return dtsFiles
  }
}

/* 处理 dts 的 namespace */
function handleNamespace (node: ts.ModuleDeclaration): string {
  const arr: string[] = []
  while (ts.isModuleDeclaration(node)) {
    arr.unshift(node.name.getText())
    node = node.parent as ts.ModuleDeclaration
  }
  return arr.join('.')
}
/**
 * 处理 枚举值的 value 谨慎使用 getText 字符串会变为 "'xxx'"格式
 * 数字(负数 PrefixUnaryExpression) 字符串 布尔
 */
function handleValue (node: ts.Node): string | number | boolean | undefined {
  if (ts.isNumericLiteral(node) || ts.isPrefixUnaryExpression(node)) {
    return Number(node.getText())
  }
  if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return true
  }
  if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return false
  }
  if (ts.isStringLiteral(node)) {
    return node.text
  }
  throw new Error(`${node.parent.getText()} parse error`)
}

/* 处理当前 namespace 下面的 枚举值 */
function handleEnums (
  node: ts.Node,
  namespace: string,
  result: Record<string, number | string> = {}
): Record<string, number | string> {
  ts.forEachChild(node, (child: ts.Node) => {
    handleEnums(child, namespace, result)
  })
  if (node?.kind === ts.SyntaxKind.EnumDeclaration) {
    const enumName = (node as ts.EnumDeclaration).name.text
    const members = Array.from((node as ts.EnumDeclaration).members) || [] as ts.EnumMember[]
    (node as any)[isAccessed] = true

    let prev: string | number | boolean = -1 // 被缺省的时候一定是数字
    const obj = members.reduce<Record<string, string | number | boolean>>((result, member) => {
      const memberName = (member).name.getText()
      const key = namespace ? `${namespace}.${enumName}.${memberName}` : `${enumName}.${memberName}`
      if (!member.initializer) {
        return {
          ...result,
          [key]: typeof prev === 'string' ? memberName : ++(prev as number)
        }
      } else {
        prev = handleValue(member.initializer)!
        return {
          ...result,
          [key]: prev
        }
      }
    }, {})
    result = Object.assign(result, obj)
  }
  return result
}
